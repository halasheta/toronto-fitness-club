from rest_framework import serializers
from .models import Payment, PaymentMethod


class GetPaymentSerializer(serializers.ModelSerializer):
    """
        Serializer class for Payment model.
    """
    class Meta:
        model = Payment
        fields = ['subscription', 'amount', 'credit_number', 'date', 'charged']


class MakePaymentMethodSerializer(serializers.ModelSerializer):
    """
        Serializer class for creating PaymentMethod.
    """
    class Meta:
        model = PaymentMethod
        fields = ['credit_number', 'credit_code', 'user']
        write_only_fields = ['credit_number', 'credit_code']
    user = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )


class GetPaymentMethodSerializer(serializers.ModelSerializer):
    """
        Serializer class for viewing and updating PaymentMethod.
    """
    class Meta:
        model = PaymentMethod
        fields = ['credit_number', 'credit_code']


