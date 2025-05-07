from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from accounts.models import User
from tweets.models import Tweet, Hashtag
from accounts.serializers import UserSerializer
from tweets.serializers import TweetSerializer, HashtagSerializer
from rest_framework.pagination import PageNumberPagination


class SearchView(APIView):
    pagination_class = PageNumberPagination

    def get(self, request):
        query = request.query_params.get("q", "")
        search_type = request.query_params.get("type", "tweets")

        if not query:
            return Response(
                {"error": "Please provide a search query."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if search_type == "users":
            user_results = User.objects.filter(
                Q(username__icontains=query) | Q(bio__icontains=query)
            )
            serializer = UserSerializer(user_results, many=True)
            return Response(serializer.data)

        elif search_type == "hashtags":
            hashtag_results = Hashtag.objects.filter(name__icontains=query)
            serializer = HashtagSerializer(hashtag_results, many=True)
            return Response(serializer.data)

        else:
            tweet_results = Tweet.objects.filter(
                Q(content__icontains=query) | Q(hashtags__name__icontains=query)
            ).order_by("-created_at")
            paginator = self.pagination_class()
            page = paginator.paginate_queryset(tweet_results, request)
            serializer = TweetSerializer(page, many=True, context={"request": request})
            return paginator.get_paginated_response(serializer.data)
