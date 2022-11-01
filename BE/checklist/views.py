from django.db.models import Q
from django.shortcuts import get_object_or_404
from datetime import datetime
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from .serializers import ChecklistSerializer, ChecklistDetailSerializer, ChecklistStateChangeSerializer, ChecklistCreateSerializer
from .models import Checklist
from accounts.models import User
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.parsers import MultiPartParser



class DdayAPIView(GenericAPIView):
    # TODO : 캘린더 app의 model 만든 후 개발
    def get(self, request):
        return Response("")


class ChecklistSearchAPIView(GenericAPIView):
    serializer_class = ChecklistSerializer
    def get(self, request, to_users_id):
        checklist = Checklist.objects.filter(to_users_id__exact=to_users_id).order_by('status', 'created_at')
        serializer = self.serializer_class(checklist, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK) 


class ChecklistTodayCreateAPIView(GenericAPIView):
    serializer_class = ChecklistSerializer
    def get(self, request, to_users_id):
        today = datetime.today()
        year, month, day = today.year, today.month, today.day
        checklist = Checklist.objects.filter(Q(to_users_id__exact=to_users_id) & Q(created_at__year=year, created_at__month=month, created_at__day=day))
        serializer = self.serializer_class(checklist, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK) 

class ChecklistCreateAPIView(GenericAPIView):
    parser_classes = (MultiPartParser,)
    @swagger_auto_schema(request_body=ChecklistCreateSerializer)
    def post(self, request):
        member = request.data.getlist('to_users_id')
        if request.data.get('photo') == None:
            context = {
                'text': request.data.get('text'),
                'to_users_id': member,
                'from_user_id': request.user.id,
            }
        else:
            context = {
                'text': request.data.get('text'),
                'photo': request.FILES['photo'],
                'to_users_id': member,
                'from_user_id': request.user.id,
            }
        
        if not request.user.family_id:
            return Response("당신은 가족에 가입되어 있지 않습니다", status=status.HTTP_403_FORBIDDEN)
        giver = request.user.family_id.id
        for id in member:
            man = User.objects.get(id=id)
            family_num = man.family_id.id
            if giver != family_num:
                context = {
                    f'{man}님은 해당 가족이 아닙니다.'
                }
                return Response(context, status=status.HTTP_400_BAD_REQUEST)
        serializer = ChecklistCreateSerializer(data=context)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)


class ChecklistDetailAPIView(GenericAPIView):
    get_serializer_class = ChecklistDetailSerializer
    def get(self, request, checklist_id):
        checklist = Checklist.objects.get(id=checklist_id)
        serializer = self.get_serializer_class(checklist)
        return Response(serializer.data, status=status.HTTP_200_OK) 

    @swagger_auto_schema(request_body=ChecklistStateChangeSerializer)
    def put(self, request, checklist_id):
        checklist = Checklist.objects.get(id=checklist_id)
        serializer = ChecklistStateChangeSerializer(checklist, data=request.data)
        if serializer.is_valid():
            if request.user in checklist.to_users_id.all():
                serializer.save()
                return Response("성공적으로 변경되었습니다.", status=status.HTTP_200_OK) 
        return Response("Todo가 부여된 사용자가 아닙니다.", status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, checklist_id):
        checklist = get_object_or_404(Checklist, id=checklist_id)
        if request.user.pk == checklist.from_user_id.id:
            checklist.delete()
            return Response("해당 Todo를 삭제하였습니다.", status=status.HTTP_200_OK)     
        return Response("Todo 부여자가 아닙니다.", status=status.HTTP_403_FORBIDDEN)


class ChecklistTodayFinish(GenericAPIView):
    serializer_class = ChecklistSerializer
    def get(self, request, to_users_id):
        today = datetime.today()
        year, month, day = today.year, today.month, today.day
        checklist = Checklist.objects.filter(Q(to_users_id__exact=to_users_id)  & Q(updated_at__year=year, updated_at__month=month, updated_at__day=day) & Q(status='True'))
        serializer = self.serializer_class(checklist, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        

class ChecklistUnFinish(GenericAPIView):
    serializer_class = ChecklistSerializer
    def get(self, request, to_users_id):
        checklist = Checklist.objects.filter(status='False')
        serializer = self.serializer_class(checklist, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ChecklistFinish(GenericAPIView):
    serializer_class = ChecklistSerializer
    def get(self, request, to_users_id):
        checklist = Checklist.objects.filter(status='True')
        serializer = self.serializer_class(checklist, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
 
