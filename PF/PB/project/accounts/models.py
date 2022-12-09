from django.core.validators import RegexValidator
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db.models import SET_NULL

from subscriptions.models import Subscription
from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    """
        Model representing a User at the gym.
    """
    first_name = models.CharField(max_length=200, default="placeholder", verbose_name="First Name")
    last_name = models.CharField(max_length=200, default="placeholder", verbose_name="Last Name")
    email = models.EmailField(unique=True, verbose_name="Email")
    avatar = models.ImageField(upload_to="avatars", verbose_name="Avatar", blank=True, null=True, default="avatars/orange_a8mlPZJ.png")
    phone_regex = RegexValidator(regex=r'^\d{10}$')
    phone = models.CharField(validators=[phone_regex], max_length=20, verbose_name="Phone", blank=True, null=True)
    is_staff = models.BooleanField(default=False)
    subscription = models.ForeignKey(to=Subscription, related_name="users", on_delete=SET_NULL, null=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'phone']

