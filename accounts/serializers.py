from rest_framework import serializers
from django.contrib.auth import get_user_model
import re
from djoser.serializers import (
    UserCreateSerializer,
    UserSerializer as BaseUserSerializer,
)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


User = get_user_model()


class UserRegistrationSerializer(UserCreateSerializer):
    mobile_phone = serializers.CharField(required=True)
    profile_picture = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "email",
            "password",
            "confirm_password",
            "mobile_phone",
            "profile_picture",
        ]
        extra_kwargs = {
            "first_name": {"required": True},
            "last_name": {"required": True},
            "password": {"write_only": True},
        }

    def create(self, validated_data):
        profile_picture = validated_data.pop("profile_picture", None)
        user = super().create(validated_data)

        if profile_picture:
            user.profile_picture = profile_picture
            user.save()

        return user


class UserSerializer(BaseUserSerializer):
    profile_picture = serializers.SerializerMethodField()

    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = [
            "id",
            "email",
            "username",
            "first_name",
            "last_name",
            "mobile_phone",
            "profile_picture",
            "created_at",
        ]
        read_only_fields = ["id", "email"]

    def get_profile_picture(self, obj):
        request = self.context.get("request")
        if request:
            try:
                obj.profile_picture.url
            except ValueError:
                return None

            return request.build_absolute_uri(obj.profile_picture.url)
        return obj.profile_picture.url


class UserProfileSerializer(serializers.ModelSerializer):
    total_donations = serializers.SerializerMethodField()
    total_projects_donated = serializers.SerializerMethodField()

    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = [
            "id",
            "email",
            "username",
            "first_name",
            "last_name",
            "mobile_phone",
            "profile_picture",
            "date_of_birth",
            "facebook",
            "country",
            "created_at",
            "total_donations",
            "total_projects_donated",
            "is_staff",
        ]
        read_only_fields = ["id", "email", "created_at", "is_staff"]

    def get_profile_picture(self, obj):
        request = self.context.get("request")
        if request:
            try:
                obj.profile_picture.url
            except ValueError:
                return None
            return request.build_absolute_uri(obj.profile_picture.url)
        return obj.profile_picture.url

    def validate_username(self, value):
        if len(value) < 3:
            raise serializers.ValidationError(
                "Username must be at least 3 characters long."
            )
        return value

    def validate_first_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("First name is required.")
        return value

    def validate_last_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Last name is required.")
        return value

    def validate_mobile_phone(self, value):
        egyptian_pattern = r"^01[0125][0-9]{8}$"
        if not re.match(egyptian_pattern, value):
            raise serializers.ValidationError("Enter a valid Egyptian mobile number.")
        return value

    def validate_facebook(self, value):
        if value and not value.startswith("https://www.facebook.com/"):
            raise serializers.ValidationError(
                "Facebook URL must start with https://www.facebook.com/"
            )
        return value

    def validate_country(self, value):
        if value and not value.strip():
            raise serializers.ValidationError("Country must not be blank.")
        return value

    def get_total_donations(self, obj):
        return obj.get_total_donations()

    def get_total_projects_donated(self, obj):
        return obj.get_total_projects_donated()


class TokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        try:
            user = User.objects.get(email=attrs["email"])
            if not user.is_active:
                raise serializers.ValidationError(
                    {
                        "detail": "Account is not active. Please verify your email.",
                    }
                )

            try:
                data = super().validate(attrs)
                return data
            except Exception:
                raise serializers.ValidationError(
                    {"detail": "Invalid email or password"}
                )

        except User.DoesNotExist:
            raise serializers.ValidationError(
                {"detail": "No account found with this email"}
            )
