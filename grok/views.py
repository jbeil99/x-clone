# # grok/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Conversation, Message
from .utils import get_chat_response
import os
# # @api_view(['POST'])
# # @permission_classes([IsAuthenticated])
# # def chat_api(request):
# #     print("API Key:", os.getenv("HUGGINGFACE_API_KEY"))
# #     message_content = request.data.get('message')
# #     if not message_content:
# #         return Response({'error': 'Message is required'}, status=status.HTTP_400_BAD_REQUEST)

# #     conversation = Conversation.objects.create(user=request.user)
# #     Message.objects.create(conversation=conversation, content=message_content, is_bot=False)

# #     bot_reply = get_chat_response(message_content)
# #     Message.objects.create(conversation=conversation, content=bot_reply, is_bot=True)

# #     return Response({'response': bot_reply})



# # grok/views.py
from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from django.contrib.auth.mixins import LoginRequiredMixin
import json
import os
import requests
from .models import Conversation, Message


# User = get_user_model()

# @method_decorator(csrf_exempt, name='dispatch')
# @permission_classes([IsAuthenticated])

# class ChatView(View):
#     def post(self, request, *args, **kwargs):
#         try:
#             data = json.loads(request.body)
#             user_input = data.get("message")
#             if not user_input:
#                 return JsonResponse({"error": "Message is required"}, status=400)

#             # Ensure user is authenticated
#             if not request.user.is_authenticated:
#                 return JsonResponse({"error": "Authentication required"}, status=401)

#             conversation = Conversation.objects.create(user=request.user)
#             Message.objects.create(conversation=conversation, content=user_input, is_bot=False)

#             # Use Hugging Face API
#             hf_api_key = os.getenv("HUGGINGFACE_API_KEY")
#             headers = {
#                 "Authorization": f"Bearer {hf_api_key}",
#                 "Content-Type": "application/json"
#             }

#             payload = {
#                 "inputs": user_input,
#                 "parameters": {
#                     "max_new_tokens": 200,
#                     "temperature": 0.7
#                 }
#             }

#             response = requests.post(
#                 "https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf",
#                 headers=headers,
#                 json=payload
#             )

#             if response.status_code == 200:
#                 bot_response = response.json()[0]['generated_text']
#             else:
#                 bot_response = "Error: Failed to get response."

#             Message.objects.create(conversation=conversation, content=bot_response, is_bot=True)

#             return JsonResponse({
#                 'response': bot_response
#             })

#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)
# grok/views.py
# grok/views.py

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Conversation, Message
from .utils import get_chat_response
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt  # ✅ Bypass CSRF check
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat_api(request):
    message = request.data.get('message')
    if not message:
        return Response({'error': 'Message is required'}, status=status.HTTP_400_BAD_REQUEST)

    conversation = Conversation.objects.create(user=request.user)
    Message.objects.create(conversation=conversation, content=message, is_bot=False)

    bot_response = get_chat_response(message)
    Message.objects.create(conversation=conversation, content=bot_response, is_bot=True)

    return Response({'response': bot_response})