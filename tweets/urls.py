from django.urls import path
from . import views

urlpatterns = [
    path("tweets", views.TweetList.as_view()),
    path("tweets/<int:pk>/", views.TweetDetail.as_view()),
    path("my/<str:username>/", views.get_user_tweets),
    path("tweets/<int:pk>/likes", views.Like.as_view(), name="like-tweet"),
    # path("rt/<int:pk>/", views.rt),
    path("likes/<str:username>/", views.get_user_likes),
    path("rt/<str:username>/", views.get_user_rt),
    path("comments/<int:pk>/", views.CommentList.as_view()),
    path("comment/<int:pk>/", views.CommentDetail.as_view()),
]
