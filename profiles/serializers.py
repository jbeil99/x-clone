from rest_framework import serializers
from accounts.models import User  # Import the User model
from core.utils.helpers import build_absolute_url


class ProfileSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()
    cover_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        extra_kwargs = {
            "avatar": {"write_only": True},
        }
        fields = [
            "id",
            "email",
            "username",
            "display_name",
            "bio",
            "avatar_url",
            "cover_url",
            "mobile_phone",
            "date_of_birth",
            "country",
            "followers_count",
            "followed_count",
            "avatar",
            "cover_image",
        ]

    def get_avatar_url(self, obj):
        return build_absolute_url(obj.avatar.url)

    def get_cover_url(self, obj):
        return build_absolute_url(obj.cover_image.url)
