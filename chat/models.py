from django.db import models
from django.conf import settings

def message_file_path(instance, filename):
    return f'chat_files/user_{instance.sender.id}/{filename}'

class Message(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='sent_messages', on_delete=models.CASCADE)
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='received_messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    file = models.FileField(upload_to=message_file_path, null=True, blank=True)
    file_type = models.CharField(max_length=20, null=True, blank=True)  
    read = models.BooleanField(default=False)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"From {self.sender} to {self.receiver}: {self.content[:20]}"
