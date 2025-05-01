import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import Message

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs'].get('user_id', None)
        
        if not self.user_id:
            # إذا لم يتم تحديد معرف المستخدم، استخدم غرفة عامة
            self.room_group_name = 'chat_general'
        else:
            # استخدم معرف المستخدم لإنشاء غرفة خاصة
            self.room_group_name = f'chat_user_{self.user_id}'
        
        # الانضمام إلى مجموعة الغرفة
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # إرسال رسالة تأكيد الاتصال
        await self.send(text_data=json.dumps({
            'action': 'connection_established',
            'message': 'Connected to chat server'
        }))

    async def disconnect(self, close_code):
        # مغادرة مجموعة الغرفة
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')
        
        if action == 'send_message':
            message_data = data.get('message', {})
            sender_id = message_data.get('sender')
            receiver_id = message_data.get('receiver')
            content = message_data.get('content')
            
            if sender_id and receiver_id and content:
                # حفظ الرسالة في قاعدة البيانات (اختياري)
                # message = await self.save_message(sender_id, receiver_id, content)
                
                # إرسال الرسالة إلى غرفة المستقبل
                receiver_room = f'chat_user_{receiver_id}'
                await self.channel_layer.group_send(
                    receiver_room,
                    {
                        'type': 'chat_message',
                        'action': 'message',
                        'sender': sender_id,
                        'receiver': receiver_id,
                        'content': content,
                        'timestamp': message_data.get('timestamp')
                    }
                )
                
                # إرسال تأكيد إلى المرسل
                await self.send(text_data=json.dumps({
                    'action': 'message_sent',
                    'message': {
                        'sender': sender_id,
                        'receiver': receiver_id,
                        'content': content,
                        'timestamp': message_data.get('timestamp')
                    }
                }))
        
        elif action == 'join_room':
            # انضمام إلى غرفة محددة
            room_id = data.get('room_id')
            if room_id:
                # مغادرة الغرفة الحالية
                await self.channel_layer.group_discard(
                    self.room_group_name,
                    self.channel_name
                )
                
                # الانضمام إلى الغرفة الجديدة
                self.room_group_name = f'chat_room_{room_id}'
                await self.channel_layer.group_add(
                    self.room_group_name,
                    self.channel_name
                )
                
                # إرسال تأكيد
                await self.send(text_data=json.dumps({
                    'action': 'joined_room',
                    'room_id': room_id
                }))

    # استقبال رسالة من مجموعة الغرفة
    async def chat_message(self, event):
        # إرسال الرسالة إلى WebSocket
        await self.send(text_data=json.dumps({
            'action': event.get('action', 'message'),
            'sender': event.get('sender'),
            'receiver': event.get('receiver'),
            'content': event.get('content'),
            'timestamp': event.get('timestamp')
        }))
    
    @database_sync_to_async
    def save_message(self, sender_id, receiver_id, content):
        """حفظ الرسالة في قاعدة البيانات"""
        try:
            sender = User.objects.get(id=sender_id)
            receiver = User.objects.get(id=receiver_id)
            message = Message.objects.create(
                sender=sender,
                receiver=receiver,
                content=content
            )
            return message
        except Exception as e:
            print(f"Error saving message: {e}")
            return None
