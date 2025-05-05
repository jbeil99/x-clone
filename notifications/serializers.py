from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from .models import Notification

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class NotificationSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    related_object_info = serializers.SerializerMethodField()
    followed_back = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = ['id', 'sender', 'notification_type', 'text', 'created_at', 'is_read', 'related_object_info', 'followed_back']
    
    def get_followed_back(self, obj):
        # Only relevant for follow notifications
        request = self.context.get('request', None)
        if obj.notification_type == 'follow' and obj.sender and request:
            from accounts.models import Follow
            user = request.user
            return Follow.objects.filter(follower=user, following=obj.sender).exists()
        return False
    
    def get_related_object_info(self, obj):
        """Get information about the related object based on its type"""
        if not obj.content_type or not obj.object_id:
            return None
            
        try:
            # Get the related object
            related_object = obj.related_object
            
            # Basic info for all types
            info = {
                'id': obj.object_id,
                'type': obj.content_type.model,
            }
            
            # Add specific info based on object type
            if obj.content_type.model == 'tweet':
                info['content'] = related_object.content[:100] if hasattr(related_object, 'content') else ''
                info['user_id'] = related_object.user.id if hasattr(related_object, 'user') else None
                info['username'] = related_object.user.username if hasattr(related_object, 'user') else ''
            elif obj.content_type.model == 'comment':
                info['content'] = related_object.content[:100] if hasattr(related_object, 'content') else ''
                info['tweet_id'] = related_object.tweet.id if hasattr(related_object, 'tweet') else None
            elif obj.content_type.model == 'follow':
                info['follower_id'] = related_object.follower.id if hasattr(related_object, 'follower') else None
                info['follower_username'] = related_object.follower.username if hasattr(related_object, 'follower') else ''
                info['following_id'] = related_object.following.id if hasattr(related_object, 'following') else None
                info['following_username'] = related_object.following.username if hasattr(related_object, 'following') else ''
            
            return info
        except Exception as e:
            # If there's an error (e.g., related object was deleted), return basic info
            return {
                'id': obj.object_id,
                'type': obj.content_type.model,
                'error': 'Related object not available'
            }
