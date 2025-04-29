from django.urls import path
from .views import all_users, get_messages, send_message

urlpatterns = [
    path("all-users/", all_users, name="all-users"),
    path("messages/", get_messages, name="get-messages"),
    path("send/", send_message, name="send-message"),
]
