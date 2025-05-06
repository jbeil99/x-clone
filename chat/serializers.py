from rest_framework import serializers
from .models import Message
from accounts.serializers import UserSerializer
from accounts.models import Follow

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
    file_url = serializers.SerializerMethodField()
    is_spam = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'content', 'timestamp', 'file', 'file_type', 'file_url', 'read', 'is_spam']

    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None
        
    def get_is_spam(self, obj):
        # Get the current user from the request context
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
            
        current_user = request.user
        
        # If the message is sent by the current user, it's not spam
        if obj.sender == current_user:
            return False
            
        # Check if the current user follows the sender
        # If not following, mark as spam
        is_following = Follow.objects.filter(
            follower=current_user,
            following=obj.sender
        ).exists()
        
        return not is_following