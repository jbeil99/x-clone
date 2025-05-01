# grok/urls.py

from django.urls import path
from grok.views import chat_api

urlpatterns = [
    path('api/chat/', chat_api, name='chat_api'),
]