from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model
from tweets.models import Tweet
import random
import datetime

User = get_user_model()

# Example tweet contents with/without hashtags and mentions
TWEET_CONTENTS = [
    "Just finished a great book on Django! #Python #Django",
    "Life is beautiful when you write clean code.",
    "Any thoughts on the new AI model? #Tech @user12",
    "Loving the new features in our product launch! #Startup",
    "@user30 let's collaborate on that new idea we discussed.",
    "Exploring the intersection of technology and art. #Innovation",
    "This is a test tweet to check our seeding logic.",
    "Replying to a tweet about #MachineLearning trends.",
    "@frog What are your thoughts on this?",
    "Creating something new every day. #CreativeLife",
]


class Command(BaseCommand):
    help = "Seeds the database with random tweets"

    def handle(self, *args, **kwargs):
        users = list(User.objects.exclude(username="frog"))
        if len(users) < 10:
            self.stdout.write(
                self.style.ERROR(
                    "Not enough users to generate tweets. Please seed users first."
                )
            )
            return

        created_tweets = []

        for _ in range(150):
            user = random.choice(users)
            content = random.choice(TWEET_CONTENTS)
            created_at = timezone.now() - datetime.timedelta(days=random.randint(0, 30))

            # Optional: randomly make some tweets replies
            parent = (
                random.choice(created_tweets)
                if created_tweets and random.random() < 0.2
                else None
            )

            tweet = Tweet.objects.create(
                user=user, content=content, created_at=created_at, parent=parent
            )
            created_tweets.append(tweet)

        self.stdout.write(self.style.SUCCESS("150 random tweets created successfully."))
