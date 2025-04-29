from rest_framework import serializers
from accounts.models import User  # Import the User model
from core.utils.helpers import build_absolute_url


class ProfileSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()

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

    def get_avatar(self, obj):
        return build_absolute_url(obj.avatar.url)
