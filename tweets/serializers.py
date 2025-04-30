from rest_framework import serializers
from .models import Tweet, Likes, Hashtag, Mention
from django.contrib.auth import get_user_model
from core.utils.helpers import build_absolute_url, time_ago
from accounts.serializers import UserSerializer

User = get_user_model()


class MentionSerializer(serializers.ModelSerializer):
    mentioned_username = serializers.CharField(source='mentioned_user.username', read_only=True)

    class Meta:
        model = Mention
        fields = ['mentioned_user', 'mentioned_username', 'created_at']



class MyTweetSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField(read_only=True)
    retweets_count = serializers.SerializerMethodField(read_only=True)
    user = serializers.ReadOnlyField(source="user.username")
    avatar = serializers.SerializerMethodField(read_only=True)
    hashtags = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name')


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
            "is_retweet",
            'hashtags',
            'mentions'
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
    replies_count = serializers.SerializerMethodField()
    is_retweet = serializers.SerializerMethodField()
    hashtags = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name')
    mentions = MentionSerializer(many=True, read_only=True)
    
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
            "replies_count",
            "parent",
            "is_retweet",
            'hashtags',
            "mentions"

        ]
        extra_kwargs = {
            "user": {"write_only": True},
        }

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

    def get_is_retweet(self, obj):
        return obj.parent is not None


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


class HashtagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hashtag
        fields = ['id', 'name']