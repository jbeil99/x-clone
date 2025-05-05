import socketio
import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from .models import Notification
from .utils import get_unread_notification_count, mark_notifications_as_read
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from channels.db import database_sync_to_async

User = get_user_model()

# Create Socket.IO server
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')

# Dictionary to store user IDs and their session IDs
user_sessions = {}

@sio.event
async def connect(sid, environ):
    """Handle new client connection"""
    try:
        # Extract JWT token from cookies or headers
        token = None
        cookies = environ.get('HTTP_COOKIE', '')
        
        # Look for JWT token in cookies
        for cookie in cookies.split(';'):
            cookie = cookie.strip()
            if cookie.startswith('access_token='):
                token = cookie.split('=')[1]
        
        # If token not found in cookies, look in headers
        if not token and 'HTTP_AUTHORIZATION' in environ:
            auth_header = environ['HTTP_AUTHORIZATION']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            # If token not found, reject connection
            return False
        
        # Verify token
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = payload['user_id']
        
        # Verify user existence
        user = User.objects.get(id=user_id)
        
        # Store user information with session ID
        if user_id not in user_sessions:
            user_sessions[user_id] = []
        
        user_sessions[user_id].append(sid)
        
        # Send unread notification count on connection
        unread_count = get_unread_notification_count(user)
        await sio.emit('unread_count', {'count': unread_count}, room=sid)
        
        print(f"User {user.username} (ID: {user_id}) connected to Socket.IO. SID: {sid}")
        return True
    
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, User.DoesNotExist) as e:
        print(f"User verification failed: {str(e)}")
        return False

@sio.event
async def disconnect(sid):
    """Handle client disconnection"""
    # Remove session ID from user dictionary
    for user_id, sessions in list(user_sessions.items()):
        if sid in sessions:
            sessions.remove(sid)
            if not sessions:  # If user has no active sessions
                del user_sessions[user_id]
            print(f"User disconnected with session ID {sid}")
            break

@sio.event
async def mark_as_read(sid, data):
    """Mark notification as read"""
    try:
        notification_id = data.get('notification_id')
        if not notification_id:
            return {'error': 'Notification ID is required'}
        
        # Find user ID associated with session ID
        user_id = None
        for uid, sessions in user_sessions.items():
            if sid in sessions:
                user_id = uid
                break
        
        if not user_id:
            return {'error': 'User is not authorized'}
        
        # Find and update notification
        try:
            notification = Notification.objects.get(id=notification_id, recipient_id=user_id)
            notification.is_read = True
            notification.save()
            
            # Get updated unread notification count
            user = User.objects.get(id=user_id)
            unread_count = get_unread_notification_count(user)
            
            # Send confirmation to client
            response = {
                'notification_id': notification_id,
                'unread_count': unread_count
            }
            
            # Send update to all user sessions
            for session_id in user_sessions.get(user_id, []):
                await sio.emit('notification_read', response, room=session_id)
            
            return {'success': True}
        
        except Notification.DoesNotExist:
            return {'error': 'Notification does not exist'}
    
    except Exception as e:
        print(f"Error marking notification as read: {str(e)}")
        return {'error': str(e)}

@sio.event
async def mark_all_as_read(sid, data):
    """Mark all notifications as read"""
    try:
        # Find user ID associated with session ID
        user_id = None
        for uid, sessions in user_sessions.items():
            if sid in sessions:
                user_id = uid
                break
        
        if not user_id:
            return {'error': 'User is not authorized'}
        
        # Mark all notifications as read
        user = User.objects.get(id=user_id)
        count = mark_notifications_as_read(user)
        
        # Send confirmation to client
        response = {
            'marked_count': count,
            'unread_count': 0
        }
        
        # Send update to all user sessions
        for session_id in user_sessions.get(user_id, []):
            await sio.emit('all_notifications_read', response, room=session_id)
        
        return {'success': True, 'marked_count': count}
    
    except Exception as e:
        print(f"Error marking all notifications as read: {str(e)}")
        return {'error': str(e)}

@sio.event
async def get_unread_count(sid, data):
    """Get unread notification count"""
    try:
        # Find user ID associated with session ID
        user_id = None
        for uid, sessions in user_sessions.items():
            if sid in sessions:
                user_id = uid
                break
        
        if not user_id:
            return {'error': 'User is not authorized'}
        
        # Get unread notification count
        user = User.objects.get(id=user_id)
        count = get_unread_notification_count(user)
        
        # Send count to client
        await sio.emit('unread_count', {'count': count}, room=sid)
        
        return {'success': True}
    
    except Exception as e:
        print(f"Error getting unread notification count: {str(e)}")
        return {'error': str(e)}

# Helper function to send new notification
async def send_notification(notification):
    """Send new notification to target user"""
    recipient_id = notification.recipient.id
    
    # Check if user is connected
    if recipient_id in user_sessions:
        # Prepare notification data
        notification_data = {
            'id': notification.id,
            'sender': {
                'id': notification.sender.id,
                'username': notification.sender.username,
                'name': getattr(notification.sender, 'name', notification.sender.username),
                'avatar_url': getattr(notification.sender, 'avatar_url', None),
            },
            'notification_type': notification.notification_type,
            'text': notification.text,
            'created_at': notification.created_at.isoformat(),
            'is_read': notification.is_read
        }
        
        # Add related object information if available
        if notification.related_object:
            notification_data['related_object_info'] = {
                'id': notification.object_id,
                'type': notification.content_type.model,
            }
        
        # Send notification to all user sessions
        for session_id in user_sessions[recipient_id]:
            await sio.emit('notification_message', notification_data, room=session_id)
        
        # Update unread notification count
        unread_count = get_unread_notification_count(notification.recipient)
        for session_id in user_sessions[recipient_id]:
            await sio.emit('unread_count', {'count': unread_count}, room=session_id)

# WebSocket consumer for notifications using Channels
class NotificationConsumerSocketIO(AsyncWebsocketConsumer):
    async def connect(self):
        # Accept connection without authentication initially
        await self.accept()
        
        # Verify authentication after accepting connection
        self.user = self.scope["user"]
        
        if self.user.is_anonymous:
            # Send error message to client
            await self.send(text_data=json.dumps({
                "type": "error",
                "message": "User is not authorized"
            }))
            # Do not close connection here to avoid continuous retries
            return
            
        self.notification_group_name = f"notifications_{self.user.id}"
        
        await self.channel_layer.group_add(
            self.notification_group_name,
            self.channel_name
        )
        
        # Send unread notification count on connection
        count = await self.get_unread_notification_count()
        await self.send(text_data=json.dumps({
            "type": "unread_count",
            "count": count
        }))
        
        print(f"User {self.user.username} (ID: {self.user.id}) connected to WebSocket.")
    
    async def disconnect(self, close_code):
        if hasattr(self, 'notification_group_name'):
            await self.channel_layer.group_discard(
                self.notification_group_name,
                self.channel_name
            )
        print(f"User disconnected with session ID {self.channel_name}")
    
    async def receive(self, text_data):
        if self.user.is_anonymous:
            # Send error message to client
            await self.send(text_data=json.dumps({
                "type": "error",
                "message": "User is not authorized"
            }))
            return
            
        data = json.loads(text_data)
        command = data.get("command", None)
        
        if command == "mark_as_read":
            notification_id = data.get("notification_id", None)
            if notification_id:
                await self.mark_notification_as_read(notification_id)
                
                # Get updated unread notification count
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
                "count": 0
            }))
            
            await self.send(text_data=json.dumps({
                "type": "unread_count",
                "count": 0
            }))
            
        elif command == "get_unread_count":
            count = await self.get_unread_notification_count()
            
            await self.send(text_data=json.dumps({
                "type": "unread_count",
                "count": count
            }))
    
    async def notification_message(self, event):
        # Forward notification message to WebSocket
        await self.send(text_data=json.dumps(event))
        
        # Send updated unread notification count
        count = await self.get_unread_notification_count()
        await self.send(text_data=json.dumps({
            "type": "unread_count",
            "count": count
        }))
    
    async def mark_notification_as_read(self, notification_id):
        from notifications.models import Notification
        from .utils import get_unread_notification_count
        try:
            notification = await database_sync_to_async(
                lambda: Notification.objects.get(id=notification_id, recipient=self.user)
            )()
            notification.is_read = True
            await database_sync_to_async(notification.save)()
            
            # Get updated unread count
            unread_count = await database_sync_to_async(get_unread_notification_count)(self.user)
            
            # Send updated unread count to client
            await self.send(text_data=json.dumps({
                "type": "notification_read",
                "notification_id": notification_id,
                "unread_count": unread_count
            }))
            
            return True
        except Notification.DoesNotExist:
            return False
    
    async def mark_all_notifications_as_read(self):
        from .utils import mark_notifications_as_read
        count = await database_sync_to_async(mark_notifications_as_read)(self.user)
        
        # Send notification that all have been read
        await self.send(text_data=json.dumps({
            "type": "all_notifications_read",
            "count": 0
        }))
        
        # Also send updated unread count (which should be 0)
        await self.send(text_data=json.dumps({
            "type": "unread_count",
            "count": 0
        }))
        
        return count
    
    async def get_unread_notification_count(self):
        from .utils import get_unread_notification_count
        return await database_sync_to_async(get_unread_notification_count)(self.user)

# ASGI application
socket_app = socketio.ASGIApp(sio)
