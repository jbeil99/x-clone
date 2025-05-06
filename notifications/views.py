from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response

from .models import Notification
from .serializers import NotificationSerializer
from .utils import mark_notifications_as_read, get_unread_notification_count, create_notification

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)
    
    @action(detail=False, methods=['get'])
    def unread(self, request):
        queryset = self.get_queryset().filter(is_read=False)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        count = get_unread_notification_count(request.user)
        return Response({'count': count})
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        count = mark_notifications_as_read(request.user)
        return Response({'marked_count': count}, status=status.HTTP_200_OK)
        
    @action(detail=False, methods=['post'])
    def test_notification(self, request):
        recipient_id = request.data.get('recipient_id')
        notification_type = request.data.get('notification_type', 'follow')
        text = request.data.get('text', 'This is a test notification')
        
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        try:
            recipient = User.objects.get(id=recipient_id)
        except User.DoesNotExist:
            return Response(
                {'error': 'Recipient user not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        notification = create_notification(
            sender=request.user,
            recipient=recipient,
            notification_type=notification_type,
            text=text
        )
        
        if notification:
            return Response(
                {'success': 'Notification created successfully', 'notification_id': notification.id}, 
                status=status.HTTP_201_CREATED
            )
        else:
            return Response(
                {'error': 'Failed to create notification'}, 
                status=status.HTTP_400_BAD_REQUEST
            )