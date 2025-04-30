import os

# تعيين متغير البيئة أولاً
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# ثم استيراد Django ASGI
from django.core.asgi import get_asgi_application

# تهيئة تطبيق Django الأساسي
django_asgi_app = get_asgi_application()

# بعد تهيئة Django، يمكننا استيراد الوحدات التي تعتمد على نماذج Django
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import chat.routing

# تكوين تطبيق ASGI
application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(
        URLRouter(
            chat.routing.websocket_urlpatterns
        )
    ),
})