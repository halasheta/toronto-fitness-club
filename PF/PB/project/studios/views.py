import operator
from datetime import timedelta

from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.generics import get_object_or_404, CreateAPIView, UpdateAPIView, DestroyAPIView, ListAPIView, \
    RetrieveAPIView
from geopy.distance import geodesic
from rest_framework.response import Response

from classes.models import ClassOccurrence, Class
from classes.serializers import ClassOccurrenceSerializer
from .serializers import StudioAmenitySerializer, StudioSerializer
from .models import Studio, StudioAmenity


# Admin classes
class CreateStudio(CreateAPIView):
    """
        Creates a studio instance.
    """

    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = StudioSerializer

    def get_queryset(self):
        return Studio.objects.all()


class EditStudio(RetrieveAPIView, UpdateAPIView):
    """
        Edit fields in a studio instance.
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = StudioSerializer

    def get_object(self):
        return get_object_or_404(Studio, id=self.kwargs["id"])

    def get_queryset(self):
        return Studio.objects.all()


class DeleteStudio(DestroyAPIView):
    """
        Delete a studio instance, all of its Class models, and all future
        instances of ClassOccurrence objects.
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = StudioSerializer

    def get_object(self):
        return get_object_or_404(Studio, id=self.kwargs["id"])

    def get_queryset(self):
        return Studio.objects.all()

    def destroy(self, request, *args, **kwargs):
        obj = self.get_object()

        # Delete all future class occurrences in this studio
        ClassOccurrence.objects \
            .filter(studio=obj.pk) \
            .filter(start_time__gte=(timezone.now() - timedelta(hours=5))).delete()

        # Delete all class models in this studio
        Class.objects.filter(studio=obj.pk).delete()

        self.perform_destroy(obj)
        return Response(status=status.HTTP_204_NO_CONTENT)


# User classes
class ListStudios(ListAPIView):
    """
        List studios by geographical proximity to an input location.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = StudioSerializer

    def get_queryset(self):
        lng = self.request.query_params.get('longitude')
        lat = self.request.query_params.get('latitude')

        qs = Studio.objects.all()
        if lng is None or lat is None:
            return qs

        location = (lat, lng)
        for obj in qs:
            obj.distance = geodesic((obj.latitude, obj.longitude), location)
        qs_ordered = sorted(qs, key=operator.attrgetter('distance'))

        return qs_ordered


class ViewStudioProfile(RetrieveAPIView):
    """
        Displays information about a specific studio.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = StudioSerializer

    def get_object(self):
        return get_object_or_404(Studio, id=self.kwargs["id"])


class ClassesSchedule(ListAPIView):
    """
        Lists all classes that are active in a specific studio.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ClassOccurrenceSerializer

    def get_queryset(self):
        return ClassOccurrence.objects.filter(studio=self.kwargs["id"]) \
            .filter(start_time__gte=(timezone.now() - timedelta(hours=5)))


class SearchStudios(ListAPIView):
    """
        Allows users to filter the studios list by name, amenity type,
        amenity quantity, class name and the coach of a class.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = StudioSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        'name': ['icontains'],
        'amenities__type': ['exact'],
        'amenities__quantity': ['gte', 'exact'],
        'classes__name': ['icontains'],
        'classes__coach': ['icontains']
    }

    def get_queryset(self):
        return Studio.objects.all()


class AllAmenities(ListAPIView):
    """
        Allows users to filter the studios list by name, amenity type,
        amenity quantity, class name and the coach of a class.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = StudioAmenitySerializer

    def get_queryset(self):
        return StudioAmenity.objects.all()
