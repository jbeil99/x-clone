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
    messages = Message.objects.filter(
        (models.Q(sender=request.user, receiver_id=other_id) |
         models.Q(sender_id=other_id, receiver=request.user))
    ).order_by('timestamp')
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
