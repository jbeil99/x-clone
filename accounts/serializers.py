from rest_framework import serializers
from django.contrib.auth import get_user_model
import re
from djoser.serializers import (
    UserCreateSerializer,
    UserSerializer as BaseUserSerializer,
)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import AdminActionLog

User = get_user_model()


class UserRegistrationSerializer(UserCreateSerializer):
    mobile_phone = serializers.CharField(required=True)
    avatar = serializers.ImageField(required=False)

    class Meta:
        # TODO: Add date of birth
        model = User
        fields = [
            "display_nameemail",
            "password",
            "confirm_password",
            "mobile_phone",
            "avatar",
        ]

    def create(self, validated_data):
        avatar = validated_data.pop("avatar", None)
        user = super().create(validated_data)

        if avatar:
            user.avatar = avatar
            user.save()

        return user


class UserSerializer(BaseUserSerializer):
    avatar = serializers.SerializerMethodField()

    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = [
            "id",
            "email",
            "display_name",
            "username",
            "mobile_phone",
            "avatar",
            "created_at",
        ]
        read_only_fields = ["id", "email"]

    def get_avatar(self, obj):
        request = self.context.get("request")
        if request:
            try:
                obj.avatar.url
            except ValueError:
                return None

            return request.build_absolute_uri(obj.avatar.url)
        return obj.avatar.url


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = [
            "id",
            "email",
            "username",
            "display_name",
            "mobile_phone",
            "avatar",
            "date_of_birth",
            "country",
            "created_at",
        ]
        read_only_fields = ["id", "email", "created_at"]

    def get_avatar(self, obj):
        request = self.context.get("request")
        if request:
            try:
                obj.avatar.url
            except ValueError:
                return None
            return request.build_absolute_uri(obj.avatar.url)
        return obj.avatar.url

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

    def validate_country(self, value):
        if value and not value.strip():
            raise serializers.ValidationError("Country must not be blank.")
        return value


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


class AdminUserBanSerializer(serializers.Serializer):
    """Serializer for banning a user."""

    ban_reason = serializers.CharField(required=False, allow_blank=True)


class AdminUserVerifySerializer(serializers.Serializer):
    """Serializer for verifying a user."""

    pass  # No additional fields needed


class AdminActionLogSerializer(serializers.ModelSerializer):
    """Serializer for admin action logs."""

    admin_username = serializers.SerializerMethodField()
    target_username = serializers.SerializerMethodField()

    class Meta:
        model = AdminActionLog
        fields = [
            "id",
            "admin",
            "admin_username",
            "action_type",
            "target_user",
            "target_username",
            "notes",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "admin",
            "admin_username",
            "created_at",
            "target_username",
        ]

    def get_admin_username(self, obj):
        return obj.admin.username if obj.admin else None

    def get_target_username(self, obj):
        return obj.target_user.username if obj.target_user else None
