from django.contrib import admin
from .models import Subscription


class SubscriptionAdmin(admin.ModelAdmin):
    model = Subscription
    list_display = ("duration",  "price")
    search_fields = ("duration", "price")


admin.site.register(Subscription, SubscriptionAdmin)

