from django.urls import path

from .views import ChargePaymentsView, CreatePaymentMethodView, \
    ListPastPaymentsView, \
    ListPaymentsView, UpdatePaymentMethodView

app_name = "payments"

urlpatterns = [
    path("method/create/", CreatePaymentMethodView.as_view()),
    path("method/update/", UpdatePaymentMethodView.as_view()),
    path("history/", ListPastPaymentsView.as_view()),
    path("history/<int:num>/", ListPaymentsView.as_view()),
    path("charge/", ChargePaymentsView.as_view())
]
