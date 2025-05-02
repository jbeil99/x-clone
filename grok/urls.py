# grok/urls.py

from django.urls import path
from grok.views import chat_api
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('api/chat/', csrf_exempt(chat_api), name='chat_api'),  # ✅ Disable CSRF
]