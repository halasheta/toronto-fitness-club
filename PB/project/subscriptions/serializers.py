from rest_framework import serializers

from accounts.serializers import UserEmailSerializer
from .models import Subscription


class SubscriptionSerializer(serializers.ModelSerializer):
    """
        Serializer class for Subscription model as an Admin.
    """
    users = UserEmailSerializer(read_only=True, many=True)

    class Meta:
        model = Subscription
        fields = ['duration', 'price', 'users']
        read_only_fields = ['users']


class ViewSubscriptionSerializer(serializers.ModelSerializer):
    """
        Serializer class for viewing Subscription model.
    """
    class Meta:
        model = Subscription
        fields = ['pk', 'duration', 'price']

