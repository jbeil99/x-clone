from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import ConversationSerializer, ChatMessageSerializer
from .models import Conversation, ChatMessage
from .gemini_integration import generate_response


class ConversationListView(APIView):
    """
    API view for listing and creating conversations
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get all conversations for the current user"""
        conversations = Conversation.objects.filter(user=request.user)
        serializer = ConversationSerializer(conversations, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Create a new conversation"""
        serializer = ConversationSerializer(data=request.data)
        if serializer.is_valid():
            conversation = serializer.save(user=request.user)
            return Response(
                ConversationSerializer(conversation).data,
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ConversationDetailView(APIView):
    """
    API view for retrieving, updating and deleting a conversation
    """

    permission_classes = [IsAuthenticated]

    def get_conversation(self, request, conversation_id):
        """Helper method to get conversation and check ownership"""
        try:
            conversation = Conversation.objects.get(id=conversation_id)
            if conversation.user != request.user:
                return None
            return conversation
        except Conversation.DoesNotExist:
            return None

    def get(self, request, conversation_id):
        """Get a specific conversation"""
        conversation = self.get_conversation(request, conversation_id)
        if conversation is None:
            return Response(
                {"error": "Conversation not found"}, status=status.HTTP_404_NOT_FOUND
            )
        serializer = ConversationSerializer(conversation)
        return Response(serializer.data)

    def put(self, request, conversation_id):
        """Update a conversation (e.g., change title)"""
        conversation = self.get_conversation(request, conversation_id)
        if conversation is None:
            return Response(
                {"error": "Conversation not found"}, status=status.HTTP_404_NOT_FOUND
            )
        serializer = ConversationSerializer(
            conversation, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, conversation_id):
        """Delete a conversation"""
        conversation = self.get_conversation(request, conversation_id)
        if conversation is None:
            return Response(
                {"error": "Conversation not found"}, status=status.HTTP_404_NOT_FOUND
            )
        conversation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ConversationMessageView(APIView):
    """
    API view for adding messages to a conversation
    """

    permission_classes = [IsAuthenticated]

    def get_conversation(self, request, conversation_id):
        """Helper method to get conversation and check ownership"""
        try:
            conversation = Conversation.objects.get(id=conversation_id)
            if conversation.user != request.user:
                return None
            return conversation
        except Conversation.DoesNotExist:
            return None

    def post(self, request, conversation_id):
        """Add a new message to the conversation"""
        conversation = self.get_conversation(request, conversation_id)
        if conversation is None:
            return Response(
                {"error": "Conversation not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = ChatMessageSerializer(data=request.data)
        if serializer.is_valid():
            user_message = serializer.validated_data["user_message"]
            bot_response = generate_response(user_message)

            chat_message = ChatMessage(
                conversation=conversation,
                user_message=user_message,
                bot_response=bot_response,
            )
            chat_message.save()

            # Update the conversation's updated_at timestamp
            conversation.save(update_fields=["updated_at"])

            response_serializer = ChatMessageSerializer(chat_message)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
