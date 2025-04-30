from django.urls import path
from . import views
from .views import (
    Retweet,
    HashtagView,
    MentionsView,
    BookmarkTweetView,
    ShareTweetView,
    TweetViewCountView,
    TrendingHashtagsView,
    BookmarksList,
)

urlpatterns = [
    path("tweets", views.TweetList.as_view()),
    path("tweets/<int:pk>/", views.TweetDetail.as_view()),
    path("tweets/<int:pk>/likes", views.Like.as_view(), name="like-tweet"),
    path("tweets/<int:pk>/replies", views.TweetReplies.as_view(), name="like-tweet"),
    path("tweets/<int:pk>/retweet/", Retweet.as_view(), name="tweet-retweet"),
    path("hashtags/", HashtagView.as_view(), name="create-hashtag"),
    path("hashtags/<str:hashtag_name>/", HashtagView.as_view(), name="hashtag-detail"),
    path("trending_hashtags/", TrendingHashtagsView.as_view(), name="hashtag-trend"),
    path("mentions/", MentionsView.as_view(), name="mentions"),
    path(
        "tweets/<int:pk>/bookmark/", BookmarkTweetView.as_view(), name="bookmark-tweet"
    ),
    path("bookmarks/", BookmarksList.as_view(), name="bookmark"),
    path("tweets/<int:pk>/share/", ShareTweetView.as_view(), name="share-tweet"),
    path("tweets/<int:pk>/view/", TweetViewCountView.as_view(), name="view-tweet"),
]
