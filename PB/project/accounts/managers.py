from django.contrib.auth.base_user import BaseUserManager


class UserManager(BaseUserManager):
    """
        Manager class for custom User model.
    """
    def create_user(self, email, password, first_name, last_name, phone, **extra_fields):
        if not email:
            raise ValueError('User must have a valid email')
        if not first_name:
            raise ValueError('User must have a valid first name')
        if not last_name:
            raise ValueError('User must have a valid last name')
        if not phone:
            raise ValueError('User must have a valid phone')
        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name,
                          last_name=last_name, phone=phone, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(email, password, **extra_fields)
