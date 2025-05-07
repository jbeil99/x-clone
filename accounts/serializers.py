from rest_framework import serializers
from django.contrib.auth import get_user_model
from djoser.serializers import (
    UserCreateSerializer,
    UserSerializer as BaseUserSerializer,
)
from .models import AdminActionLog
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class UserRegistrationSerializer(UserCreateSerializer):
    mobile_phone = serializers.CharField(required=True)
    avatar = serializers.ImageField(
        required=False
    )  # Make avatar not required, handle default in model

    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = [
            "email",
            "username",
            "password",
            "display_name",
            "mobile_phone",
            "avatar",
        ]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(
            email=validated_data["email"],
            username=validated_data["username"],
            display_name=validated_data["display_name"],
            mobile_phone=validated_data["mobile_phone"],
        )
        user.set_password(password)  # Set the password
        user.save()

        avatar = validated_data.get("avatar")
        if avatar:
            user.avatar = avatar
            user.save(update_fields=["avatar"])
        return user


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
