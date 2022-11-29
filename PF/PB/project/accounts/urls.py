from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView

from .views import SignupUserView, UpdateUserView, CreateUserView

app_name = 'accounts'

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('signup/', SignupUserView.as_view()),
    path('user/profile/', UpdateUserView.as_view()),
    path('create/', CreateUserView.as_view())
]
