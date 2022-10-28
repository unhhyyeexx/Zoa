from rest_framework.generics import ListCreateAPIView
from scrums.models import Scrum
from rest_framework import status
from scrums.serializers import ScrumSerializer
from rest_framework.response import Response
from datetime import datetime
from rest_framework import filters,permissions
from drf_yasg.utils import swagger_auto_schema
# Create your views here.

class ScrumAPIView(ListCreateAPIView) :
    serializer_class = ScrumSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['created_at']

    @swagger_auto_schema(operation_summary="가족 스크럼 조회")
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="가족 스크럼 작성")
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(Scrum.objects.filter(family=self.request.user.family_id))
        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        today = datetime.today().strftime("%Y-%m-%d")  
        if Scrum.objects.filter(created_at=today,user=self.request.user).exists() :
            return Response({"스크럼은 하루에 한 개만 작성 가능합니다."},status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user,family=self.request.user.family_id)

