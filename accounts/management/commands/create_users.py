from django.utils import timezone
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.conf import settings
import os
import datetime

User = get_user_model()


def create_users():
    if not User.objects.filter(username="admin").exists():
        superuser = User.objects.create_user(
            username="admin",
            email="admin@example.com",
            mobile_phone="01012345678",
            display_name="Administrator",
            date_of_birth=datetime.date(1990, 1, 1),
            is_active=True,
        )
        superuser.set_password("admin123")
        superuser.is_staff = True
        superuser.is_superuser = True
        superuser.save()
        print("Superuser created successfully")
    else:
        print("Superuser already exists")

    if not User.objects.filter(username="frog").exists():
        bot_user = User.objects.create_user(
            username="frog",
            email="frog@example.com",
            mobile_phone="01087654321",
            display_name="Frog",
            date_of_birth=datetime.date(2000, 1, 1),
            bio="Ribbit! I am a friendly bot.",
            is_active=True,
            avatar="default/frog.jpg",
            is_staff=True,
        )
        bot_user.set_password("frog123")
        bot_user.save()
        print('Bot user "frog" created successfully')
    else:
        print('Bot user "frog" already exists')


if __name__ == "__main__":
    import django

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "your_project.settings")
    django.setup()
    create_users()


class Command(BaseCommand):
    help = "Creates a superuser and a bot user"

    def handle(self, *args, **options):
        create_users()
        self.stdout.write(self.style.SUCCESS("Users created successfully!"))
