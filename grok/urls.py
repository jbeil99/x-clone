from django.urls import path
from .views import ChatView, grok_page

urlpatterns = [
    path('', grok_page, name='grok'),
    path('api/chat/', ChatView.as_view(), name='chat_api'),
]