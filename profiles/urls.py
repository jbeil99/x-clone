from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfileView, FollowView, EditProfileView, ProfileTweetViewSet
from .views import UserProfileByUsernameView

tweet_list = ProfileTweetViewSet.as_view({'get': 'list'})
likes_view = ProfileTweetViewSet.as_view({'get': 'likes'})
retweets_view = ProfileTweetViewSet.as_view({'get': 'retweets'})
replies_view = ProfileTweetViewSet.as_view({'get': 'replies'})


urlpatterns = [
    path("", ProfileView.as_view(), name="profile"),
    path("follow/", FollowView.as_view(), name="follow"),
    path("edit/", EditProfileView.as_view(), name="edit-profile"),
    path("tweets/<int:user_id>/", tweet_list, name="user-tweets"),
    path("tweets/likes/<int:user_id>/", likes_view, name="user-likes"),
    path("tweets/retweets/<int:user_id>/", retweets_view, name="user-retweets"),
    path("tweets/replies/<int:user_id>/", replies_view, name="user-replies"),
    path('user-profile/<str:username>/', UserProfileByUsernameView.as_view(), name='profile-by-username'),
      
    ]