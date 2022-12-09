from django.contrib import admin
from .models import Studio, StudioAmenity


class StudioAdmin(admin.ModelAdmin):
    """
        ModelAdmin class for the model Studio.
    """
    model = Studio
    list_display = ("name", "address", "longitude", "latitude", "postal_code", "phone")


class StudioAmenityAdmin(admin.ModelAdmin):
    """
        ModelAdmin class for the model StudioAmenity.
    """
    model = StudioAmenity
    list_display = ("type", "quantity")


admin.site.register(Studio, StudioAdmin)
admin.site.register(StudioAmenity, StudioAmenityAdmin)
