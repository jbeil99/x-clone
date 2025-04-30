from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, viewsets, permissions
from rest_framework.decorators import action
from accounts.models import User, Follow
from tweets.models import Tweet, Likes
from tweets.serializers import TweetSerializer
from .serializers import ProfileSerializer
import random


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Retrieve the profile of the authenticated user."""
        user = request.user
        serializer = ProfileSerializer(user)
        return Response(serializer.data)

class FollowView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Follow or unfollow a user."""
        user_to_follow_id = request.data.get("user_id")
        if not user_to_follow_id:
            return Response(
                {"error": "User ID is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user_to_follow = User.objects.get(id=user_to_follow_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )

        if user_to_follow == request.user:
            return Response(
                {"error": "You cannot follow yourself."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if the follow relationship already exists
        follow, created = Follow.objects.get_or_create(
            follower=request.user, followed=user_to_follow
        )

        if created:
            return Response(
                {"detail": "You are now following this user."},
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(
                {"detail": "You are already following this user."},
                status=status.HTTP_200_OK,
            )


class EditProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        """Edit the profile of the authenticated user."""
        user = request.user
        serializer = ProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileTweetViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, user_id=None):
        """List all tweets by a specific user."""
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )

        tweets = Tweet.objects.filter(user=user, parent=None)
        serializer = TweetSerializer(tweets, many=True, context={"request": request})
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
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )

        retweets = Tweet.objects.filter(user=user).exclude(parent=None)
        serializer = TweetSerializer(retweets, many=True, context={"request": request})
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
    def get(self, request):
        current_user = request.user
        following_users = current_user.followed.all()
        excluded_users = [current_user.id] + [user.id for user in following_users]
        available_users = User.objects.exclude(id__in=excluded_users)
        random_users = random.sample(
            list(available_users), min(5, available_users.count())
        )
        serializer = ProfileSerializer(
            random_users, many=True, context={"request": request}
        )
        return Response(serializer.data)
