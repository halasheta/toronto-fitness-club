from datetime import datetime

import pytz
from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from classes.models import ClassOccurrence
from payments.models import Payment, PaymentMethod
from .models import Subscription
from .serializers import SubscriptionSerializer, ViewSubscriptionSerializer


# Admin classes
class CreateSubscriptionView(generics.CreateAPIView):
    """
        Creates a Subscription to the gym.
    """
    serializer_class = SubscriptionSerializer
    queryset = Subscription.objects.all()
    permission_classes = [permissions.IsAdminUser, permissions.IsAuthenticated]


class UpdateSubscriptionView(generics.RetrieveUpdateAPIView):
    """
        Edits a Subscription to the gym.
    """
    serializer_class = SubscriptionSerializer
    queryset = Subscription.objects.all()
    permission_classes = [permissions.IsAdminUser, permissions.IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Subscription, id=self.kwargs["subscr_id"])

    def update(self, request, *args, **kwargs):
        subscription = self.get_object()

        # query all future payment instances already created for this subscription
        # and delete them
        Payment.objects.filter(subscription=subscription, charged=False).delete()

        serializer = SubscriptionSerializer(subscription, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(status=status.HTTP_200_OK, data=serializer.data)
        return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "Error editing subscription"})


class SeeSubscriptionView(generics.RetrieveAPIView):
    """
        Displays a subscription at the gym.
    """
    serializer_class = SubscriptionSerializer
    queryset = Subscription.objects.all()
    permission_classes = [permissions.IsAdminUser, permissions.IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Subscription, id=self.kwargs["subscr_id"])


class DeleteSubscriptionView(generics.DestroyAPIView):
    """
        Deletes a subscription at the gym.
    """
    serializer_class = SubscriptionSerializer
    queryset = Subscription.objects.all()
    permission_classes = [permissions.IsAdminUser, permissions.IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Subscription, id=self.kwargs["subscr_id"])

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        # delete all future payments associated with this subscription
        Payment.objects.filter(subscription=instance, charged=False).delete()

        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


# User classes
class ListSubscriptionsView(generics.ListAPIView):
    """
        Lists all Subscription plans at the gym.
    """
    serializer_class = ViewSubscriptionSerializer

    def get_queryset(self):
        return Subscription.objects.all().order_by('-pk')


class UserSubscribeView(generics.UpdateAPIView):
    """
        Subscribes a user to a specific Subscription.
    """
    serializer_class = ViewSubscriptionSerializer
    queryset = Subscription.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Subscription, pk=self.kwargs["subscr_id"])

    def update(self, request, *args, **kwargs):
        subscription = self.get_object()

        # check if user is already subscribed
        if Subscription.objects.filter(pk=subscription.pk, users__id=request.user.pk).exists():
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "User is already subscribed to this subscription."})

        # check if user has a valid PaymentMethod set up
        user_pay = PaymentMethod.objects.filter(user__id=request.user.pk)
        if not user_pay.exists():
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "User does not have an existing payment method."})

        # if user is subscribed to another subscription, remove user from it
        # delete all old future payments, and instantiate next payment
        try:
            old_sub = get_object_or_404(Subscription, users__id=request.user.id)
            old_sub.users.remove(request.user)
            Payment.objects.filter(subscription=old_sub, user=request.user, charged=False) \
                .filter(date__gte=datetime.today()).delete()
            last_pay = Payment.objects.filter(user=request.user, charged=True) \
                .order_by('date__year', 'date__month', 'date__day', 'date__hour',
                          'date__minute').last()

            new_date = last_pay.valid_until
            self.update_payment(request, subscription, new_date)
            subscription.users.add(request.user)
        except Http404:
            # user is not subscribed to another subscription, so instantiate
            # payment and charge if applicable
            subscription.users.add(request.user)
            self.make_payment(request, subscription)

        return Response(status=status.HTTP_200_OK, data={"message": "User is now subscribed."})

    def make_payment(self, request, subscription):
        curr_date = datetime.today().replace(tzinfo=timezone.get_current_timezone())
        pay = request.user.payment_method
        last_payment = Payment.objects.filter(user=request.user, charged=True).last()

        if last_payment is None or last_payment.valid_until.replace(tzinfo=timezone.get_current_timezone()) < curr_date:
            # user has no existing payments or last payment is no longer valid
            expiry_date = curr_date.replace(tzinfo=timezone.get_current_timezone()) + subscription.duration_num
            Payment.objects.create(amount=subscription.price, user=request.user,
                                   date=curr_date.replace(tzinfo=timezone.get_current_timezone()), subscription=subscription,
                                   credit_number=pay.credit_number,
                                   credit_code=pay.credit_code, charged=True, valid_until=expiry_date)
            next_date = expiry_date
        else:
            # last payment is valid, so instantiate future uncharged payment
            last_date = last_payment.valid_until.replace(tzinfo=timezone.get_current_timezone())
            expiry_date = last_date + subscription.duration_num

            Payment.objects.create(amount=subscription.price, user=request.user,
                                   date=last_date, subscription=subscription,
                                   credit_number=pay.credit_number,
                                   credit_code=pay.credit_code, charged=False,
                                   valid_until=expiry_date)
            next_date = expiry_date

        expiry_date = next_date + subscription.duration_num
        Payment.objects.create(amount=subscription.price, user=request.user,
                               date=next_date.replace(tzinfo=timezone.get_current_timezone()),
                               subscription=subscription, credit_number=pay.credit_number,
                               credit_code=pay.credit_code, charged=False, valid_until=expiry_date)

    def update_payment(self, request, subscription, new_date):
        pay = request.user.payment_method
        charged = new_date.replace(tzinfo=timezone.get_current_timezone()) < datetime.today().replace(tzinfo=timezone.get_current_timezone())
        expiry = new_date.replace(tzinfo=timezone.get_current_timezone()) + subscription.duration_num
        Payment.objects.create(amount=subscription.price, user=request.user,
                               date=new_date.replace(tzinfo=timezone.get_current_timezone()), subscription=subscription,
                               credit_number=pay.credit_number,
                               credit_code=pay.credit_code, charged=charged, valid_until=expiry)


class UnsubscribeView(generics.UpdateAPIView):
    """
        Unsubscribes a user from a specific Subscription.
    """
    serializer_class = ViewSubscriptionSerializer
    queryset = Subscription.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Subscription, pk=self.kwargs["subscr_id"])

    def update(self, request, *args, **kwargs):
        subscription = self.get_object()

        try:
            subscription.users.remove(request.user)

            # delete future uncharged payments
            Payment.objects.filter(user=request.user.pk, subscription=subscription.pk,
                                   charged=False).filter(date__gte=datetime.today()).delete()

            # unenroll user from classes after subscription period
            # find last_date
            last_payment = Payment.objects.filter(user=request.user.pk, subscription=subscription.pk,
                                   charged=True).order_by('date__year', 'date__month',
                                                          'date__day', 'date__hour',
                                                          'date__minute').last()
            last_date = last_payment.date.replace(tzinfo=timezone.get_current_timezone()) + last_payment.subscription.duration_num

            invalid_classes = ClassOccurrence.objects.filter(start_time__gte=last_date, attendees__id=request.user.pk)
            for invalid in invalid_classes:
                invalid.attendees.remove(request.user)

            return Response(status=status.HTTP_200_OK, data={"message": "User has been unsubscribed."})
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "User is already not subscribed to this subscription."})


