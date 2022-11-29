from decimal import Decimal


from django.core.validators import MinValueValidator, RegexValidator
from django.db import models
from django.db.models import CASCADE, SET_NULL

from accounts.models import User
from subscriptions.models import Subscription


class Payment(models.Model):
    """
        Model representing a user's Payment.
    """
    amount = models.DecimalField("Amount", decimal_places=2, max_digits=8, validators=[MinValueValidator(Decimal('0.00'))])
    user = models.ForeignKey(to=User, on_delete=CASCADE, related_name="payments", related_query_name="payments")
    date = models.DateTimeField("Date")
    subscription = models.ForeignKey(to=Subscription, on_delete=SET_NULL, related_name="payments", null=True)
    charged = models.BooleanField(default=False)
    valid_until = models.DateTimeField("Subscription Expiry Date")

    ccnum_regex = RegexValidator(regex=r'^\d{8,19}$')
    cccode_regex = RegexValidator(regex=r'^\d{3}$')

    credit_number = models.CharField("Credit Card Number", max_length=19, validators=[ccnum_regex])
    credit_code = models.CharField("Credit Card CVV", max_length=3, validators=[cccode_regex])


class PaymentMethod(models.Model):
    """
        Model representing a user's credit card.
    """
    ccnum_regex = RegexValidator(regex=r'^\d{8,19}$')
    cccode_regex = RegexValidator(regex=r'^\d{3}$')

    user = models.OneToOneField(to=User, on_delete=CASCADE, related_name="payment_method")
    credit_number = models.CharField("Credit Card Number", max_length=19, validators=[ccnum_regex])
    credit_code = models.CharField("Credit Card CVV", max_length=3, validators=[cccode_regex])
