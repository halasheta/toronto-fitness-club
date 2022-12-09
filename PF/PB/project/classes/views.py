from datetime import datetime, timedelta

from django.http import Http404
from django.utils import timezone
from rest_framework import filters, status
from rest_framework.generics import get_object_or_404, CreateAPIView, UpdateAPIView, DestroyAPIView, ListAPIView, \
    RetrieveAPIView, GenericAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from accounts.models import User
from subscriptions.models import Subscription
from .models import Class, ClassOccurrence
from .serializers import ClassSerializer, ClassOccurrenceSerializer


def create_class_occurrences(instance, start_date):
    # Create ClassOccurrence objects until the end_recurrence date
    curr = start_date
    while curr < instance.end_recurrence:
        t1 = instance.start_time
        start = datetime(curr.year, curr.month, curr.day, hour=t1.hour, minute=t1.minute,
                         tzinfo=timezone.get_current_timezone())

        t2 = instance.end_time
        end = datetime(curr.year, curr.month, curr.day, hour=t2.hour, minute=t2.minute,
                       tzinfo=timezone.get_current_timezone())
        occ = ClassOccurrence.objects.create(class_model=instance,
                                             name=instance.name,
                                             coach=instance.coach,
                                             description=instance.description,
                                             keywords=instance.keywords,
                                             capacity=instance.capacity,
                                             studio=instance.studio,
                                             start_time=start,
                                             end_time=end)
        occ.save()
        curr = curr + timedelta(days=instance.frequency)


# Admin classes
class CreateClass(CreateAPIView):
    """
        Creates a class in a specific studio.
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = ClassSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        instance = serializer.instance
        create_class_occurrences(instance, instance.start_date)
        instance.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class EditClass(RetrieveAPIView, UpdateAPIView):
    """
        Edit a single class occurrence or all future class occurrences
        of a class model in a specific studio.
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = ClassSerializer

    def get_object(self):
        return get_object_or_404(Class, id=self.kwargs["id"])

    def get_queryset(self):
        return Class.objects.all()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # Update one class occurrence
        occ_id = request.query_params.get('occ_id')
        if occ_id is not None:
            c = ClassOccurrence.objects.get(id=occ_id)
            c.name = instance.name
            c.coach = instance.coach
            c.description = instance.description
            c.keywords = instance.keywords
            c.capacity = instance.capacity
            c.studio = instance.studio

            c.start_time = datetime(c.start_time.year,
                                    c.start_time.month,
                                    c.start_time.day,
                                    hour=instance.start_time.hour,
                                    minute=instance.start_time.minute)

            c.end_time = datetime(c.end_time.year,
                                  c.end_time.month,
                                  c.end_time.day,
                                  hour=instance.end_time.hour,
                                  minute=instance.end_time.minute)

            c.save()
            return Response(status=status.HTTP_200_OK, data={"Class occurrence updated."})

        # Update class model and all future occurrences
        all_flag = request.query_params.get('all')
        if all_flag is not None:
            partial = kwargs.pop('partial', False)

            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            # Deal with the case where the new end_recurrence date is more recent
            ClassOccurrence.objects \
                .filter(class_model=instance.pk) \
                .filter(start_time__gte=instance.end_recurrence).delete()

            # Update existing occurrences
            classes = ClassOccurrence.objects.filter(class_model=instance.pk)
            for c in classes:
                c.name = instance.name
                c.coach = instance.coach
                c.description = instance.description
                c.keywords = instance.keywords
                c.capacity = instance.capacity
                c.studio = instance.studio

                c.start_time = datetime(c.start_time.year,
                                        c.start_time.month,
                                        c.start_time.day,
                                        hour=instance.start_time.hour,
                                        minute=instance.start_time.minute,
                                        tzinfo=timezone.get_current_timezone())

                c.end_time = datetime(c.end_time.year,
                                      c.end_time.month,
                                      c.end_time.day,
                                      hour=instance.end_time.hour,
                                      minute=instance.end_time.minute,
                                      tzinfo=timezone.get_current_timezone())

                c.save()

                # Deal with the case where the new end_recurrence date is more recent
            last_date = ClassOccurrence.objects \
                            .filter(class_model=instance.pk) \
                            .order_by('start_time') \
                            .last().start_time + timedelta(days=instance.frequency)

            create_class_occurrences(instance, last_date)
            instance.save()
            print("REACHED***************")
            return Response(serializer.data)


class DeleteClass(DestroyAPIView):
    """
        Deletes a specific class occurrence, all class occurrence instances after
        a given date, or the class model itself that governs the occurrences and all
        its future instances.
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = ClassOccurrenceSerializer

    def get_object(self):
        return get_object_or_404(Class, id=self.kwargs["id"])

    def destroy(self, request, *args, **kwargs):
        obj = self.get_object()

        # Delete a specific ClassOccurrence by its id
        occ_id = request.query_params.get('occ_id')
        if occ_id is not None:
            ClassOccurrence.objects.get(class_model=obj.pk, id=occ_id).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        # Delete all class occurrences after a specific <instances_after> date
        instances_after = request.query_params.get('instances_after')
        if instances_after is not None:
            ClassOccurrence.objects.filter(class_model=obj.pk, start_time__gte=instances_after).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        # Delete the class model itself and all future instances
        all_instances = request.query_params.get('all')
        if all_instances is not None:
            ClassOccurrence.objects.filter(class_model=obj.pk, start_time__gte=timezone.now()).delete()
            Class.objects.get(id=obj.pk).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_404_NOT_FOUND)


# User classes
class EnrolClass(GenericAPIView):
    """
        Enrols the user in either one class occurrence, or a class with all its
        future occurrences.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ClassOccurrenceSerializer

    def post(self, request):
        # Check if user is subscribed
        try:
            get_object_or_404(Subscription, users__id=self.request.user.pk)
        except Http404:
            return Response({'message': 'User does not have an active subscription'},
                            status=status.HTTP_401_UNAUTHORIZED)

        user = User.objects.get(id=self.request.user.pk)
        # One class instance
        occ_id = request.query_params.get('occurrence')
        if occ_id is not None:
            occ = ClassOccurrence.objects.get(id=occ_id)

            if occ.start_time > timezone.now() and occ.attendees.count() < occ.capacity:
                occ.attendees.add(user)
                return Response(status=status.HTTP_200_OK)
            return Response({'message': 'Could not enroll because of capacity constraints'},
                            status=status.HTTP_202_ACCEPTED)

        # All future instances of a class
        class_id = request.query_params.get('class')
        if class_id is not None:
            qs = ClassOccurrence.objects \
                .filter(class_model=class_id) \
                .filter(start_time__gte=timezone.now())

            for obj in qs:
                if obj.attendees.count() < obj.capacity:
                    ClassOccurrence.objects.get(id=obj.id).attendees.add(user)
            return Response(status=status.HTTP_200_OK)

        return Response(status=status.HTTP_404_NOT_FOUND)


class DropClass(GenericAPIView):
    """
        Removes the user from either one class occurrence, or a class with all its
        future occurrences.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ClassOccurrenceSerializer

    def post(self, request):
        # One class instance
        occ_id = request.query_params.get('occurrence')
        if occ_id is not None:
            occ = ClassOccurrence.objects.get(id=occ_id)
            if occ.start_time > timezone.now():
                occ.attendees.remove(User.objects.get(id=self.request.user.id))
                return Response(status=status.HTTP_200_OK)

        # All future instances of a class
        class_id = request.query_params.get('class')
        if class_id is not None:
            qs = ClassOccurrence.objects.filter(class_model=class_id).filter(start_time__gte=timezone.now())
            for obj in qs:
                if self.request.user in obj.attendees.all():
                    ClassOccurrence.objects.get(id=obj.id).attendees.remove(
                        User.objects.get(id=self.request.user.id))
            return Response(status=status.HTTP_200_OK)

        return Response(status=status.HTTP_404_NOT_FOUND)


class UserClassSchedule(ListAPIView):
    """
        Displays the classes that the user has enrolled in, both past and
        future instances.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ClassOccurrenceSerializer

    def get_queryset(self):
        return User.objects.get(id=self.request.user.id).classes.order_by('start_time')


class SearchClasses(ListAPIView):
    """
        Allows users to filter the classes list by name, coach,
        start_time or end_time.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ClassOccurrenceSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        'name': ['icontains'],
        'coach': ['icontains'],
        'start_time': ['gte', 'lte', 'exact'],
        'end_time': ['gte', 'lte', 'exact']
    }

    def get_queryset(self):
        return ClassOccurrence.objects.filter(start_time__gte=timezone.now())


class SearchClassInstances(ListAPIView):
    """
        Allows users to filter the class instances by name and coach.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ClassSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        'name': ['icontains'],
        'coach': ['icontains'],
        'keywords': ['icontains']
    }

    def get_queryset(self):
        return Class.objects.filter(end_time__gte=timezone.now())
