from django.contrib.contenttypes.models import ContentType
import json
import asyncio

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
    
    try:
        from .socketio import sio, get_user_id_from_sid
        import asyncio
        
        async def send_notification(notification):
            notification_data = {
                "type": "notification",
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
            
            # Send to all user's sessions
            from .socketio import user_sessions
            if recipient.id in user_sessions:
                for sid in user_sessions[recipient.id]:
                    await sio.emit('notification', notification_data, room=sid)
        
        # Get or create event loop
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
        
        if loop.is_running():
            asyncio.run_coroutine_threadsafe(send_notification(notification), loop)
        else:
            loop.run_until_complete(send_notification(notification))
    except ImportError:
        pass  # Socket.IO not available
    
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
