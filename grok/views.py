# grok/views.py

from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Conversation, Message
from .utils import get_chat_response

@csrf_exempt  
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat_api(request):
    user_input = request.data.get('message')
    if not user_input:
        return Response({'error': 'Message is required'}, status=status.HTTP_400_BAD_REQUEST)

    conversation = Conversation.objects.create(user=request.user)
    Message.objects.create(conversation=conversation, content=user_input, is_bot=False)

    bot_response = get_chat_response(user_input)
    Message.objects.create(conversation=conversation, content=bot_response, is_bot=True)

    return Response({'response': bot_response})