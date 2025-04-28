from rest_framework import serializers
from .models import Tweet, Comment, Likes
from core.utils.helpers import build_absolute_url, time_ago
from accounts.serializers import UserSerializer


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.username")
    avatar = serializers.ReadOnlyField(source="user.avatar.url")

    class Meta:
        model = Comment
        fields = "__all__"

    def get_avatar(self, obj):
        return obj.user.avatar.url


class MyTweetSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField(read_only=True)
    retweets_count = serializers.SerializerMethodField(read_only=True)
    user = serializers.ReadOnlyField(source="user.username")
    avatar = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Tweet
        fields = [
            "id",
            "user",
            "avatar",
            "content",
            "image",
            "likes",
            "retweeted",
            "created_at",
            "likes_count",
            "retweets_count",
        ]

    def get_avatar(self, obj):
        return build_absolute_url(obj.user.avatar.url)

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_retweets_count(self, obj):
        return obj.retweeted.count()


class TweetSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField(read_only=True)
    retweets_count = serializers.SerializerMethodField(read_only=True)
    iliked = serializers.SerializerMethodField(read_only=True)
    iretweeted = serializers.SerializerMethodField(read_only=True)
    time = serializers.SerializerMethodField(read_only=True)
    author = UserSerializer(source="user", read_only=True)
    comments_count = serializers.SerializerMethodField()
    replies_count = serializers.SerializerMethodField()

    class Meta:
        model = Tweet
        fields = [
            "id",
            "author",
            "content",
            "image",
            "created_at",
            "likes_count",
            "retweets_count",
            "iliked",
            "iretweeted",
            "time",
            "comments_count",
            "replies_count",
            "parent",
        ]
        extra_kwargs = {"user": {"write_only": True}, "parent": {"write_only": True}}

    def get_avatar(self, obj):
        return build_absolute_url(obj.user.avatar.url)

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_retweets_count(self, obj):
        return obj.retweets.count()

    def get_replies_count(self, obj):
        return obj.replies.count()

    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_iliked(self, obj):
        return obj.is_user_liked(self.context["request"].user)

    def get_iretweeted(self, obj):
        return obj.is_user_retweeted(self.context["request"].user)

    def get_time(self, obj):
        print(obj.created_at)
        return time_ago(obj.created_at)


class TweetLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Likes
        fields = [
            "id",
            "user",
            "tweet",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]
