from django.db import models
from studios.models import Studio
from accounts.models import User


class ClassOccurrence(models.Model):
    """
        Model representing a specific occurrence of Class.
    """
    class_model = models.ForeignKey(to='Class', on_delete=models.SET_NULL,
                                    related_name="occurrences", null=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    name = models.CharField(max_length=200)
    description = models.TextField()
    coach = models.CharField(max_length=200)

    capacity = models.PositiveIntegerField()

    keywords = models.TextField()

    studio = models.ForeignKey(to=Studio, on_delete=models.SET_NULL,
                               related_name="classes", null=True)
    attendees = models.ManyToManyField(to=User, related_name="classes", blank=True)


class Class(models.Model):
    """
        Model that defines the instantiation pattern of ClassOccurrence objects. Specific information about each
        occurrence (e.g. attendees, capacity) is stored in the respective instances. Any change to a Class model will
        only affect future occurrences.
    """
    RECUR_CHOICES = (
        (0, 'None'),
        (1, 'Daily'),
        (7, 'Weekly'),
        (14, 'Biweekly')
    )
    name = models.CharField(max_length=200)
    description = models.TextField()
    coach = models.CharField(max_length=200)

    capacity = models.PositiveIntegerField()

    keywords = models.TextField()
    studio = models.ForeignKey(to=Studio, on_delete=models.CASCADE,
                               related_name="class_types")

    start_date = models.DateTimeField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    frequency = models.IntegerField(choices=RECUR_CHOICES)
    end_recurrence = models.DateTimeField()
