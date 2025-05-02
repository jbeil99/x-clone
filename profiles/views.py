from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, viewsets, permissions
from rest_framework.decorators import action
from accounts.models import User, Follow
from tweets.models import Tweet, Media, Retweets
from tweets.serializers import TweetSerializer, MediaSerializer
from .serializers import ProfileSerializer
import random
from django.shortcuts import get_object_or_404
from rest_framework.pagination import PageNumberPagination


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Retrieve the profile of the authenticated user."""
        user = request.user
        serializer = ProfileSerializer(user)
        return Response(serializer.data)


class FollowView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, username):
        """Follow or unfollow a user."""
        user_to_follow = get_object_or_404(User, username=username)
        following_user = request.user

        if user_to_follow == following_user:
            return Response(
                {"error": "You cannot follow yourself."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            follow_instance = Follow.objects.get(
                follower=following_user, following=user_to_follow
            )
            follow_instance.delete()
            return Response(
                {"message": f"You have unfollowed {username}."},
                status=status.HTTP_200_OK,
            )
        except Follow.DoesNotExist:
            Follow.objects.create(follower=following_user, following=user_to_follow)
            return Response(
                {"message": f"You are now following {username}."},
                status=status.HTTP_200_OK,
            )


class EditProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        """Edit the profile of the authenticated user."""
        user = request.user
        serializer = ProfileSerializer(
            user, data=request.data, partial=True, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileTweetViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, user_id=None):
        user = get_object_or_404(User, pk=user_id)
        original_tweets = Tweet.objects.filter(user=user, parent=None)
        retweets = Retweets.objects.filter(user=user)
        retweeted_tweets = [retweet.tweet for retweet in retweets]
        all_tweets = list(original_tweets) + retweeted_tweets
        serializer = TweetSerializer(
            all_tweets, many=True, context={"request": request}
        )
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="likes/(?P<user_id>[^/.]+)")
    def likes(self, request, user_id=None):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )

        liked_tweets = Tweet.objects.filter(likes__user=user)
        serializer = TweetSerializer(
            liked_tweets, many=True, context={"request": request}
        )
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="retweets/(?P<user_id>[^/.]+)")
    def retweets(self, request, user_id=None):
        tweet = get_object_or_404(Tweet, pk=user_id)
        retweets = Retweets.objects.filter(tweet=tweet)  # Filter by the Retweets model
        serializer = TweetSerializer(
            [retweet.tweet for retweet in retweets],
            many=True,
            context={"request": request},
        )
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="replies/(?P<user_id>[^/.]+)")
    def replies(self, request, user_id=None):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )

        replies = Tweet.objects.filter(user=user, parent__isnull=False)
        serializer = TweetSerializer(replies, many=True, context={"request": request})
        return Response(serializer.data)


class UserProfileByUsernameView(APIView):
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = ProfileSerializer(user, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class WhoToFollowView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        current_user = request.user
        following_users = current_user.following.all()
        excluded_users = [current_user.id] + [user.id for user in following_users]
        available_users = User.objects.exclude(id__in=excluded_users)
        random_users = random.sample(
            list(available_users), min(5, available_users.count())
        )
        serializer = ProfileSerializer(
            random_users, many=True, context={"request": request}
        )
        return Response(serializer.data)


class UserFollowersView(APIView):
    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        followers = user.user_followers
        paginator = PageNumberPagination()
        paginated_followers = paginator.paginate_queryset(followers, request)
        serializer = ProfileSerializer(
            paginated_followers, many=True, context={"request": request}
        )
        return paginator.get_paginated_response(serializer.data)


class UserFollowingView(APIView):
    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        following = user.user_following
        paginator = PageNumberPagination()
        paginated_following = paginator.paginate_queryset(following, request)
        serializer = ProfileSerializer(
            paginated_following, many=True, context={"request": request}
        )
        return paginator.get_paginated_response(serializer.data)


class UserMediaView(APIView):
    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        tweets_with_media = (
            Tweet.objects.filter(user=user).filter(media__isnull=False).distinct()
        )
        media_items = Media.objects.filter(tweet__in=tweets_with_media)
        paginator = PageNumberPagination()
        paginated_media = paginator.paginate_queryset(media_items, request)
        serializer = MediaSerializer(paginated_media, many=True)
        return paginator.get_paginated_response(serializer.data)
