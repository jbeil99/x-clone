from django.urls import path
from .views import ProfileView, FollowView , EditProfileView

urlpatterns = [
    path("", ProfileView.as_view(), name="profile"),  # Profile endpoint
    path("follow/", FollowView.as_view(), name="follow"), 
    # path("edit/", EditProfileView.as_view(), name="edit-profile"),  # Edit profile endpoint
 
]