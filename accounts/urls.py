from django.urls import path, include, re_path
from .views import UserUpdateView, DeleteAccountView
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import GoogleAuthView

urlpatterns = [
    re_path(r"^auth/", include("djoser.urls")),
    re_path(r"^auth/", include("djoser.urls.jwt")),
    re_path(r"^auth/", include("djoser.social.urls")),
    path("api/profile/update", UserUpdateView.as_view(), name="user-profile-update"),
    path("auth/users/delete", DeleteAccountView.as_view(), name="delete-account"),
    path("auth/google/", GoogleAuthView.as_view(), name="google_auth"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
