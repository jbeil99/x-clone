from django.utils import timezone  # Correct import
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Profile(models.Model):
    username = models.CharField(max_length=200, unique=True)
    name = models.CharField(max_length=255, blank=True)
    following = models.ManyToManyField("self", symmetrical=False, related_name="followed", blank=True)
    bio = models.CharField(max_length=255, blank=True)
    avatar = models.ImageField(default='user.png')
    cover_image = models.ImageField(default='user.png')
    date_joined = models.DateTimeField(default=timezone.now)  
    
    def __str__(self):
        return f"{self.username}'s Profile"
