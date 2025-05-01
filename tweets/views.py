from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Tweet, Likes, Retweets, Hashtag, Mention, TweetShare, HashtagLog
from .serializers import (
    TweetSerializer,
    HashtagSerializer,
)
from .permissions import IsUserOrReadOnly
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404, get_list_or_404
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from datetime import timedelta


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
        else:
            Retweets.objects.create(user=request.user, tweet=tweet)
        serializer = TweetSerializer(tweet, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class HashtagView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, hashtag_name):
        try:
            hashtag = Hashtag.objects.get(name__iexact=hashtag_name)
            filter_type = request.query_params.get("filter", "top")
            if filter_type == "top":
                tweets = Tweet.get_top_tweets_by_hashtag(hashtag)
            elif filter_type == "latest":
                tweets = Tweet.get_latest_tweets_by_hashtag(hashtag)
            else:
                return Response(
                    {"detail": "Invalid filter type.  Use 'top' or 'latest'."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            paginator = PageNumberPagination()
            paginated_tweets = paginator.paginate_queryset(tweets, request)
            serializer = TweetSerializer(
                paginated_tweets, many=True, context={"request": request}
            )

            return paginator.get_paginated_response(serializer.data)
        except Hashtag.DoesNotExist:
            return Response(
                {"detail": "Hashtag not found."}, status=status.HTTP_404_NOT_FOUND
            )

    def post(self, request):
        serializer = HashtagSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TrendingHashtagsView(APIView):
    def get(self, request):
        time_window = timezone.now() - timedelta(hours=24)
        trending_hashtags = HashtagLog.get_trending_hashtags(time_window)
        return Response(trending_hashtags)


class MentionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        mentions = Mention.objects.filter(mentioned_user=request.user).select_related(
            "tweet"
        )
        data = [
            {
                "tweet_id": m.tweet.id,
                "content": m.tweet.content,
                "mentioned_at": m.created_at,
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
        tweet.bookmarks.add(user)
        serializer = TweetSerializer(tweet, context={"request": request})
        return Response(serializer.data)


class BookmarksList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tweets = Tweet.get_bookmarked_tweets(request.user)
        paginator = PageNumberPagination()
        paginated_tweets = paginator.paginate_queryset(tweets, request)
        serializer = TweetSerializer(
            paginated_tweets, many=True, context={"request": request}
        )
        return paginator.get_paginated_response(serializer.data)


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


class RandomPostsView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    def get(self, request):
        user = request.user
        following_users = user.followed.all()

        limit = request.query_params.get("limit", 10)
        try:
            limit = int(limit)
        except ValueError:
            limit = 10

        random_tweets = (
            Tweet.objects.exclude(user__in=following_users)
            .exclude(user=user)
            .order_by("?")[:limit]
        )

        serializer = TweetSerializer(
            random_tweets, many=True, context={"request": request}
        )
        return Response(serializer.data)


class ExploreNewsView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination
    
    def get(self, request):
        category = request.query_params.get('category', None)
        if category != 'news':
            return Response({"detail": "Invalid category."}, status=status.HTTP_400_BAD_REQUEST)
        
        news_keywords = ['#news', '#breaking', '#urgent', '#latestnews']
        
        from django.db.models import Q
        query = Q()
        for keyword in news_keywords:
            query |= Q(content__icontains=keyword)
        
        sort_by = request.query_params.get('sort', 'created_at')
        
        if sort_by == 'likes':
            from django.db.models import Count
            tweets = Tweet.objects.filter(query).annotate(
                likes_count=Count('likes')
            ).order_by('-likes_count')
        else:
            tweets = Tweet.objects.filter(query).order_by('-created_at')
        
        paginator = PageNumberPagination()
        paginated_tweets = paginator.paginate_queryset(tweets, request)
        serializer = TweetSerializer(paginated_tweets, many=True, context={"request": request})
        
        return paginator.get_paginated_response(serializer.data)
