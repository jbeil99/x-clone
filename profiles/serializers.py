from rest_framework import serializers
from accounts.models import User
from core.utils.helpers import build_absolute_url


class ProfileSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()
    cover_url = serializers.SerializerMethodField()
    ifollow = serializers.SerializerMethodField()
    tweets_count = serializers.SerializerMethodField()

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
            "ifollow",
            "tweets_count",
        ]

    def get_avatar_url(self, obj):
        return build_absolute_url(obj.avatar.url)

    def get_cover_url(self, obj):
        return build_absolute_url(obj.cover_image.url)

    def get_ifollow(self, obj):
        return obj.is_user_followed(
            self.context["request"].user,
        )

    def get_tweets_count(self, obj):
        return obj.tweets.count()
