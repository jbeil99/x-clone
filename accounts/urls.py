from django.urls import path, include, re_path
from .views import UserUpdateView, DeleteAccountView

urlpatterns = [
    re_path(r"^auth/", include("djoser.urls")),
    re_path(r"^auth/", include("djoser.urls.jwt")),
    path("api/profile/update", UserUpdateView.as_view(), name="user-profile-update"),
    path("auth/users/delete", DeleteAccountView.as_view(), name="delete-account"),
]
