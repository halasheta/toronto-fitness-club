from django.contrib import admin

from .models import Payment


class PaymentAdmin(admin.ModelAdmin):
    model = Payment
    list_display = ("user", "date", "amount")
    search_fields = ("user", "date", "amount")


admin.site.register(Payment, PaymentAdmin)
