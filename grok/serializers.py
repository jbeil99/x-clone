from rest_framework import serializers
from .models import Conversation, ChatMessage
from accounts.serializers import UserSerializer


class ChatMessageSerializer(serializers.ModelSerializer):
    """Serializer for chat messages"""

    class Meta:
        model = ChatMessage
        fields = ["id", "user_message", "bot_response", "timestamp"]
        read_only_fields = ["id", "bot_response", "timestamp"]


class ConversationSerializer(serializers.ModelSerializer):
    """Serializer for conversations with nested messages"""

    messages = ChatMessageSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Conversation
        fields = ["id", "title", "user", "created_at", "updated_at", "messages"]
        read_only_fields = ["id", "user", "created_at", "updated_at"]
