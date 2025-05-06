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



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def all_users(request):
    from accounts.models import Follow
    
    following_ids = Follow.objects.filter(follower=request.user).values_list('following_id', flat=True)
    
    followers_ids = Follow.objects.filter(following=request.user).values_list('follower_id', flat=True)
    
    mutual_ids = set(following_ids).intersection(set(followers_ids))
    
    users = User.objects.filter(id__in=mutual_ids, is_active=True)
    
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
    

    messages = Message.objects.filter(
        (models.Q(sender=request.user, receiver_id=other_id) |
         models.Q(sender_id=other_id, receiver=request.user))
    ).order_by('timestamp')
    

    unread_messages = messages.filter(receiver=request.user, read=False)
    if unread_messages.exists():
        unread_messages.update(read=True)
    
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


    unread_count = Message.objects.filter(
        receiver=request.user,
        read=False
    ).count()
    
    return Response({'count': unread_count})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_as_read(request):

    sender_id = request.data.get('sender')
    if not sender_id:
        return Response({'detail': 'sender id required'}, status=400)
    

    updated = Message.objects.filter(
        sender_id=sender_id,
        receiver=request.user,
        read=False
    ).update(read=True)
    
    return Response({'updated': updated})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_all_as_read(request):


    updated = Message.objects.filter(
        receiver=request.user,
        read=False
    ).update(read=True)
    
    return Response({'updated': updated})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_unread_by_user(request):


    unread_messages = Message.objects.filter(
        receiver=request.user,
        read=False
    ).values('sender').annotate(count=models.Count('id'))
    

    unread_counts = {}
    for item in unread_messages:
        unread_counts[str(item['sender'])] = item['count']
    
    return Response(unread_counts)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_spam_messages(request):
    from accounts.models import Follow
    
    # Get IDs of users that the current user is following
    following_ids = list(Follow.objects.filter(follower=request.user).values_list('following_id', flat=True))
    # Add the user's own ID to avoid showing their own messages
    following_ids.append(request.user.id)
    
    # Get messages from users that the current user is NOT following
    spam_messages = Message.objects.filter(
        receiver=request.user
    ).exclude(
        sender_id__in=following_ids
    ).order_by('-timestamp')
    
    serializer = MessageSerializer(spam_messages, many=True, context={'request': request})
    return Response(serializer.data)
