from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
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
