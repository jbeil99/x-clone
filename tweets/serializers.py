from rest_framework import serializers
from .models import Tweet, Likes, Hashtag, Mention, Media, Retweets
from django.contrib.auth import get_user_model
from core.utils.helpers import build_absolute_url, time_ago
from accounts.serializers import UserSerializer
from profiles.serializers import ProfileSerializer

User = get_user_model()


class MentionSerializer(serializers.ModelSerializer):
    mentioned_username = serializers.CharField(
        source="mentioned_user.username", read_only=True
    )

    class Meta:
        model = Mention
        fields = ["mentioned_username"]


class MediaSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Media
        fields = ["id", "file_url", "tweet", "created_at"]
        extra_kwargs = {"file": {"write_only": True}, "tweet": {"read_only": True}}

    def get_file_url(self, obj):
        return build_absolute_url(obj.file.url)


class RetweetUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    display_name = serializers.CharField(source="user.display_name", read_only=True)

    class Meta:
        model = User
        fields = ["username", "display_name"]


class RetweetSerializer(serializers.ModelSerializer):
    user = RetweetUserSerializer(read_only=True)

    class Meta:
        model = Retweets
        fields = ["user", "created_at"]


class TweetSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField(read_only=True)
    retweets_count = serializers.SerializerMethodField(read_only=True)
    iliked = serializers.SerializerMethodField(read_only=True)
    iretweeted = serializers.SerializerMethodField(read_only=True)
    ibookmarked = serializers.SerializerMethodField(read_only=True)
    time = serializers.SerializerMethodField(read_only=True)
    author = ProfileSerializer(source="user", read_only=True)
    replies_count = serializers.SerializerMethodField()
    is_retweet = serializers.SerializerMethodField()
    retweeted_by = serializers.SerializerMethodField()
    hashtags = serializers.SlugRelatedField(
        many=True, read_only=True, slug_field="name"
    )
    mentions = serializers.SlugRelatedField(
        many=True, read_only=True, slug_field="mentioned_user.username"
    )
    media = serializers.FileField(
        max_length=None,
        allow_empty_file=False,
        use_url=False,
        required=False,
        write_only=True,
    )
    content = serializers.CharField(max_length=280, required=False)

    class Meta:
        model = Tweet
        fields = [
            "id",
            "author",
            "content",
            "created_at",
            "likes_count",
            "retweets_count",
            "iliked",
            "iretweeted",
            "ibookmarked",
            "time",
            "replies_count",
            "parent",
            "is_retweet",
            "retweeted_by",
            "hashtags",
            "mentions",
            "media",
        ]
        extra_kwargs = {"user": {"write_only": True}}

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_retweets_count(self, obj):
        return obj.retweets.count()

    def get_replies_count(self, obj):
        return obj.replies.count()

    def get_iliked(self, obj):
        request = self.context.get("request")
        return obj.is_user_liked(request.user)

    def get_ibookmarked(self, obj):
        request = self.context.get("request")
        return obj.is_user_bookmarked(request.user)

    def get_iretweeted(self, obj):
        request = self.context.get("request")
        return obj.is_user_retweeted(request.user)

    def get_time(self, obj):
        return time_ago(obj.created_at)

    def get_is_retweet(self, obj):
        return Retweets.objects.filter(tweet=obj).exists()

    def get_retweeted_by(self, obj):
        retweet = Retweets.objects.filter(tweet=obj).first()
        if retweet:
            serializer = RetweetUserSerializer(retweet)
            return serializer.data
        return None

    def validate(self, data):
        content = data.get("content", "")
        media = data.get("media", None)
        if not content and not media:
            raise serializers.ValidationError("Either content or media is required.")

        return data

    def create(self, validated_data):
        request = self.context.get("request")
        if not request:
            raise serializers.ValidationError("Request context is required")
        user = request.user
        media_file = validated_data.pop("media", None)

        content = validated_data.get("content", "")
        parent = validated_data.get("parent", None)
        tweet = Tweet.objects.create(user=user, content=content, parent=parent)
        if media_file:
            Media.objects.create(tweet=tweet, file=media_file)

        return tweet

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        media_serializer = MediaSerializer(instance.media.all(), many=True)
        representation["media"] = media_serializer.data
        # if Retweets.objects.filter(tweet=instance).exists():
        #     retweet_instance = Retweets.objects.filter(tweet=instance).first()
        #     if retweet_instance:
        #         representation['created_at'] = retweet_instance.created_at.isoformat()

        return representation


class RetweetTweetSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField(read_only=True)
    retweets_count = serializers.SerializerMethodField(read_only=True)
    iliked = serializers.SerializerMethodField(read_only=True)
    iretweeted = serializers.SerializerMethodField(read_only=True)
    ibookmarked = serializers.SerializerMethodField(read_only=True)
    time = serializers.SerializerMethodField(read_only=True)
    author = ProfileSerializer(source="user", read_only=True)
    replies_count = serializers.SerializerMethodField()
    is_retweet = serializers.SerializerMethodField()
    retweeted_by = serializers.SerializerMethodField()
    hashtags = serializers.SlugRelatedField(
        many=True, read_only=True, slug_field="name"
    )
    mentions = serializers.SlugRelatedField(
        many=True, read_only=True, slug_field="mentioned_user.username"
    )
    media = serializers.FileField(
        max_length=None,
        allow_empty_file=False,
        use_url=False,
        required=False,
        write_only=True,
    )
    content = serializers.CharField(max_length=280, required=False)

    class Meta:
        model = Tweet
        fields = [
            "id",
            "author",
            "content",
            "created_at",
            "likes_count",
            "retweets_count",
            "iliked",
            "iretweeted",
            "ibookmarked",
            "time",
            "replies_count",
            "parent",
            "is_retweet",
            "retweeted_by",
            "hashtags",
            "mentions",
            "media",
        ]
        extra_kwargs = {"user": {"write_only": True}}

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_retweets_count(self, obj):
        return obj.retweets.count()

    def get_replies_count(self, obj):
        return obj.replies.count()

    def get_iliked(self, obj):
        request = self.context.get("request")
        return obj.is_user_liked(request.user)

    def get_ibookmarked(self, obj):
        request = self.context.get("request")
        return obj.is_user_bookmarked(request.user)

    def get_iretweeted(self, obj):
        request = self.context.get("request")
        return obj.is_user_retweeted(request.user)

    def get_time(self, obj):
        return time_ago(obj.created_at)

    def get_is_retweet(self, obj):
        return Retweets.objects.filter(tweet=obj).exists()

    def get_retweeted_by(self, obj):
        retweet = Retweets.objects.filter(tweet=obj).first()
        if retweet:
            serializer = RetweetUserSerializer(retweet)
            return serializer.data
        return None

    def validate(self, data):
        content = data.get("content", "")
        media = data.get("media", None)
        if not content and not media:
            raise serializers.ValidationError("Either content or media is required.")

        return data

    def create(self, validated_data):
        request = self.context.get("request")
        if not request:
            raise serializers.ValidationError("Request context is required")
        user = request.user
        media_file = validated_data.pop("media", None)

        content = validated_data.get("content", "")
        parent = validated_data.get("parent", None)
        tweet = Tweet.objects.create(user=user, content=content, parent=parent)
        if media_file:
            Media.objects.create(tweet=tweet, file=media_file)

        return tweet

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        media_serializer = MediaSerializer(instance.media.all(), many=True)
        representation["media"] = media_serializer.data
        if Retweets.objects.filter(tweet=instance).exists():
            retweet_instance = Retweets.objects.filter(tweet=instance).first()
            if retweet_instance:
                representation["created_at"] = retweet_instance.created_at.isoformat()

        return representation


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
        fields = ["id", "name"]
