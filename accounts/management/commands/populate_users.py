from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import datetime
from django.core.files import File
import os

User = get_user_model()


class Command(BaseCommand):
    help = "Populates the database with initial users (admin and a bot)."

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING("Populating Users..."))

        # Function to get or create user and handle images
        def get_or_create_user(email, defaults, image_path=None):
            user, created = User.objects.get_or_create(
                email=email,
                defaults=defaults,
            )
            if created:
                user.set_password(
                    defaults.get("password", "defaultpassword")
                )  # Set a default password if not provided
                if image_path:
                    try:
                        # Ensure the file exists
                        if os.path.exists(image_path):
                            with open(image_path, "rb") as img_file:
                                user.avatar.save(
                                    os.path.basename(image_path),
                                    File(img_file),
                                    save=False,
                                )
                                user.save()  # Save the user *after* setting the image
                        else:
                            self.stdout.write(
                                self.style.WARNING(
                                    f"Image file not found: {image_path}"
                                )
                            )
                    except Exception as e:
                        self.stdout.write(
                            self.style.ERROR(f"Error setting avatar: {e}")
                        )
                user.save()
                self.stdout.write(
                    self.style.SUCCESS(f"{defaults.get('display_name')} user created.")
                )
            else:
                self.stdout.write(
                    self.style.WARNING(
                        f"{defaults.get('display_name')} user already exists."
                    )
                )
            return user

        # Create an admin user
        admin_user = get_or_create_user(
            email="admin@example.com",
            defaults={
                "username": "admin",
                "is_staff": True,
                "is_superuser": True,
                "is_active": True,
                "display_name": "Admin User",
                "mobile_phone": "01012345678",
                "date_of_birth": datetime(1990, 1, 1),
                "password": "adminpassword",  # added default password
            },
        )

        # Create a bot user
        bot_user = get_or_create_user(
            email="bot@example.com",
            defaults={
                "username": "frog",
                "is_active": True,
                "display_name": "frog",
                "mobile_phone": "01112345678",
                "date_of_birth": datetime(2020, 1, 1),
                "password": "botpassword",  # added default password
            },
            image_path="/media/default/frog.jpg",  #  path to the frog image
        )

        # Create a regular user
        regular_user = get_or_create_user(
            email="user@example.com",
            defaults={
                "username": "regularuser",
                "is_active": True,
                "display_name": "Regular User",
                "mobile_phone": "01212345678",
                "date_of_birth": datetime(1995, 5, 10),
                "password": "userpassword",  # added default password
            },
            image_path="/media/default/user.png",  # path to the regular user image
        )

        self.stdout.write(self.style.SUCCESS("User population complete."))
