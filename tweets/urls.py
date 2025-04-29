from django.urls import path
from . import views
from .views import Retweet,HashtagCreateView,MentionsView,BookmarkTweetView, ShareTweetView, TweetViewCountView

urlpatterns = [
    path("tweets", views.TweetList.as_view()),
    path("tweets/<int:pk>/", views.TweetDetail.as_view()),
    path("my/<str:username>/", views.get_user_tweets),
    path("tweets/<int:pk>/likes", views.Like.as_view(), name="like-tweet"),
    path("tweets/<int:pk>/replies", views.TweetReplies.as_view(), name="like-tweet"),
    # path("rt/<int:pk>/", views.rt),
    path("likes/<str:username>/", views.get_user_likes),
    path("rt/<str:username>/", views.get_user_rt),
    path("comments/<int:pk>/", views.CommentList.as_view()),
    path("comment/<int:pk>/", views.CommentDetail.as_view()),
    path("tweets/<int:pk>/retweet/", Retweet.as_view(), name="tweet-retweet"),
    path('hashtags/', HashtagCreateView.as_view(), name='create-hashtag'),
    path('api/mentions/', MentionsView.as_view(), name='mentions'),
    path("tweets/<int:pk>/bookmark/", BookmarkTweetView.as_view(), name="bookmark-tweet"),
    path("tweets/<int:pk>/share/", ShareTweetView.as_view(), name="share-tweet"),
    path("tweets/<int:pk>/view/", TweetViewCountView.as_view(), name="view-tweet"),


]
