from django.db import models
from accounts.models import User
from tweets.models import Tweet

class DashboardStats(models.Model):
    total_users = models.PositiveIntegerField(default=0)
    total_tweets = models.PositiveIntegerField(default=0)
    active_users_today = models.PositiveIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Dashboard Stats - {self.updated_at}"