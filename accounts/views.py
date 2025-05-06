from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .serializers import UserProfileSerializer
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password
from rest_framework.exceptions import AuthenticationFailed
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from core.utils.helpers import download_image, make_username
from .models import AdminActionLog
from .serializers import (
    UserSerializer,
    AdminUserBanSerializer,
    AdminUserVerifySerializer,
    AdminActionLogSerializer,
)
from profiles.serializers import ProfileSerializer
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404

User = get_user_model()


class UserUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = UserProfileSerializer(
            request.user, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        old_profile_picture = request.user.profile_picture
        serializer = UserProfileSerializer(request.user, data=request.data)
        if serializer.is_valid():
            if not request.data.get("profile_picture"):
                serializer.validated_data["profile_picture"] = old_profile_picture

            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        password = request.data.get("current_password")

        if not password:
            return Response(
                {"error": "Current password is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not check_password(password, user.password):
            return Response(
                {"error": "Incorrect password."}, status=status.HTTP_400_BAD_REQUEST
            )

        user.delete()

        return Response(
            {"message": "Your account has been deleted successfully."},
            status=status.HTTP_200_OK,
        )


User = get_user_model()


class GoogleAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("token")
        if not token:
            return Response(
                {"error": "Token not provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            idinfo = id_token.verify_token(
                token, requests.Request(), settings.GOOGLE_CLIENT_ID
            )
            user_id = idinfo.get("sub")
            email = idinfo.get("email")
            name = idinfo.get("name")
            email_verified = idinfo.get("email_verified")
            picture = idinfo.get("picture")
            username = make_username(idinfo.get("given_name"), user_id)

        except ValueError as e:
            print(e)
            raise AuthenticationFailed("Invalid token")

        except Exception:
            return Response(
                {"error": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            user = None

        if user:
            if not user.is_active:
                return Response(
                    {"error": "User is inactive"}, status=status.HTTP_403_FORBIDDEN
                )
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            return Response(
                {
                    "access": access_token,
                    "refresh": str(refresh),
                },
                status=status.HTTP_200_OK,
            )
        else:
            avatar_content = download_image(picture, f"{username}_avatar.jpg")

            user = User(
                email=email,
                display_name=name,
                google_id=user_id,
                is_active=email_verified,
                username=username,
            )
            if avatar_content:
                user.avatar.save(avatar_content.name, avatar_content, save=False)

            user.save()
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            return Response(
                {
                    "access": access_token,
                    "refresh": str(refresh),
                },
                status=status.HTTP_201_CREATED,
            )


class UserPagination(PageNumberPagination):
    page_size = 10  # You can adjust the page size
    page_size_query_param = "page_size"
    max_page_size = 100


class AdminUserListView(APIView, UserPagination):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        users = User.objects.filter(banned=False, is_staff=False).exclude(
            id=request.user.id
        )
        page = self.paginate_queryset(users, request)
        if page is not None:
            serializer = ProfileSerializer(
                page, many=True, context={"request": request}
            )
            return self.get_paginated_response(serializer.data)
        serializer = ProfileSerializer(users, many=True, context={"request": request})
        return Response(serializer.data)


class AdminUserDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_object(self, pk):
        return get_object_or_404(User, pk=pk)

    def get(self, request, pk):
        user = self.get_object(pk)
        serializer = ProfileSerializer(user, context={"request": request})
        return Response(serializer.data)

    def put(self, request, pk):
        user = self.get_object(pk)
        serializer = UserSerializer(
            user, data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        user = self.get_object(pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminUserBanView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_object(self, pk):
        return get_object_or_404(User, pk=pk)

    def post(self, request, pk):
        user = self.get_object(pk)
        serializer = AdminUserBanSerializer(data=request.data)

        if serializer.is_valid():
            ban_reason = serializer.validated_data.get("ban_reason", "")

            if user.banned:
                return Response(
                    {"detail": f"User '{user.username}' is already banned."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user.ban(reason=ban_reason)

            AdminActionLog.objects.create(
                admin=request.user,
                action_type="ban",
                target_user=user,
                notes=f"User banned. Reason: {ban_reason}",
            )

            return Response(
                {"detail": f"User '{user.username}' has been banned."},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminUserUnbanView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_object(self, pk):
        return get_object_or_404(User, pk=pk)

    def post(self, request, pk):
        user = self.get_object(pk)

        if not user.banned:
            return Response(
                {"detail": f"User '{user.username}' is not currently banned."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.unban()

        AdminActionLog.objects.create(
            admin=request.user,
            action_type="unban",
            target_user=user,
            notes="User unbanned.",
        )

        return Response(
            {"detail": f"User '{user.username}' has been unbanned."},
            status=status.HTTP_200_OK,
        )


class AdminUserVerifyView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_object(self, pk):
        return get_object_or_404(User, pk=pk)

    def post(self, request, pk):
        user = self.get_object(pk)
        serializer = AdminUserVerifySerializer(data=request.data)

        if serializer.is_valid():
            if user.verified:
                return Response(
                    {"detail": f"User '{user.username}' is already verified."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user.verify()

            AdminActionLog.objects.create(
                admin=request.user,
                action_type="verify",
                target_user=user,
                notes="User verified.",
            )

            return Response(
                {"detail": f"User '{user.username}' has been verified."},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminUserUnverifyView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_object(self, pk):
        return get_object_or_404(User, pk=pk)

    def post(self, request, pk):
        user = self.get_object(pk)

        if not user.verified:
            return Response(
                {"detail": f"User '{user.username}' is not currently verified."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.unverify()

        AdminActionLog.objects.create(
            admin=request.user,
            action_type="unverify",
            target_user=user,
            notes="User verification removed.",
        )

        return Response(
            {"detail": f"Verification removed from user '{user.username}'."},
            status=status.HTTP_200_OK,
        )


class AdminBannedUsersListView(APIView, UserPagination):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        banned_users = User.objects.filter(banned=True)
        page = self.paginate_queryset(banned_users, request)
        if page is not None:
            serializer = ProfileSerializer(
                page, many=True, context={"request": request}
            )
            return self.get_paginated_response(serializer.data)
        serializer = ProfileSerializer(
            banned_users, many=True, context={"request": request}
        )
        return Response(serializer.data)


class AdminVerifiedUsersListView(APIView, UserPagination):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        verified_users = User.objects.filter(verified=True)
        page = self.paginate_queryset(verified_users, request)
        if page is not None:
            serializer = ProfileSerializer(
                page, many=True, context={"request": request}
            )
            return self.get_paginated_response(serializer.data)
        serializer = ProfileSerializer(
            verified_users, many=True, context={"request": request}
        )
        return Response(serializer.data)


class AdminActionLogListView(APIView, PageNumberPagination):
    serializer_class = AdminActionLogSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    page_size = 10  # You can adjust the page size
    page_size_query_param = "page_size"
    max_page_size = 100

    def get_queryset(self):
        queryset = AdminActionLog.objects.all()

        admin_id = self.request.query_params.get("admin_id")
        if admin_id:
            queryset = queryset.filter(admin_id=admin_id)

        target_id = self.request.query_params.get("target_id")
        if target_id:
            queryset = queryset.filter(target_user_id=target_id)

        action_type = self.request.query_params.get("action_type")
        if action_type:
            queryset = queryset.filter(action_type=action_type)

        start_date = self.request.query_params.get("start_date")
        end_date = self.request.query_params.get("end_date")

        if start_date:
            queryset = queryset.filter(created_at__gte=start_date)

        if end_date:
            queryset = queryset.filter(created_at__lte=end_date)

        return queryset

    def get(self, request):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset, request)
        if page is not None:
            serializer = self.serializer_class(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class AdminActionLogDetailView(APIView):
    serializer_class = AdminActionLogSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_object(self, pk):
        return get_object_or_404(AdminActionLog, pk=pk)

    def get(self, request, pk):
        log_entry = self.get_object(pk)
        serializer = self.serializer_class(log_entry)
        return Response(serializer.data)
