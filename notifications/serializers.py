from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Notification

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class NotificationSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    
    class Meta:
        model = Notification
        fields = ['id', 'sender', 'notification_type', 'text', 'created_at', 'is_read']
