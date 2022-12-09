from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import Studio, StudioAmenity


class StudioAmenitySerializer(serializers.ModelSerializer):
    """
        Serializer class for the StudioAmenity model.
    """
    class Meta:
        model = StudioAmenity
        fields = ["type", "quantity"]


class StudioSerializer(serializers.ModelSerializer):
    """
        Serializer class for the Studio model. Holds two nested Serializers that instantiate <images> and
        <amenities> if provided.
    """
    class Meta:
        model = Studio
        fields = ["id", "name", "address", "longitude", "latitude", "postal_code", "phone",
                  "amenities", "image1", "image2", "image3", "image4", "image5"]

    amenities = StudioAmenitySerializer(many=True, required=False)

    def validate(self, attrs):
        if attrs["longitude"] > 180 or attrs["longitude"] < -180:
            raise ValidationError("Longitude value is invalid")

        if attrs["latitude"] > 90 or attrs["latitude"] < -90:
            raise ValidationError("Latitude value is invalid")
        return super().validate(attrs)

    def create(self, validated_data):
        amenities = None, None

        try:
            amenities = validated_data.pop('amenities')
        except KeyError:
            pass

        studio = Studio.objects.create(**validated_data)


        if amenities is not None:
            for amenity in amenities:
                StudioAmenity.objects.create(studio=studio, **amenity)

        studio.save()
        return studio

    def update(self, instance, validated_data):

        try:
            amenities = validated_data.pop('amenities')
        except KeyError:
            pass

        StudioAmenity.objects.filter(studio=instance).delete()


        if amenities is not None:
            for amenity in amenities:
                StudioAmenity.objects.create(studio=instance, **amenity)

        return super().update(instance, validated_data)


