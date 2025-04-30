from django.urls import path
from .views import all_users, get_messages, send_message, send_message_with_file, get_unread_count, mark_as_read, mark_all_as_read, get_unread_by_user

urlpatterns = [
    path("all-users/", all_users, name="all-users"),
    path("messages/", get_messages, name="get-messages"),
    path("send/", send_message, name="send-message"),
    path("send-with-file/", send_message_with_file, name="send-message-with-file"),
    path("unread-count/", get_unread_count, name="unread-count"),
    path("mark-as-read/", mark_as_read, name="mark-as-read"),
    path("mark-all-as-read/", mark_all_as_read, name="mark-all-as-read"),
    path("unread-by-user/", get_unread_by_user, name="unread-by-user"),
]
