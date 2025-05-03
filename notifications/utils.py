from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.contrib.contenttypes.models import ContentType
import json

from .models import Notification

def create_notification(sender, recipient, notification_type, related_object=None, text=None):
    if sender.id == recipient.id:
        return None
        
    notification = Notification(
        sender=sender,
        recipient=recipient,
        notification_type=notification_type,
        text=text
    )
    
    if related_object:
        content_type = ContentType.objects.get_for_model(related_object)
        notification.content_type = content_type
        notification.object_id = related_object.id
    
    notification.save()
    
    channel_layer = get_channel_layer()
    notification_data = {
        "type": "notification_message",
        "id": notification.id,
        "sender": {
            "id": sender.id,
            "username": sender.username,
        },
        "notification_type": notification_type,
        "text": text,
        "created_at": notification.created_at.isoformat(),
        "is_read": False
    }
    
    if related_object:
        notification_data["related_object"] = {
            "id": related_object.id,
            "type": related_object.__class__.__name__.lower()
        }
    
    async_to_sync(channel_layer.group_send)(
        f"notifications_{recipient.id}",
        notification_data
    )
    
    return notification


def mark_notifications_as_read(user, notification_ids=None):
    notifications = Notification.objects.filter(recipient=user, is_read=False)
    
    if notification_ids:
        notifications = notifications.filter(id__in=notification_ids)
    
    count = notifications.count()
    notifications.update(is_read=True)
    
    return count


def get_unread_notification_count(user):
    return Notification.objects.filter(recipient=user, is_read=False).count()
