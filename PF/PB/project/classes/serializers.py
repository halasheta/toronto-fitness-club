from datetime import timedelta, datetime

from django.utils import timezone
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from studios.serializers import StudioSerializer
from .models import Class, ClassOccurrence


class ClassOccurrenceSerializer(serializers.ModelSerializer):
    """
        Serializer class for the ClassOccurrence model.
    """
    studio = StudioSerializer(read_only=True)

    class Meta:
        model = ClassOccurrence
        fields = ['id', 'name', 'coach', 'description', 'keywords', 'capacity', 'start_time', 'end_time',
                  'class_model', 'attendees', 'studio']
        read_only_fields = ['class_model', 'studio']


class ClassSerializer(serializers.ModelSerializer):
    """
        Serializer class for the Class model.
    """
    frequency = serializers.IntegerField(required=True)
    occurrences = ClassOccurrenceSerializer(read_only=True, many=True)

    class Meta:
        model = Class
        fields = ['id', 'name', 'coach', 'description', 'keywords', 'capacity', 'studio',
                  'start_date', 'start_time', 'end_time', 'frequency', 'end_recurrence', 'occurrences']
        read_only_fields = ['occurrences', 'studio']

    def validate(self, attrs):
        try:
            if self.instance and self.instance.start_date < timezone.now():
                raise ValidationError("Start date is invalid")

            if attrs['end_recurrence'] < self.instance.start_date:
                raise ValidationError("End recurrence date is invalid")
        except AttributeError:
            pass

        if attrs['start_date'] < timezone.now():
            raise ValidationError("Start date is invalid")

        if attrs['end_recurrence'] < timezone.now():
            raise ValidationError("End recurrence date is invalid")

        freq_check = [1 for f in Class.RECUR_CHOICES if attrs['frequency'] in f]
        if len(freq_check) == 0:
            raise ValidationError("Frequency value is invalid")

        return super().validate(attrs)

    def create(self, validated_data):
        sdate = validated_data.pop('start_date')
        edate = validated_data.pop('end_recurrence')

        new_sdate = datetime(sdate.year, sdate.month, sdate.day, tzinfo=timezone.get_current_timezone())
        new_edate = datetime(edate.year, edate.month, edate.day, tzinfo=timezone.get_current_timezone())

        validated_data['start_date'] = new_sdate
        validated_data['end_recurrence'] = new_edate

        instance = Class.objects.create(**validated_data)

        instance.save()
        return instance
