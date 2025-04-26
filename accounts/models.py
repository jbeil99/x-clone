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
    avatar = models.ImageField(
        upload_to="media/profile_pics", default="default_profile_400x400.png"
    )
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    date_of_birth = models.DateField(null=True, blank=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    display_name = models.CharField(max_length=50)
    bio = models.CharField(max_length=255, blank=True)
    cover_image = models.ImageField(default="cover.png")

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = [
        "username",
        "mobile_phone",
        "display_name",
        "date_of_birth",
    ]

    @property
    def followers(self):
        """Returns a queryset of users who follow this user."""
        return User.objects.filter(following__followed=self)

    @property
    def followed(self):
        """Returns a queryset of users this user follows."""
        return User.objects.filter(followers__follower=self)

    @property
    def followers_count(self):
        """Returns the number of users who follow this user."""
        return self.followers.count()

    @property
    def followed_count(self):
        """Returns the number of users this user follows."""
        return self.followed.count()


class Follow(models.Model):
    follower = models.ForeignKey(
        User, related_name="following", on_delete=models.CASCADE
    )
    followed = models.ForeignKey(
        User, related_name="followers", on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("follower", "followed")

    def __str__(self):
        return f"{self.follower.username} follows {self.followed.username}"


class ActivationToken(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        return (timezone.now() - self.created_at).total_seconds() < 24 * 60 * 60
