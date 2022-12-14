# Generated by Django 4.1.3 on 2022-12-10 02:36

import datetime
from decimal import Decimal
import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Subscription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('duration', models.CharField(choices=[('DAILY', 'Daily'), ('WEEKLY', 'Weekly'), ('BIWEEKLY', 'Biweekly'), ('MONTHLY', 'Monthly'), ('BIANNUAL', 'Biannually'), ('ANNUAL', 'Annual')], default='MONTHLY', max_length=8)),
                ('duration_num', models.DurationField(default=datetime.timedelta(days=30))),
                ('price', models.DecimalField(decimal_places=2, max_digits=8, validators=[django.core.validators.MinValueValidator(Decimal('0.00'))])),
            ],
            options={
                'ordering': ['price'],
            },
        ),
    ]
