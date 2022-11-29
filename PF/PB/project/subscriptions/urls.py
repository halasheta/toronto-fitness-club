from django.urls import path

from .views import CreateSubscriptionView, DeleteSubscriptionView, \
    ListSubscriptionsView, SeeSubscriptionView, UnsubscribeView, \
    UpdateSubscriptionView, UserSubscribeView

app_name = "subscriptions"

urlpatterns = [
    path("new/", CreateSubscriptionView.as_view()),
    path("<int:subscr_id>/edit/", UpdateSubscriptionView.as_view()),
    path("<int:subscr_id>/delete/", DeleteSubscriptionView.as_view()),
    path("<int:subscr_id>/view/", SeeSubscriptionView.as_view()),

    path("<int:subscr_id>/subscribe/", UserSubscribeView.as_view()),
    path("<int:subscr_id>/unsubscribe/", UnsubscribeView.as_view()),
    path("all/", ListSubscriptionsView.as_view())
]
