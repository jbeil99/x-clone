from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .utils import create_notification

User = get_user_model()

@receiver(post_save, sender='profiles.Follow')
def create_follow_notification(sender, instance, created, **kwargs):
    if created:
        create_notification(
            sender=instance.follower,
            recipient=instance.following,
            notification_type='follow',
            related_object=instance
        )

@receiver(post_save, sender='tweets.Like')
def create_like_notification(sender, instance, created, **kwargs):
    if created:
        create_notification(
            sender=instance.user,
            recipient=instance.tweet.user,
            notification_type='like',
            related_object=instance.tweet
        )

@receiver(post_save, sender='tweets.Comment')
def create_comment_notification(sender, instance, created, **kwargs):
    if created:
        create_notification(
            sender=instance.user,
            recipient=instance.tweet.user,
            notification_type='comment',
            related_object=instance.tweet,
            text=instance.content[:50]
        )

@receiver(post_save, sender='tweets.Retweet')
def create_retweet_notification(sender, instance, created, **kwargs):
    if created:
        create_notification(
            sender=instance.user,
            recipient=instance.tweet.user,
            notification_type='retweet',
            related_object=instance.tweet
        )
