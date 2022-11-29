from rest_framework import permissions, generics

from .models import User
from .permissions import IsSelfOrAdmin

from .serializers import AdminSignupSerializer, SignupSerializer, UserSerializer


# Admin Views
class CreateUserView(generics.CreateAPIView):
    """
        Creates a user or superuser.
    """
    queryset = User.objects.all()
    serializer_class = AdminSignupSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]


class SignupUserView(generics.CreateAPIView):
    """
        Creates a user.
    """
    queryset = User.objects.all()
    serializer_class = SignupSerializer
    permission_classes = [permissions.AllowAny]


class UpdateUserView(generics.RetrieveUpdateAPIView):
    """
        Updates a user.
    """
    lookup_field = "email"
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsSelfOrAdmin, permissions.IsAuthenticated]

    def get_object(self):
        queryset = self.get_queryset()
        obj = generics.get_object_or_404(queryset, email=self.request.user.email)
        return obj

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

