from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import uuid
from django.core.validators import RegexValidator


egyptian_phone_validator = RegexValidator(
    regex=r"^(010|011|012|015)[0-9]{8}$",
    message="Enter a valid Egyptian mobile number (e.g., 01012345678).",
)


class User(AbstractUser):
    email = models.EmailField("email address", unique=True)
    mobile_phone = models.CharField(
        "mobile phone",
        max_length=15,
        validators=[egyptian_phone_validator],
        blank=False,
    )
    profile_picture = models.ImageField(
        upload_to="media/profile_pics",
    )
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    date_of_birth = models.DateField(null=True, blank=True)
    facebook = models.URLField(max_length=200, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = [
        "username",
        "first_name",
        "last_name",
        "mobile_phone",
        "profile_picture",
    ]

    def get_total_donations(self):
        return self.donations.aggregate(total=models.Sum("amount"))["total"] or 0

    def get_total_projects_donated(self):
        return self.donations.values("project").distinct().count()


class ActivationToken(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        return (timezone.now() - self.created_at).total_seconds() < 24 * 60 * 60
