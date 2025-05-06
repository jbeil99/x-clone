from django.urls import path
from .views import ProfileView, FollowView, EditProfileView, ProfileTweetViewSet
from .views import (
    UserProfileByUsernameView,
    WhoToFollowView,
    UserFollowersView,
    UserFollowingView,
    UserMediaView,
    MuteUnmuteUserView,
    ReportUserView,
    ListMutedUsersView,
    ListReportedUsersView,
)

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
        "user/<str:username>/followers",
        UserFollowersView.as_view(),
        name="user-followers",
    ),
    path(
        "user/<str:username>/following",
        UserFollowingView.as_view(),
        name="user-following",
    ),
    path("user/<str:username>/media", UserMediaView.as_view(), name="user-following"),
    path(
        "profile/<str:username>/",
        UserProfileByUsernameView.as_view(),
        name="profile-by-username",
    ),
    path("who-to-follow/", WhoToFollowView.as_view(), name="who-to-follow"),
    path("mute/<int:user_id>/", MuteUnmuteUserView.as_view(), name="mute-user"),
    path("report/<int:user_id>/", ReportUserView.as_view(), name="report-user"),
    path("muted/", ListMutedUsersView.as_view(), name="list-muted-users"),
    path("reported/", ListReportedUsersView.as_view(), name="list-reported-users"),
]
