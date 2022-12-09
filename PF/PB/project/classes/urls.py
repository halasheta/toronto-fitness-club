from django.urls import path

from .views import CreateClass, EditClass, DeleteClass, EnrolClass, DropClass, \
    SearchClassInstances, UserClassSchedule, SearchClasses

app_name = "classes"

urlpatterns = [
    path("new/", CreateClass.as_view()),
    path("<int:id>/edit/", EditClass.as_view()),
    path("<int:id>/delete/", DeleteClass.as_view()),
    path("enrol/", EnrolClass.as_view()),
    path("drop/", DropClass.as_view()),
    path("schedule/", UserClassSchedule.as_view()),
    path("search/", SearchClasses.as_view()),
    path("instances/", SearchClassInstances.as_view()),
]
