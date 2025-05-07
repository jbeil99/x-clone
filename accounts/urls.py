from django.urls import path, include, re_path
from .views import UserUpdateView, DeleteAccountView
from django.conf import settings
from django.conf.urls.static import static
from .views import GoogleAuthView
from .views import (
    AdminUserListView,
    AdminUserDetailView,
    AdminUserBanView,
    AdminUserUnbanView,
    AdminUserVerifyView,
    AdminUserUnverifyView,
    AdminBannedUsersListView,
    AdminVerifiedUsersListView,
    AdminActionLogListView,
    AdminActionLogDetailView,
)

urlpatterns = [
    re_path(r"^auth/", include("djoser.urls")),
    re_path(r"^auth/", include("djoser.urls.jwt")),
    re_path(r"^auth/", include("djoser.social.urls")),
    path("api/profile/update", UserUpdateView.as_view(), name="user-profile-update"),
    path("auth/users/delete", DeleteAccountView.as_view(), name="delete-account"),
    path("auth/google/", GoogleAuthView.as_view(), name="google_auth"),
    path("admin/users/", AdminUserListView.as_view(), name="admin-user-list"),
    path(
        "admin/users/<int:pk>/", AdminUserDetailView.as_view(), name="admin-user-detail"
    ),
    path(
        "admin/users/<int:pk>/ban/", AdminUserBanView.as_view(), name="admin-user-ban"
    ),
    path(
        "admin/users/<int:pk>/unban/",
        AdminUserUnbanView.as_view(),
        name="admin-user-unban",
    ),
    path(
        "admin/users/<int:pk>/verify/",
        AdminUserVerifyView.as_view(),
        name="admin-user-verify",
    ),
    path(
        "admin/users/<int:pk>/unverify/",
        AdminUserUnverifyView.as_view(),
        name="admin-user-unverify",
    ),
    path(
        "admin/users/banned/",
        AdminBannedUsersListView.as_view(),
        name="admin-banned-users",
    ),
    path(
        "admin/users/verified/",
        AdminVerifiedUsersListView.as_view(),
        name="admin-verified-users",
    ),
    path("admin/logs/", AdminActionLogListView.as_view(), name="admin-log-list"),
    path(
        "admin/logs/<int:pk>/",
        AdminActionLogDetailView.as_view(),
        name="admin-log-detail",
    ),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
