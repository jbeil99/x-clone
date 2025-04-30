from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Tweet,  Likes, Retweets, Hashtag, Mention,TweetShare
from .serializers import (
    TweetSerializer,
    MyTweetSerializer,
    HashtagSerializer,
)
from .permissions import IsUserOrReadOnly
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404, get_list_or_404
from rest_framework.parsers import MultiPartParser, FormParser


class Like(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        print(pk)
        tweet = get_object_or_404(Tweet, pk=pk)
        if tweet.is_user_liked(request.user):
            tweet.likes.filter(user=request.user).delete()

        else:
            Likes.objects.create(user=request.user, tweet=tweet)
            # if request.user != tweet.user:
            #     Noti.objects.get_or_create(
            #         type="like you tweet",
            #         tweet=tweet,
            #         to_user=tweet.user,
            #         from_user=request.user,
            #     )
        serializer = TweetSerializer(tweet, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class TweetReplies(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    def get(self, request, pk):
        tweets = get_list_or_404(Tweet, parent=pk)
        paginator = PageNumberPagination()
        paginated_tweets = paginator.paginate_queryset(tweets, request)
        serializer = TweetSerializer(
            paginated_tweets, many=True, context={"request": request}
        )

        return paginator.get_paginated_response(serializer.data)


class TweetList(generics.ListCreateAPIView):
    parser_classes = [MultiPartParser, FormParser]

    queryset = Tweet.get_tweets()
    serializer_class = TweetSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

 
class TweetDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tweet.objects.all()
    serializer_class = TweetSerializer
    permission_classes = [IsAuthenticated, IsUserOrReadOnly]


class Retweet(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        tweet = get_object_or_404(Tweet, pk=pk)
        if Retweets.objects.filter(user=request.user, tweet=tweet).exists():
            retweet = Retweets.objects.get(user=request.user, tweet=tweet)
            retweet.delete()
            return Response({"status": "retweet removed"}, status=status.HTTP_200_OK)
        else:
            Retweets.objects.create(user=request.user, tweet=tweet)
            return Response({"status": "retweeted"}, status=status.HTTP_201_CREATED)


    
class HashtagCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = HashtagSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MentionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        mentions = Mention.objects.filter(mentioned_user=request.user).select_related('tweet')
        data = [
            {
                'tweet_id': m.tweet.id,
                'content': m.tweet.content,
                'mentioned_at': m.created_at
            }
            for m in mentions
        ]
        return Response(data)
    

class BookmarkTweetView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        tweet = get_object_or_404(Tweet, pk=pk)
        user = request.user
        if tweet.bookmarks.filter(id=user.id).exists():
            tweet.bookmarks.remove(user)
            return Response({"message": "Tweet removed from bookmarks"})
        tweet.bookmarks.add(user)
        return Response({"message": "Tweet bookmarked successfully"})


class ShareTweetView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        tweet = get_object_or_404(Tweet, pk=pk)
        user = request.user

        if TweetShare.objects.filter(tweet=tweet, user=user).exists():
            return Response({"message": "You have already shared this tweet"})

        TweetShare.objects.create(tweet=tweet, user=user)
        return Response({"message": "Tweet shared successfully"})


class TweetViewCountView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        tweet = get_object_or_404(Tweet, pk=pk)
        user = request.user
        if tweet.views.filter(id=user.id).exists():
            return Response({"message": "Tweet already viewed"})
        tweet.views.add(user)
        return Response({"message": "Tweet view recorded"})