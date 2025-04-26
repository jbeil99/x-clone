from django.contrib import admin
from .models import Profile

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("username", "name", "date_joined")  # Use existing fields from the Profile model
    search_fields = ("username", "name", "bio")  # Adjust search fields as needed
