from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import Studio, StudioImage, StudioAmenity


class StudioImageSerializer(serializers.ModelSerializer):
    """
        Serializer class for the StudioImage model.
    """
    class Meta:
        model = StudioImage
        fields = ["image"]


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
                  "amenities", "images"]

    images = StudioImageSerializer(many=True, required=False)
    amenities = StudioAmenitySerializer(many=True, required=False)

    def validate(self, attrs):
        if attrs["longitude"] > 180 or attrs["longitude"] < -180:
            raise ValidationError("Longitude value is invalid")

        if attrs["latitude"] > 90 or attrs["latitude"] < -90:
            raise ValidationError("Latitude value is invalid")
        return super().validate(attrs)

    def create(self, validated_data):
        img_data, amenities = None, None
        try:
            img_data = validated_data.pop('images')
        except KeyError:
            pass

        try:
            amenities = validated_data.pop('amenities')
        except KeyError:
            pass

        studio = Studio.objects.create(**validated_data)

        if img_data is not None:
            for img in img_data:
                StudioImage.objects.create(studio=studio, **img)

        if amenities is not None:
            for amenity in amenities:
                StudioAmenity.objects.create(studio=studio, **amenity)

        studio.save()
        return studio

    def update(self, instance, validated_data):

        try:
            img_data = validated_data.pop('images')
        except KeyError:
            pass

        try:
            amenities = validated_data.pop('amenities')
        except KeyError:
            pass

        StudioImage.objects.filter(studio=instance).delete()
        StudioAmenity.objects.filter(studio=instance).delete()

        if img_data is not None:
            for img in img_data:
                StudioImage.objects.create(studio=instance, **img)

        if amenities is not None:
            for amenity in amenities:
                StudioAmenity.objects.create(studio=instance, **amenity)

        return super().update(instance, validated_data)


