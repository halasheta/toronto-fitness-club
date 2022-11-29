from django.contrib import admin
from .models import User


class UserAdmin(admin.ModelAdmin):
    model = User
    list_display = ("email", "first_name",  "last_name", "phone")
    search_fields = ("email", "first_name", "last_name")


admin.site.register(User, UserAdmin)
