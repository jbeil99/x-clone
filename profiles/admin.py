from django.contrib import admin
from .models import Profile

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user_username', 'user_name', 'bio', 'date_joined')  # Corrected fields

    def user_username(self, obj):
        return obj.user.username  # Access the username from the related User model
    user_username.short_description = 'Username'

    def user_name(self, obj):
        return obj.user.get_full_name()  # Access the full name from the related User model
    user_name.short_description = 'Name'

admin.site.register(Profile, ProfileAdmin)
