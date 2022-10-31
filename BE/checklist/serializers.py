from rest_framework import serializers
from checklist.models import Checklist
from accounts.models import User


class FromUserSerialize(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id',)


class  ChecklistSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Checklist
        fields= ('id', 'text', 'status', 'photo', 'created_at', 'to_users_id')


class ChecklistCreateSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(required=False)
    class Meta: 
        model = Checklist
        fields= ('text', 'photo', 'from_user_id', 'to_users_id')



class  ChecklistDetailSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Checklist
        fields= '__all__'


class  ChecklistStateChangeSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Checklist
        fields= ('status',)