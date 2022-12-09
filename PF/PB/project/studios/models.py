from django.core.validators import RegexValidator
from django.db import models


class Studio(models.Model):
    """
        Model representing a Studio at the gym.
    """
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=200)

    pc_regex = RegexValidator(regex=r'^[a-zA-z0-9]{6}$')
    postal_code = models.CharField(validators=[pc_regex], max_length=6)

    longitude = models.FloatField()
    latitude = models.FloatField()

    phone_regex = RegexValidator(regex=r'^\d{10}$')
    phone = models.CharField(validators=[phone_regex], max_length=20)


class StudioAmenity(models.Model):
    """
        Model representing an amenity at a specific Studio.
    """
    studio = models.ForeignKey(to=Studio, on_delete=models.CASCADE,
                               related_name="amenities")
    type = models.CharField(max_length=200)
    quantity = models.PositiveIntegerField()




