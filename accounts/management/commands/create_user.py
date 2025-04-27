from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.core.files import File
import os

User = get_user_model()


class Command(BaseCommand):
    help = "Create staff and superuser accounts with default values"

    def handle(self, *args, **options):
        # Default values
        default_staff = {
            "email": "staff@crowdfunding.com",
            "password": "Staff@123",
            "username": "staffuser",
            "first_name": "Staff",
            "last_name": "User",
            "mobile_phone": "01012345678",
        }

        default_super = {
            "email": "admin@crowdfunding.com",
            "password": "Admin@123",
            "username": "adminuser",
            "first_name": "Admin",
            "last_name": "User",
            "mobile_phone": "01012345679",
        }

        default_profile_pic = os.path.join(
            os.path.dirname(__file__), "../../../media/images/default_avatar.jpg"
        )

        # Create staff user
        try:
            staff_user = User.objects.create_user(
                **default_staff, is_staff=True, is_active=True
            )
            with open(default_profile_pic, "rb") as f:
                staff_user.profile_picture.save("profile.jpg", File(f))
            self.stdout.write(
                self.style.SUCCESS(
                    f"Successfully created staff user: {default_staff['email']}"
                )
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"Failed to create staff user: {str(e)}")
            )

        # Create superuser
        try:
            super_user = User.objects.create_superuser(**default_super, is_active=True)
            with open(default_profile_pic, "rb") as f:
                super_user.profile_picture.save("profile.jpg", File(f))
            self.stdout.write(
                self.style.SUCCESS(
                    f"Successfully created superuser: {default_super['email']}"
                )
            )
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Failed to create superuser: {str(e)}"))
