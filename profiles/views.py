from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, viewsets, permissions
from rest_framework.decorators import action
from accounts.models import User, Follow
from tweets.models import Tweet, Media, Retweets
from tweets.serializers import TweetSerializer, MediaSerializer, RetweetSerializer
from .serializers import ProfileSerializer, MutedUserSerializer, ReportedUserSerializer
import random
from django.shortcuts import get_object_or_404
from rest_framework.pagination import PageNumberPagination
from rest_framework import generics
from .models import MutedUser, ReportedUser


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
        original_serializer = TweetSerializer(
            original_tweets, many=True, context={"request": request}
        )
        retweeted_serializer = RetweetSerializer(
            retweeted_tweets, many=True, context={"request": request}
        )
        original_data = original_serializer.data
        for tweet_data in original_data:
            tweet_data["is_retweet"] = False

        combined_data = retweeted_serializer.data + original_data
        sorted_combined_data = sorted(
            combined_data, key=lambda x: x["created_at"], reverse=True
        )

        return Response(sorted_combined_data)

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
        retweets = Retweets.objects.filter(tweet=tweet)
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
        following_user_ids = current_user.following.values_list(
            "following__id", flat=True
        )
        excluded_user_ids = list(following_user_ids) + [current_user.id]
        available_users = User.objects.exclude(id__in=excluded_user_ids)
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


class MuteUnmuteUserView(generics.CreateAPIView, generics.DestroyAPIView):
    """
    API view to mute or unmute a user.
    """

    queryset = MutedUser.objects.all()
    serializer_class = MutedUserSerializer
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = "user_id"

    def create(self, request, *args, **kwargs):
        user = request.user
        muted_user_id = self.kwargs.get(self.lookup_url_kwarg)

        if not muted_user_id:
            return Response(
                {"error": f"{self.lookup_url_kwarg} is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            muted_user = User.objects.get(id=muted_user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )

        if user == muted_user:
            return Response(
                {"error": "You cannot mute/unmute yourself"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if already muted
        if MutedUser.objects.filter(user=user, muted_user=muted_user).exists():
            return Response(
                {"error": "User already muted"}, status=status.HTTP_400_BAD_REQUEST
            )

        muted_user_obj = MutedUser.objects.create(user=user, muted_user=muted_user)
        serializer = self.get_serializer(muted_user_obj)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        user = request.user
        unmuted_user_id = self.kwargs.get(self.lookup_url_kwarg)

        if not unmuted_user_id:
            return Response(
                {"error": f"{self.lookup_url_kwarg} is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            unmuted_user = User.objects.get(id=unmuted_user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )

        try:
            muted_relation = MutedUser.objects.get(user=user, muted_user=unmuted_user)
        except MutedUser.DoesNotExist:
            return Response(
                {"error": "User is not muted"}, status=status.HTTP_400_BAD_REQUEST
            )

        muted_relation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ReportUserView(generics.CreateAPIView):
    """
    API view to report a user.
    """

    queryset = ReportedUser.objects.all()
    serializer_class = ReportedUserSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = request.user
        reported_user_id = self.kwargs.get("user_id")  # Get user_id from url
        reason = request.data.get("reason")

        if not reported_user_id:
            return Response(
                {"error": "reported_user_id is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not reason:
            return Response(
                {"error": "reason is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            reported_user = User.objects.get(id=reported_user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User to report not found"}, status=status.HTTP_404_NOT_FOUND
            )

        if user == reported_user:
            return Response(
                {"error": "You cannot report yourself"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if already reported
        if ReportedUser.objects.filter(user=user, reported_user=reported_user).exists():
            return Response(
                {"error": "User already reported"}, status=status.HTTP_400_BAD_REQUEST
            )

        reported_user_obj = ReportedUser.objects.create(
            user=user, reported_user=reported_user, reason=reason
        )
        serializer = self.get_serializer(reported_user_obj)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ListMutedUsersView(generics.ListAPIView):
    """
    API view to list muted users for the current user.
    """

    serializer_class = MutedUserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return MutedUser.objects.filter(user=user)


class ListReportedUsersView(generics.ListAPIView):
    """
    API view to list reported users for the current user.
    """

    serializer_class = ReportedUserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return ReportedUser.objects.filter(user=user)
