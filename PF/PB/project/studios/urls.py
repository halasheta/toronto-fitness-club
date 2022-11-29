from django.urls import path

from .views import CreateStudio, EditStudio, DeleteStudio, ListStudios,\
    ViewStudioProfile, SearchStudios, ClassesSchedule

app_name = "studios"

urlpatterns = [
    path("new/", CreateStudio.as_view()),
    path("<int:id>/edit/", EditStudio.as_view()),
    path("<int:id>/delete/", DeleteStudio.as_view()),
    path("<int:id>/profile", ViewStudioProfile.as_view()),
    path("<int:id>/schedule", ClassesSchedule.as_view()),
    path("all/", ListStudios.as_view()),
    path("search/", SearchStudios.as_view()),
]