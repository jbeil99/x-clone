from rest_framework import serializers
from accounts.models import User, Follow
from core.utils.helpers import build_absolute_url
from .models import MutedUser, ReportedTweet
import tweets.serializers as ts


class ProfileSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()
    cover_url = serializers.SerializerMethodField()
    ifollow = serializers.SerializerMethodField()
    imuted = serializers.SerializerMethodField()
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
            "following_count",
            "avatar",
            "cover_image",
            "ifollow",
            "imuted",
            "tweets_count",
        ]

    def get_avatar_url(self, obj):
        return build_absolute_url(obj.avatar.url)

    def get_cover_url(self, obj):
        return build_absolute_url(obj.cover_image.url)

    def get_ifollow(self, obj):
        following_user = self.context["request"].user
        return Follow.objects.filter(follower=following_user, following=obj).exists()

    def get_imuted(self, obj):
        user = self.context["request"].user
        return MutedUser.objects.filter(user=user, muted_user=obj).exists()

    def get_tweets_count(self, obj):
        return obj.tweets.count()


class MutedUserSerializer(serializers.ModelSerializer):
    """
    Serializer for MutedUser model.
    """

    muted_user = serializers.ReadOnlyField(source="muted_user.username")

    class Meta:
        model = MutedUser
        fields = ["id", "muted_user", "created_at"]


class ReportedTweetSerializer(serializers.ModelSerializer):
    """
    Serializer for ReportedTweet, including author and tweet details.
    """

    user = ProfileSerializer()
    tweet = serializers.SerializerMethodField()
    reported_count = serializers.SerializerMethodField()

    class Meta:
        model = ReportedTweet
        fields = [
            "id",
            "user",
            "tweet",
            "created_at",
            "reported_count",
        ]

    def get_tweet(self, obj):
        from tweets.serializers import TweetSerializer

        return TweetSerializer(obj.tweet, context=self.context).data

    def get_reported_count(self, obj):
        return ReportedTweet.objects.filter(tweet=obj.tweet).count()
