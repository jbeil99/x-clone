import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model

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
                
                await self.send(text_data=json.dumps({
                    "type": "notification_read",
                    "notification_id": notification_id
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
    
    async def notification_message(self, event):
        await self.send(text_data=json.dumps(event))
