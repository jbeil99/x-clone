# grok/views.py
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Conversation, Message
from .utils import get_chat_response  # Your chatbot logic here

class ChatView(APIView):
    def post(self, request):
        user_input = request.data.get('message')
        conversation = Conversation.objects.create(user=request.user)
        Message.objects.create(
            conversation=conversation,
            content=user_input,
            is_bot=False
        )
        bot_response = get_chat_response(user_input)
        Message.objects.create(
            conversation=conversation,
            content=bot_response,
            is_bot=True
        )
        return Response({'response': bot_response})

def grok_page(request):
    return render(request, 'grok/chat.html')