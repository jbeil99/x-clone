from django.urls import path
from .views import ConversationListView, ConversationDetailView, ConversationMessageView

urlpatterns = [
    # API endpoints for conversations
    path("conversations/", ConversationListView.as_view(), name="conversation-list"),
    path(
        "conversations/<int:conversation_id>/",
        ConversationDetailView.as_view(),
        name="conversation-detail",
    ),
    path(
        "conversations/<int:conversation_id>/messages/",
        ConversationMessageView.as_view(),
        name="conversation-messages",
    ),
]
