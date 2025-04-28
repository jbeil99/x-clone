from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import ProfileSerializer
from .models import Profile

class ProfileView(APIView):
    permission_classes = [AllowAny]  # Temporarily allow all requests

    def patch(self, request):
        print("Request Data:", request.data)
        print("Request Files:", request.FILES)
        profile, created = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
