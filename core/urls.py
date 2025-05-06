from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from tweets.views import ExploreNewsView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("accounts.urls")),
    path("api/", include("tweets.urls")),
    path("api/chat/", include("chat.urls")),
    path("api/explore/", ExploreNewsView.as_view(), name="explore-news"),
    path("api/", include("profiles.urls")),
    path("grok/", include("grok.urls")),
    path("api/notifications/", include("notifications.urls")),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
