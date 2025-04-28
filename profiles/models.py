from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    bio = models.CharField(max_length=255, blank=True)
    avatar = models.ImageField(default="user.png", upload_to="avatars/")  # Save to avatars/
    cover_image = models.ImageField(default="cover.png", upload_to="covers/")  # Save to covers/
    date_joined = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.username}'s Profile"
