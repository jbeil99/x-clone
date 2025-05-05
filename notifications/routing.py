from django.urls import path
from .socketio import NotificationConsumerSocketIO

websocket_urlpatterns = [
    path('ws/socketio/', NotificationConsumerSocketIO.as_asgi()),
]
