from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
)
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.db import transaction
from django.db.models import Q
from django.core.paginator import Paginator
from .serializers import *
from .models import *

class LoginInAPIView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
  
    def post(self, request):
        username = request.data.get('username', '').lower()
        password = request.data.get('password', '')
        
        serializer = LogInSerializer(data = request.data)
        if not serializer.is_valid():
            return JsonResponse({'success': False, 'resp': serializer.errors}, status = 400)
        
        user = authenticate(request, username = username, password = password)
        if user is None:
            return JsonResponse({'success': False, 'resp': 'Incorrect user or password'}, status = 401)
        
        login(request, user)            
        
        serializer_token = TokenObtainPairSerializer(data={
            'username': username,
            'password': password
        })
        if not serializer_token.is_valid():
            return JsonResponse({'success': False, 'resp': serializer_token.errors}, status = 400)

        token = serializer_token.validated_data

        return JsonResponse({
            'success': True, 
            'resp': {
                'user': {
                    'username': user.username,      
                    'email': user.email,                    
                },
                'accessToken': str(token['access']),
                'refreshToken': str(token['refresh'])
            }
        })

class ManageLocationsAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
  
    def get(self, request):
        query = request.query_params.get('query', None)
        if query == 'table':
            search_query = request.query_params.get('search', '')
            page_number = request.query_params.get('page', 1)
            order_by = request.query_params.get('order_by', 'id')
            order = request.query_params.get('order', 'desc')
            show = request.query_params.get('show', 10)
            
            if order_by == 'actions':
                order_by = 'id'

            model = LocationsModel.objects.filter(
                Q(id__icontains = search_query) |
                Q(name__icontains = search_query) |
                Q(credits__icontains = search_query) |
                Q(days__icontains = search_query) |
                Q(price__icontains = search_query) |
                Q(group__name__icontains = search_query),
                status = True
            )

            if order == 'desc':
                order_by = f'-{order_by}'

            model = model.order_by(order_by)
            paginator = Paginator(model, show)
            model = paginator.page(page_number)

            serialized = LocationsSerializer(model, many = True)

            return JsonResponse({
                'success': True,
                'data': serialized.data,
                'total_pages': paginator.num_pages,
                'current_page': model.number
            })  
        elif query == 'list':
            results = LocationsModel.objects.filter(status = True)
            serialized = LocationsSerializer(results, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })

class ManageTypesOfIdsAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
  
    def get(self, request):
        query = request.query_params.get('query', None)
        if query == 'table':
            search_query = request.query_params.get('search', '')
            page_number = request.query_params.get('page', 1)
            order_by = request.query_params.get('order_by', 'id')
            order = request.query_params.get('order', 'desc')
            show = request.query_params.get('show', 10)
            
            if order_by == 'actions':
                order_by = 'id'

            model = TypesOfIdsModel.objects.filter(
                Q(id__icontains = search_query) |
                Q(name__icontains = search_query) |
                Q(credits__icontains = search_query) |
                Q(days__icontains = search_query) |
                Q(price__icontains = search_query) |
                Q(group__name__icontains = search_query),
                status = True
            )

            if order == 'desc':
                order_by = f'-{order_by}'

            model = model.order_by(order_by)
            paginator = Paginator(model, show)
            model = paginator.page(page_number)

            serialized = TypesOfIdsSerializer(model, many = True)

            return JsonResponse({
                'success': True,
                'data': serialized.data,
                'total_pages': paginator.num_pages,
                'current_page': model.number
            })  
        elif query == 'list':
            results = TypesOfIdsModel.objects.filter(status = True)
            serialized = TypesOfIdsSerializer(results, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })

class ManageClientsAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
  
    def post(self, request):
        with transaction.atomic():
            person_serializer = AddPersonSerializer(data = request.data)
            
            if not person_serializer.is_valid():
                transaction.set_rollback(True)
                return JsonResponse({
                    'success': False, 
                    'resp': person_serializer.errors
                }, status = 400)

            person_instance = person_serializer.save()
            request.data['person_id'] = person_instance.id

            client_serializer = AddClientSerializer(data = request.data)
            
            if not client_serializer.is_valid():
                transaction.set_rollback(True)
                return JsonResponse({
                    'success': False, 
                    'resp': client_serializer.errors
                }, status = 400)

            client_serializer.save()

            return JsonResponse({
                'success': True, 
                'resp': 'Added successfully.'
            })