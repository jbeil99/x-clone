import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from asgiref.sync import sync_to_async

User = get_user_model()

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        
        if self.user.is_anonymous:
            await self.close()
            return
            
        self.notification_group_name = f"notifications_{self.user.id}"
        
        await self.channel_layer.group_add(
            self.notification_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Send unread notification count on connect
        count = await self.get_unread_notification_count()
        await self.send(text_data=json.dumps({
            "type": "unread_count",
            "count": count
        }))
        
    async def disconnect(self, close_code):
        if hasattr(self, 'notification_group_name'):
            await self.channel_layer.group_discard(
                self.notification_group_name,
                self.channel_name
            )
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        command = data.get("command", None)
        
        if command == "mark_as_read":
            notification_id = data.get("notification_id", None)
            if notification_id:
                await self.mark_notification_as_read(notification_id)
                
                # Get updated count after marking as read
                count = await self.get_unread_notification_count()
                
                await self.send(text_data=json.dumps({
                    "type": "notification_read",
                    "notification_id": notification_id,
                    "unread_count": count
                }))
        
        elif command == "mark_all_as_read":
            count = await self.mark_all_notifications_as_read()
            
            await self.send(text_data=json.dumps({
                "type": "all_notifications_read",
                "marked_count": count,
                "unread_count": 0
            }))
            
        elif command == "get_unread_count":
            count = await self.get_unread_notification_count()
            
            await self.send(text_data=json.dumps({
                "type": "unread_count",
                "count": count
            }))
    
    @database_sync_to_async
    def mark_notification_as_read(self, notification_id):
        from notifications.models import Notification
        try:
            notification = Notification.objects.get(
                id=notification_id, 
                recipient=self.user
            )
            notification.is_read = True
            notification.save()
            return True
        except Notification.DoesNotExist:
            return False
            
    @database_sync_to_async
    def mark_all_notifications_as_read(self):
        from .utils import mark_notifications_as_read
        return mark_notifications_as_read(self.user)
        
    @database_sync_to_async
    def get_unread_notification_count(self):
        from .utils import get_unread_notification_count
        return get_unread_notification_count(self.user)
    
    async def notification_message(self, event):
        # Forward the notification message to the WebSocket
        await self.send(text_data=json.dumps(event))
        
        # Also send the updated unread count
        count = await self.get_unread_notification_count()
        await self.send(text_data=json.dumps({
            "type": "unread_count",
            "count": count
        }))
