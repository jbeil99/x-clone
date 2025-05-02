from django.contrib import admin
from .models import Notification

# Register your models here.

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['id', 'recipient', 'sender', 'notification_type', 'created_at', 'is_read']
    list_filter = ['notification_type', 'is_read', 'created_at']
    search_fields = ['recipient__username', 'sender__username', 'text']
    readonly_fields = ['created_at']
