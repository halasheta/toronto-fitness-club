import datetime
from decimal import Decimal


from django.core.validators import MinValueValidator
from django.db import models
from django.utils.translation import gettext_lazy as _


class Subscription(models.Model):
    """
        Model representing a Subscription to the gym.
    """
    class DurationType(models.TextChoices):
        DAILY = "DAILY", _('Daily')
        WEEKLY = "WEEKLY", _("Weekly")
        BIWEEKLY = "BIWEEKLY", _("Biweekly")
        MONTHLY = "MONTHLY", _("Monthly")
        BIANNUAL = "BIANNUAL", _("Biannually")
        ANNUAL = "ANNUAL", _("Annual")

    duration = models.CharField(
        max_length=8, choices=DurationType.choices, default=DurationType.MONTHLY
    )

    duration_num = models.DurationField(default=datetime.timedelta(weeks=4, days=2))

    price = models.DecimalField(
        decimal_places=2, max_digits=8, validators=[MinValueValidator(Decimal('0.00'))]
    )

    class Meta:
        ordering = ['price']

    def __str__(self):
        return f"${self.price} {self.duration} subscription"

    def set_duration_num(self):
        durations = {"DAILY": datetime.timedelta(days=1),
                     "WEEKLY": datetime.timedelta(weeks=1),
                     "BIWEEKLY": datetime.timedelta(weeks=2),
                     "MONTHLY": datetime.timedelta(weeks=4, days=2),
                     "BIANNUAL": datetime.timedelta(weeks=26),
                     "ANNUAL": datetime.timedelta(weeks=52, days=1)}
        return durations[self.duration]

    def save(self, *args, **kwargs):
        self.duration_num = self.set_duration_num()
        super(Subscription, self).save(*args, **kwargs)

