from rest_framework import serializers
from .models import Profile
from accounts.serializers import UserSerializer  # Import UserSerializer from accounts app

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Include user details in the profile


    class Meta:
        model = Profile
        fields = "__all__"