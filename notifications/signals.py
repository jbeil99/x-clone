from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.db.models import Q
import re

from profiles.models import Profile
from tweets.models import Tweet, Likes, Retweets, TweetShare
from .utils import create_notification

User = get_user_model()

# Import Follow model from profiles app
try:
    from profiles.models import Follow
except ImportError:
    # Define a placeholder if the model doesn't exist yet
    Follow = None

@receiver(post_save, sender=Follow)
def create_follow_notification(sender, instance, created, **kwargs):
    # Skip migrations and other non-Follow objects
    if not hasattr(instance, 'follower') or not hasattr(instance, 'following'):
        return
        
    if created and instance.follower.id != instance.following.id:  # Don't notify yourself
        create_notification(
            sender=instance.follower,
            recipient=instance.following,
            notification_type='follow',
            related_object=instance
        )

@receiver(post_save, sender=Likes)
def create_like_notification(sender, instance, created, **kwargs):
    # Skip migrations and other non-Likes objects
    if not hasattr(instance, 'user') or not hasattr(instance, 'tweet'):
        return
        
    if created and instance.user.id != instance.tweet.user.id:  # Don't notify yourself
        create_notification(
            sender=instance.user,
            recipient=instance.tweet.user,
            notification_type='like',
            related_object=instance.tweet
        )

# We'll need to check if Comment model exists
try:
    from tweets.models import Comment
    @receiver(post_save, sender=Comment)
    def create_comment_notification(sender, instance, created, **kwargs):
        # Skip migrations and other non-Comment objects
        if not hasattr(instance, 'user') or not hasattr(instance, 'tweet') or not hasattr(instance, 'content'):
            return
            
        if created:
            # Notify the tweet owner about the comment
            if instance.user.id != instance.tweet.user.id:  # Don't notify yourself
                create_notification(
                    sender=instance.user,
                    recipient=instance.tweet.user,
                    notification_type='comment',
                    related_object=instance.tweet,
                    text=instance.content[:50]
                )
            
            # Process mentions in the comment
            process_mentions(instance.content, instance.user, instance.tweet)
except ImportError:
    # Comment model doesn't exist yet
    pass

@receiver(post_save, sender=Retweets)
def create_retweet_notification(sender, instance, created, **kwargs):
    # Skip migrations and other non-Retweets objects
    if not hasattr(instance, 'user') or not hasattr(instance, 'tweet'):
        return
        
    if created and instance.user.id != instance.tweet.user.id:  # Don't notify yourself
        create_notification(
            sender=instance.user,
            recipient=instance.tweet.user,
            notification_type='retweet',
            related_object=instance.tweet
        )

@receiver(post_save, sender=Tweet)
def process_tweet_mentions(sender, instance, created, **kwargs):
    # Skip migrations and other non-Tweet objects
    if not hasattr(instance, 'content') or not hasattr(instance, 'user'):
        return
        
    if created:
        process_mentions(instance.content, instance.user, instance)

@receiver(post_save, sender=TweetShare)
def create_share_notification(sender, instance, created, **kwargs):
    # Skip migrations and other non-TweetShare objects
    if not hasattr(instance, 'user') or not hasattr(instance, 'tweet'):
        return
        
    if created and instance.user.id != instance.tweet.user.id:  # Don't notify yourself
        create_notification(
            sender=instance.user,
            recipient=instance.tweet.user,
            notification_type='share',
            related_object=instance.tweet
        )

def process_mentions(content, sender, related_object):
    """Process mentions in content and create notifications"""
    # Safety check
    if not content or not isinstance(content, str):
        return
        
    # Find all mentions in the format @username
    mentions = re.findall(r'@(\w+)', content)
    
    if not mentions:
        return
    
    # Get all users that match the mentioned usernames
    mentioned_users = User.objects.filter(username__in=mentions)
    
    # Create a notification for each mentioned user
    for user in mentioned_users:
        if user.id != sender.id:  # Don't notify yourself
            create_notification(
                sender=sender,
                recipient=user,
                notification_type='mention',
                related_object=related_object,
                text=content[:50]
            )
