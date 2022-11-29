import datetime

from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response

from accounts.models import User
from .permissions import IsSelfOrAdmin

from .models import Payment, PaymentMethod
from .serializers import MakePaymentMethodSerializer, GetPaymentSerializer, \
    GetPaymentMethodSerializer


class CreatePaymentMethodView(generics.CreateAPIView):
    """
        Creates a payment method for the current user.
    """
    serializer_class = MakePaymentMethodSerializer
    queryset = PaymentMethod.objects.all()
    permission_classes = [IsSelfOrAdmin, permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        if hasattr(request.user, 'payment_method'):
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "User already has payment method created. Change payment method via update."})

        return super(CreatePaymentMethodView, self).create(request, *args, **kwargs)


class UpdatePaymentMethodView(generics.RetrieveUpdateAPIView):
    """
        Updates the current user's payment method.
    """
    serializer_class = GetPaymentMethodSerializer
    permission_classes = [IsSelfOrAdmin, permissions.IsAuthenticated]
    lookup_field = "user_id"
    queryset = PaymentMethod.objects.all()

    def get_object(self):
        queryset = self.get_queryset()
        obj = generics.get_object_or_404(queryset, user=self.request.user.pk)
        return obj

    def update(self, request, *args, **kwargs):
        payment = self.get_object()
        serializer = GetPaymentMethodSerializer(payment, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            self.update_payments(request)
            return Response(status=status.HTTP_200_OK, data=serializer.data)
        return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "Invalid card data inputted."})

    def update_payments(self, request):
        curr_date = datetime.datetime.today().replace(tzinfo=timezone.get_current_timezone())
        payments = request.user.payments.iterator()
        for payment in payments:
            if payment.date.replace(tzinfo=timezone.get_current_timezone()) > curr_date.replace(tzinfo=timezone.get_current_timezone()):
                serializer = GetPaymentMethodSerializer(payment, data=request.data, partial=True)
                if serializer.is_valid(raise_exception=True):
                    serializer.save()


class ListPaymentsView(generics.ListAPIView):
    """
        Lists the inputted number of user's past (charged) and future
        payments (uncharged) in chronological order.
    """
    serializer_class = GetPaymentSerializer
    permission_classes = [IsSelfOrAdmin, permissions.IsAuthenticated]

    def get_queryset(self):
        existing = Payment.objects.filter(user=self.request.user.pk) \
            .order_by('date__year', 'date__month', 'date__day', 'date__hour', 'date__minute')
        num_payments = len(existing)
        if num_payments == 0 or self.request.user.subscription is None:
            return existing
        subscription = self.request.user.subscription
        new_date = existing.last().valid_until
        method = existing.last().user.payment_method

        while num_payments < self.kwargs["num"]:
            expiry_date = new_date + subscription.duration_num
            Payment.objects.create(amount=subscription.price, user=self.request.user,
                                   date=new_date.replace(tzinfo=timezone.get_current_timezone()), subscription=subscription,
                                   credit_number=method.credit_number,
                                   credit_code=method.credit_code, valid_until=expiry_date)

            new_date = expiry_date
            num_payments += 1

        return Payment.objects.filter(user=self.request.user.pk) \
            .order_by('date__year', 'date__month', 'date__day', 'date__hour', 'date__minute')


class ListPastPaymentsView(generics.ListAPIView):
    """
        Lists the user's past (charged) payments in chronological order.
    """
    serializer_class = GetPaymentSerializer
    permission_classes = [IsSelfOrAdmin, permissions.IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user.pk, charged=True)\
            .order_by('date__year', 'date__month', 'date__day', 'date__hour', 'date__minute')


class ChargePaymentsView(generics.GenericAPIView):
    """
        Charges payments due on the specified date.
    """
    permission_classes = [permissions.IsAdminUser, permissions.IsAuthenticated]

    def post(self, request):
        # generate future payment instances for all subscribed users
        users = User.objects.all().exclude(subscription__isnull=True)

        for user in users:
            subscription = user.subscription
            existing = Payment.objects.filter(user=user.pk) \
                .order_by('date')

            new_date = existing.last().valid_until
            method = user.payment_method

            expiry_date = new_date + subscription.duration_num
            Payment.objects.create(amount=subscription.price, user=user,
                                   date=new_date, subscription=subscription,
                                   credit_number=method.credit_number,
                                   credit_code=method.credit_code, valid_until=expiry_date)

        # update past payments
        input_date = request.query_params.get('date')

        if input_date is None:
            return Response(status=status.HTTP_404_NOT_FOUND, data={"message": "No date inputted."})

        payments = Payment.objects.filter(charged=False).filter(date__lte=input_date)

        for payment in payments:
            payment.charged = True
            payment.save()

        return Response(status=status.HTTP_200_OK, data={"message": "Payments charged."})



