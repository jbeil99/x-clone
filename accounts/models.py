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
    google_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    email = models.EmailField("email address", unique=True)
    mobile_phone = models.CharField(
        "mobile phone",
        max_length=15,
        validators=[egyptian_phone_validator],
        blank=False,
    )
    avatar = models.ImageField(upload_to="profile_pics", default="default/user.png")
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    date_of_birth = models.DateField(blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    display_name = models.CharField(max_length=50)
    bio = models.CharField(max_length=255, blank=True)
    cover_image = models.ImageField(default="cover.png")

    verified = models.BooleanField(default=False)
    verified_at = models.DateTimeField(blank=True, null=True)
    banned = models.BooleanField(default=False)
    ban_reason = models.TextField(blank=True, null=True)
    banned_at = models.DateTimeField(blank=True, null=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = [
        "username",
        "mobile_phone",
        "display_name",
        "date_of_birth",
        "avatar",
    ]

    @property
    def user_following(self):
        """Returns a queryset of users this user follows."""
        return User.objects.filter(
            id__in=self.following.all().values_list("following_id", flat=True)
        )

    @property
    def user_followers(self):
        """Returns a queryset of users who follow this user."""
        return User.objects.filter(
            id__in=self.followers.all().values_list("follower_id", flat=True)
        )

    @property
    def following_count(self):
        """Returns the number of users this user follows."""
        return self.following.count()

    @property
    def followers_count(self):
        """Returns the number of users who follow this user."""
        return self.followers.count()

    def is_user_follower(self, user):
        return self.followers.filter(follower=user).exists()

    def ban(self, reason=None):
        """Ban a user with optional reason."""
        self.banned = True
        self.ban_reason = reason if reason else "Violation of community guidelines"
        self.banned_at = timezone.now()
        self.is_active = False  # Deactivate the user account
        self.save()
        return self

    def unban(self):
        """Unban a user."""
        self.banned = False
        self.ban_reason = None
        self.banned_at = None
        self.save()
        return self

    def verify(self):
        """Mark a user as verified."""
        self.verified = True
        self.verified_at = timezone.now()
        self.save()
        return self

    def unverify(self):
        """Remove verification status from a user."""
        self.verified = False
        self.verified_at = None
        self.save()
        return self


class Follow(models.Model):
    following = models.ForeignKey(
        User, related_name="followers", on_delete=models.CASCADE
    )
    follower = models.ForeignKey(
        User, related_name="following", on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("follower", "following")

    def __str__(self):
        return f"{self.follower.username} follows {self.following.username}"


class ActivationToken(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        return (timezone.now() - self.created_at).total_seconds() < 24 * 60 * 60


class AdminActionLog(models.Model):
    """Model to log admin actions for audit purposes."""

    ACTION_TYPES = (
        ("ban", "Ban User"),
        ("unban", "Unban User"),
        ("verify", "Verify User"),
        ("unverify", "Unverify User"),
        ("delete_tweet", "Delete Tweet"),
        ("review_report", "Review Report"),
    )

    admin = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="admin_actions"
    )
    action_type = models.CharField(max_length=20, choices=ACTION_TYPES)
    target_user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="admin_actions_received",
        null=True,
        blank=True,
    )
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
