from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class MutedUser(models.Model):
    """
    Represents a muted user.
    """

    user = models.ForeignKey(
        User, related_name="muting_users", on_delete=models.CASCADE
    )
    muted_user = models.ForeignKey(
        User, related_name="muted_by_users", on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "muted_user")

    def __str__(self):
        return f"{self.user.username} muted {self.muted_user.username}"


class ReportedUser(models.Model):
    """
    Represents a reported user.
    """

    user = models.ForeignKey(
        User, related_name="reporting_users", on_delete=models.CASCADE
    )
    reported_user = models.ForeignKey(
        User, related_name="reported_by_users", on_delete=models.CASCADE
    )
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "reported_user")

    def __str__(self):
        return f"{self.user.username} reported {self.reported_user.username}"
