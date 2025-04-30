from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from accounts.serializers import UserSerializer
from django.contrib.auth import get_user_model
from .models import Message
from .serializers import MessageSerializer
from rest_framework import status
from django.db import models
import mimetypes

User = get_user_model()

# Create your views here.

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def all_users(request):
    users = User.objects.filter(is_active=True).exclude(id=request.user.id)
    serializer = UserSerializer(users, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_messages(request):
    other_id = request.GET.get('user')
    if not other_id:
        return Response({'detail': 'user id required'}, status=400)
    try:
        other_id = int(other_id)
    except (TypeError, ValueError):
        return Response({'detail': 'user id must be integer'}, status=400)
    
    # Get all messages between the current user and the other user
    messages = Message.objects.filter(
        (models.Q(sender=request.user, receiver_id=other_id) |
         models.Q(sender_id=other_id, receiver=request.user))
    ).order_by('timestamp')
    
    # Mark messages as read if the current user is the receiver
    unread_messages = messages.filter(receiver=request.user, read=False)
    if unread_messages.exists():
        unread_messages.update(read=True)
    
    print('Messages found:', messages.count())  # Debug
    serializer = MessageSerializer(messages, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request):
    receiver_id = request.data.get('receiver')
    content = request.data.get('content')
    if not receiver_id or not content:
        return Response({'detail': 'receiver and content required'}, status=400)
    receiver = User.objects.filter(id=receiver_id).first()
    if not receiver:
        return Response({'detail': 'receiver not found'}, status=404)
    message = Message.objects.create(sender=request.user, receiver=receiver, content=content)
    serializer = MessageSerializer(message, context={'request': request})
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message_with_file(request):
    receiver_id = request.data.get('receiver')
    content = request.data.get('content', '')
    file = request.FILES.get('file')
    
    if not receiver_id:
        return Response({'detail': 'receiver is required'}, status=400)
    if not file:
        return Response({'detail': 'file is required'}, status=400)
    
    receiver = User.objects.filter(id=receiver_id).first()
    if not receiver:
        return Response({'detail': 'receiver not found'}, status=404)
    
    # Determine file type
    file_type = 'file'
    mime_type = mimetypes.guess_type(file.name)[0]
    if mime_type:
        if mime_type.startswith('image/'):
            file_type = 'image'
        elif mime_type.startswith('video/'):
            file_type = 'video'
        elif mime_type.startswith('audio/'):
            file_type = 'audio'
    
    message = Message.objects.create(
        sender=request.user,
        receiver=receiver,
        content=content,
        file=file,
        file_type=file_type
    )
    
    serializer = MessageSerializer(message, context={'request': request})
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_unread_count(request):
    """
    Get the count of unread messages for the current user
    """
    # Count messages where the current user is the receiver and has not read them
    unread_count = Message.objects.filter(
        receiver=request.user,
        read=False
    ).count()
    
    return Response({'count': unread_count})
