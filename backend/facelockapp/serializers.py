from rest_framework import serializers
from .models import FaceUser

class FaceUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = FaceUser
        fields = '__all__'
