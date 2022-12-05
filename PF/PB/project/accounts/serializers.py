from abc import ABC

from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator, validate_email
from rest_framework import serializers
from django.utils.translation import gettext_lazy as _

from .models import User


class AdminSignupSerializer(serializers.ModelSerializer):
    """
        Serializes a User for creation by admins (created user can have
        superuser status)
    """
    password2 = serializers.CharField(label=_("Confirm password"), write_only=True, style={"input_type": "password"})

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password', 'password2', 'phone', 'avatar', 'is_staff', 'is_superuser', "payment"]

        extra_kwargs = {
            "password": {"write_only": True, "style": {"input_type": "password"}}
        }

    def validate(self, data: dict) -> dict:
        fields = ['password', 'password2', 'email', 'first_name', 'last_name', 'phone']
        phone_regex = RegexValidator(regex=r'^\d{10}$')
        errors = {}
        for field in fields:
            if field not in data.keys():
                errors[field] = ['This is a required field']

        if errors == {}:
            if data['password'] != data['password2']:
                errors['password2'] = ['The two password fields don\'t match']
            try:
                phone_regex(data['phone'])
            except ValidationError as e:
                errors['phone'] = ['Please enter a valid phone number']
            try:
                validate_email(data['email'])
            except ValidationError as e:
                errors['email'] = [e]

            if User.objects.filter(email=data['email']):
                errors['email'] = ['This email is already in use']

        if errors:
            raise serializers.ValidationError(errors)
        else:
            data.pop("password2")
            data["password"] = make_password(data["password"])
            return data


class SignupSerializer(serializers.ModelSerializer):
    """
        Serializes a user for creation.
    """
    password2 = serializers.CharField(label=_("Confirm password"), write_only=True, style={"input_type": "password"})

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password', 'password2',
                  'phone', 'avatar']

        extra_kwargs = {
            "password": {"write_only": True, "style": {"input_type": "password"}}
        }

    def validate(self, data: dict) -> dict:
        fields = ['email', 'first_name', 'last_name', 'password', 'password2',
                  'phone']
        phone_regex = RegexValidator(regex=r'^\d{10}$')
        errors = {}
        for field in fields:
            if field not in data.keys():
                errors[field] = ['This is a required field']

        if errors == {}:
            if data['password'] != data['password2']:
                errors['password2'] = ['The two password fields don\'t match']
            try:
                phone_regex(data['phone'])
            except ValidationError as e:
                errors['phone'] = ['Please enter a valid phone number']
            try:
                validate_email(data['email'])
            except ValidationError as e:
                errors['email'] = [e]

            if User.objects.filter(email=data['email']):
                errors['email'] = ['This email is already in use']

        if errors:
            raise serializers.ValidationError(errors)
        else:
            data.pop("password2")
            data["password"] = make_password(data["password"])
            return data


class UserSerializer(serializers.ModelSerializer):
    """
        Serializes a user.
    """
    class Meta:
        model = User
        fields = ["email", "first_name", "last_name", "phone", "avatar", "is_superuser", "subscription"]


class UserEmailSerializer(serializers.ModelSerializer):
    """
        Serializes a user's email.
    """
    class Meta:
        model = User
        fields = ["email"]
        read_only_fields = ["email"]
