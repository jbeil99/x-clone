from django.urls import path
from .views import ProfileView, FollowView, EditProfileView, ProfileTweetViewSet
from .views import UserProfileByUsernameView, WhoToFollowView

tweet_list = ProfileTweetViewSet.as_view({"get": "list"})
likes_view = ProfileTweetViewSet.as_view({"get": "likes"})
retweets_view = ProfileTweetViewSet.as_view({"get": "retweets"})
replies_view = ProfileTweetViewSet.as_view({"get": "replies"})


urlpatterns = [
    path("profile", ProfileView.as_view(), name="profile"),
    path("user/<str:username>/follow/", FollowView.as_view(), name="follow"),
    path("profile/edit/", EditProfileView.as_view(), name="edit-profile"),
    path("user/<int:user_id>/tweets", tweet_list, name="user-tweets"),
    path("user/<int:user_id>/likes", likes_view, name="user-likes"),
    path("user/<int:user_id>/retweets", retweets_view, name="user-retweets"),
    path("user/<int:user_id>/replies", replies_view, name="user-replies"),
    path(
        "profile/<str:username>/",
        UserProfileByUsernameView.as_view(),
        name="profile-by-username",
    ),
    path("who-to-follow/", WhoToFollowView.as_view(), name="who-to-follow"),
]
