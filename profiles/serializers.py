from rest_framework import serializers
from accounts.models import User  # Import the User model

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "display_name",
            "bio",
            "avatar",
            "cover_image",
            "mobile_phone",
            "date_of_birth",
            "country",
            "followers_count",
            "followed_count",
        ]