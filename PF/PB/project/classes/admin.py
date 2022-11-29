from django.contrib import admin
from .models import Class, ClassOccurrence


class ClassAdmin(admin.ModelAdmin):
    """
        ModelAdmin class for the model Class.
    """
    model = Class
    list_display = ('id', 'name', 'coach', 'description', 'keywords', 'capacity', 'studio',
                    'start_date', 'start_time', 'end_time', 'frequency')


class ClassOccurrenceAdmin(admin.ModelAdmin):
    """
        ModelAdmin class for the model ClassOccurrence.
    """
    model = ClassOccurrence


admin.site.register(Class, ClassAdmin)
admin.site.register(ClassOccurrence, ClassOccurrenceAdmin)
