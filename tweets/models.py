from django.db import models
from accounts.models import User
import re
from django.core.exceptions import ValidationError
import os


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

    if value.size > 50 * 1024 * 1024:  # 50MB limit
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
    bookmarks = models.ManyToManyField(
        User, related_name="bookmarked_tweets", blank=True
    )
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

    def extract_mentions(self, content):
        return re.findall(r"@(\w+)", content)

    def is_user_liked(self, user):
        return self.likes.filter(user=user).exists()

    def is_user_bookmarked(self, user):
        return self.bookmarks.filter(pk=user.pk).exists()

    def is_user_retweeted(self, user):
        return self.retweets.filter(user=user).exists()

    @classmethod
    def get_tweets(cls):
        return cls.objects.filter(parent=None)

    @classmethod
    def get_bookmarked_tweets(cls, user):
        return cls.objects.filter(bookmarks=user)

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
        hashtags = self.extract_hashtags(self.content)
        for tag in hashtags:
            HashtagLog.objects.create(name=tag)
            hashtag, _ = Hashtag.objects.get_or_create(name=tag)
            self.hashtags.add(hashtag)

        mentions_in_content = self.extract_mentions(self.content)
        for username in mentions_in_content:
            try:
                mentioned_user = User.objects.get(username=username)
                if not Mention.objects.filter(
                    tweet=self, mentioned_user=mentioned_user
                ).exists():
                    Mention.objects.create(tweet=self, mentioned_user=mentioned_user)
            except User.DoesNotExist:
                continue

    @staticmethod
    def extract_hashtags(content):
        """Extract hashtags from tweet content."""
        return [word[1:] for word in content.split() if word.startswith("#")]


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
