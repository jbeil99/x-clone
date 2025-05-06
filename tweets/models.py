from django.db import models
from accounts.models import User
import re
from django.core.exceptions import ValidationError
import os
from grok.gemini_integration import (
    generate_response,
)
from core.utils.helpers import extract_hashtags, extract_mentions


class Hashtag(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class HashtagLog(models.Model):
    name = models.CharField(max_length=100, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    @classmethod
    def get_trending_hashtags(cls, time_window):
        return (
            cls.objects.filter(created_at__gte=time_window)
            .values("name")
            .annotate(count=models.Count("name"))
            .order_by("-count")[:5]
        )


def validate_media_type(value):
    ext = os.path.splitext(value.name)[1].lower()
    allowed_image_extensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"]
    allowed_video_extensions = [".mp4", ".mov", ".webm", ".avi"]
    allowed_extensions = allowed_image_extensions + allowed_video_extensions
    if ext not in allowed_extensions:
        raise ValidationError(
            f"Unsupported file extension. Allowed extensions are: {', '.join(allowed_extensions)}"
        )

    if value.size > 50 * 1024 * 1024:
        raise ValidationError("File size cannot exceed 50MB.")

    return value


class Media(models.Model):
    file = models.FileField(upload_to="tweet_media/", validators=[validate_media_type])
    tweet = models.ForeignKey(
        "Tweet", on_delete=models.CASCADE, related_name="media", null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Media {self.id} for Tweet {self.tweet_id if self.tweet else 'None'}"


class Tweet(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tweets")
    content = models.CharField(max_length=280, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    shared_by_users = models.ManyToManyField(
        User, related_name="tweets_shared_directly", blank=True
    )
    views = models.ManyToManyField(User, related_name="viewed_tweets", blank=True)
    parent = models.ForeignKey(
        "self", null=True, blank=True, related_name="replies", on_delete=models.CASCADE
    )
    hashtags = models.ManyToManyField(Hashtag, related_name="tweets", blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Tweet {self.id} by {self.user.username}"

    def is_user_liked(self, user):
        return self.likes.filter(id=user.id).exists()

    def is_user_bookmarked(self, user):
        return self.bookmarked_by.filter(id=user.id).exists()

    def is_user_retweeted(self, user):
        return self.retweets.filter(id=user.id).exists()

    @classmethod
    def get_tweets(cls):
        return (
            cls.objects.filter(parent=None)
            .exclude(user__username="frog")
            .exclude(is_staff=True)
            .exclude(is_superuser=True)
        )

    @classmethod
    def get_bookmarked_tweets(cls, user):
        return cls.objects.filter(bookmarked_by__id=user.id)

    @classmethod
    def get_top_tweets_by_hashtag(cls, hashtag):
        return (
            cls.objects.filter(hashtags=hashtag)
            .annotate(like_count=models.Count("likes"))
            .order_by("-like_count")
        )

    @classmethod
    def get_latest_tweets_by_hashtag(cls, hashtag):
        return cls.objects.filter(hashtags=hashtag).order_by("-created_at")[:10]

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        hashtags = extract_hashtags(self.content)
        for tag in hashtags:
            HashtagLog.objects.create(name=tag)
            hashtag, _ = Hashtag.objects.get_or_create(name=tag)
            self.hashtags.add(hashtag)

        mentions_in_content = extract_mentions(self.content)
        for username in mentions_in_content:
            try:
                mentioned_user = User.objects.get(username=username)
                if not Mention.objects.filter(
                    tweet=self, mentioned_user=mentioned_user
                ).exists():
                    Mention.objects.create(tweet=self, mentioned_user=mentioned_user)

                    print("lol here im frogg", username)
                if username == "frog" and self.user.username != "frog":
                    self.call_chat_bot()
            except User.DoesNotExist:
                continue

    def call_chat_bot(self):
        try:
            bot_user = User.objects.get(username="frog")
        except User.DoesNotExist:
            print("Bot user not found.  Please create a user with username 'bot'.")
            return
        prompt = self.content

        if self.parent:
            prompt += f" (Replying to: {self.parent.content})"

        try:
            ai_response_text = f"@{self.user.username} {generate_response(prompt)}"

            Tweet.objects.create(user=bot_user, content=ai_response_text, parent=self)

        except Exception as e:
            print(f"Error generating response: {e}")


class Mention(models.Model):
    tweet = models.ForeignKey(Tweet, on_delete=models.CASCADE, related_name="mentions")
    mentioned_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="mentions_received"
    )
    created_at = models.DateTimeField(auto_now_add=True)


class Likes(models.Model):
    user = models.ForeignKey(User, related_name="likes", on_delete=models.CASCADE)
    tweet = models.ForeignKey(Tweet, related_name="likes", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "tweet")

    def __str__(self):
        return f"{self.user.username} liked {self.tweet}"


class Retweets(models.Model):
    user = models.ForeignKey(User, related_name="retweets", on_delete=models.CASCADE)
    tweet = models.ForeignKey(Tweet, related_name="retweets", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "tweet")

    def __str__(self):
        return f"{self.user.username} retweeted {self.tweet.content[:20]}"


class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bookmarks")
    tweet = models.ForeignKey(
        Tweet, on_delete=models.CASCADE, related_name="bookmarked_by"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "tweet")


class TweetShare(models.Model):
    tweet = models.ForeignKey(
        Tweet, on_delete=models.CASCADE, related_name="share_logs"
    )
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="share_history"
    )
    shared_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} shared tweet {self.tweet.id}"
