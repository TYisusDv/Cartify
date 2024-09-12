from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer
)
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.db import transaction
from django.db.models import Q
from django.core.paginator import Paginator
from .serializers import *
from .models import *
import json

class LoginAPIView(APIView):
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
            return JsonResponse({'success': False, 'resp': 'Incorrect user or password'}, status = 400)
        
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

class AuthRefreshAPIView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
  
    def post(self, request):        
        serializer = TokenRefreshSerializer(data = request.data)
        if not serializer.is_valid():
            return JsonResponse({'success': False, 'resp': 'Invalid refresh token'}, status = 400)
        
        token = serializer.validated_data

        return JsonResponse({
            'success': True,
            'resp': {
                'accessToken': str(token['access']),
            }
        })

class ManageCountriesAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
  
    def get(self, request):
        query = request.query_params.get('query', None)
        if query == 'list':
            search_query = request.query_params.get('search', '')

            results = CountriesModel.objects.filter(
                Q(id__icontains = search_query)
            )
            serialized = CountriesSerializer(results, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })

class ManageStatesAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
  
    def get(self, request):
        query = request.query_params.get('query', None)
        if query == 'list':
            search_query = request.query_params.get('search', '')

            results = StatesModel.objects.filter(
                Q(name__icontains = search_query)
            )
            serialized = StatesSerializer(results, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })
    
class ManageCitiesAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
  
    def get(self, request):
        query = request.query_params.get('query', None)
        if query == 'list':
            search_query = request.query_params.get('search', '')

            results = CitiesModel.objects.filter(
                Q(name__icontains = search_query)
            )
            serialized = CitiesSerializer(results, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })

class ManageLocationsAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
  
    def get(self, request):
        query = request.query_params.get('query', None)
        if query == 'list':
            results = LocationsModel.objects.filter(status = True)
            serialized = LocationsSerializer(results, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })

class ManageTypesIdsAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
  
    def get(self, request):
        query = request.query_params.get('query', None)
        if query == 'list':
            results = TypesIdsModel.objects.filter(status = True)
            serialized = TypesIdsSerializer(results, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })

class ManageContactTypesAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
  
    def get(self, request):
        query = request.query_params.get('query', None)
        if query == 'list':
            results = ContactTypesModel.objects.filter()
            serialized = ContactTypesSerializer(results, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })
        
class ManageClientTypesAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
  
    def get(self, request):
        query = request.query_params.get('query', None)
        if query == 'list':
            results = ClientTypesModel.objects.filter()
            serialized = ClientTypesSerializer(results, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })

class ManageClientsAPIView(APIView):
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

            model = ClientsModel.objects.filter(
                Q(id__icontains = search_query)
            ).select_related('person').prefetch_related('person__addresses')

            if order == 'desc':
                order_by = f'-{order_by}'

            model = model.order_by(order_by)
            paginator = Paginator(model, show)
            model = paginator.page(page_number)

            serialized = ClientsSerializer(model, many = True)

            return JsonResponse({
                'success': True,
                'resp': serialized.data,
                'total_pages': paginator.num_pages,
                'current_page': model.number
            })

        elif query == 'get':
            client_id = request.query_params.get('id', None)
            client = ClientsModel.objects.prefetch_related('contacts').get(pk = client_id)
            serialized = ClientsSerializer(client)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            }) 
        
        elif query == 'count':
            total = ClientsModel.objects.count()            
            
            return JsonResponse({
                'success': True,
                'resp': {
                    'total': total
                }
            })      

        return JsonResponse({
            'success': True, 
            'resp': 'Page not found.'
        }, status = 404) 

    def post(self, request):
        with transaction.atomic():
            data = request.data.copy()
            contacts_json = request.POST.get('contacts', '[]')
            
            for key, value in data.items():
                if value == '':
                    data[key] = None
            
            try:
                contacts = json.loads(contacts_json)
            except json.JSONDecodeError:
                return JsonResponse({
                    'success': False,
                    'resp': 'Invalid JSON format for contacts.'
                }, status = 400)


            person_serializer = AddPersonSerializer(data = data)
            if not person_serializer.is_valid():
                transaction.set_rollback(True)
                return JsonResponse({
                    'success': False,
                    'resp': person_serializer.errors
                }, status = 400)

            person_instance = person_serializer.save()
            data['person_id'] = person_instance.id
            
            country_id = data.get('country_id', None)
            country_instance = CountriesModel.objects.get_or_create(id = country_id)[0]
            state = data.get('state', None)
            state_instance = StatesModel.objects.get_or_create(name = state.capitalize() if state else None, country = country_instance)[0]
            city = data.get('city', None)
            city_instance = CitiesModel.objects.get_or_create(name = city.capitalize() if city else None, state = state_instance)[0]

            data['city_id'] = city_instance.id

            addresses_serializer = AddAddressesSerializer(data = data)
            if not addresses_serializer.is_valid():
                transaction.set_rollback(True)
                return JsonResponse({
                    'success': False,
                    'resp': addresses_serializer.errors
                }, status = 400)

            addresses_serializer.save()

            client_serializer = AddClientSerializer(data = data)
            if not client_serializer.is_valid():
                transaction.set_rollback(True)
                return JsonResponse({
                    'success': False,
                    'resp': client_serializer.errors
                }, status = 400)

            client_instance = client_serializer.save()
            
            for contact in contacts:
                contact['client_id'] = client_instance.id

                clientcontact_serializer = AddClientContactSerializer(data = contact)
                if not clientcontact_serializer.is_valid():
                    transaction.set_rollback(True)
                    return JsonResponse({
                        'success': False,
                        'resp': clientcontact_serializer.errors,
                        'contact': contact
                    }, status = 400)

                clientcontact_serializer.save()

            return JsonResponse({
                'success': True,
                'resp': 'Added successfully.'
            })
    
    def delete(self, request):
        with transaction.atomic():
            try:
                client_serializer = DeleteClientSerializer(data = request.query_params)  
                if not client_serializer.is_valid():
                    transaction.set_rollback(True)
                    return JsonResponse({
                        'success': False, 
                        'resp': client_serializer.errors
                    }, status = 400)

                client_id = request.query_params.get('id', None) 

                client = ClientsModel.objects.get(id = client_id) 
                person = client.person 

                client.delete()
                person.delete()
                
                return JsonResponse({
                    'success': True,
                    'resp': 'Deleted successfully.'
                }, status = 200)
            except ClientsModel.DoesNotExist:
                transaction.set_rollback(True)
                return JsonResponse({
                    'success': False,
                    'resp': 'Client not found.'
                }, status = 404)