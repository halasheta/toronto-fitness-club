from rest_framework.permissions import BasePermission


class IsSelfOrAdmin(BasePermission):
    """
        Custom Permission for user being self or admin.
    """
    def has_object_permission(self, request, view, obj):
        if request.user and request.user.is_staff:
            return True
        return request.user and obj == request.user
