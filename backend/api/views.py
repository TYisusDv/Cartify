from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer
)
from django.http import Http404, JsonResponse, HttpResponse
from django.template.loader import render_to_string
from django.contrib.auth import authenticate, login
from django.db import transaction
from django.db.models import Q, F, Max, Sum, ExpressionWrapper, FloatField
from django.core.paginator import Paginator
from .serializers import *
from .models import *
from .utils import *
from datetime import timedelta, datetime
from dateutil.relativedelta import relativedelta
from collections import defaultdict
from django.conf import settings
import uuid, qrcode, io, openpyxl, fitz, pdfkit

#Login
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

#Auth refresh
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

#Users
class ManageUsersAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
  
    def get(self, request):
        query = request.query_params.get('query', None)
        search = request.query_params.get('search', '')
        
        if query == 'list':
            model = User.objects.filter(
                Q(id__icontains = search) |
                Q(username__icontains = search) |
                Q(first_name__icontains = search) | 
                Q(last_name__icontains = search)
            )[:10]
            serialized = UserExcludeSerializer(model, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })

#Countries
class ManageCountriesAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
  
    def get(self, request):
        query = request.query_params.get('query', None)
        search = request.query_params.get('search', '')
        
        if query == 'list':
            model = CountriesModel.objects.filter(
                Q(id__icontains = search) |
                Q(name__icontains = search)
            )[:10]
            serialized = CountriesSerializer(model, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })

#States
class ManageStatesAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
  
    def get(self, request):
        data = request.query_params
        query = data.get('query', None)
        search = data.get('search', '')
        country_id = data.get('country_id', 0)
        
        if query == 'list':
            model = StatesModel.objects.filter(
                Q(id__icontains = search) |
                Q(name__icontains = search)
            )

            model = model.filter(country_id = country_id)

            serialized = StatesSerializer(model, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })

#Cities
class ManageCitiesAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
  
    def get(self, request):
        data = request.query_params
        query = data.get('query', None)
        search = data.get('search', '')
        state_id = data.get('state_id', 0)
        
        if query == 'list':
            model = CitiesModel.objects.filter(
                Q(id__icontains = search) |
                Q(name__icontains = search)
            )

            model = model.filter(state_id = state_id)

            serialized = CitiesSerializer(model, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })

#Locations
class ManageLocationsAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk) :
        try:
            return LocationsModel.objects.get(pk = pk)
        except LocationsModel.DoesNotExist:
            raise Http404('Location not found.')

    def get(self, request):       
        data = request.query_params
        query = data.get('query', None)
        search = data.get('search', '')
        page_number = request.query_params.get('page', 1)
        order_by = request.query_params.get('order_by', 'id').replace('.', '__')
        order = request.query_params.get('order', 'desc')
        show = request.query_params.get('show', 10)

        if query == 'table':
            search_terms = search.split()
            query_terms = Q()
            for term in search_terms:
                query_terms &= (
                    Q(id__icontains = term)
                )

            model = LocationsModel.objects.filter(query_terms)

            if order == 'desc':
                order_by = f'-{order_by}'

            model = model.order_by(order_by)
            paginator = Paginator(model, show)
            model = paginator.page(page_number)

            serialized = LocationsSerializer(model, many = True)

            return JsonResponse({
                'success': True,
                'resp': serialized.data,
                'total_pages': paginator.num_pages,
                'current_page': model.number
            })

        elif query == 'get':
            data_id = data.get('id', None)

            serializer = GetLocationSerializer(data = data)  
            if not serializer.is_valid():
                return JsonResponse({
                    'success': False, 
                    'resp': serializer.errors
                }, status = 400)    
                    
            instance = self.get_object(pk = data_id)
            serialized = LocationsSerializer(instance)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            }) 
        
        elif query == 'list':
            model = LocationsModel.objects.filter(
                Q(id__icontains = search) |
                Q(name__icontains = search)
            )[:10]
            serialized = LocationsSerializer(model, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })

        elif query == 'count':
            total = LocationsModel.objects.count()            
            
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
        data = request.data
    
        serializer = AddEditLocationSerializer(data = data)
        if not serializer.is_valid():
            return JsonResponse({'success': False, 'resp': serializer.errors}, status = 400)

        serializer.save()

        return JsonResponse({'success': True, 'resp': 'Added successfully.'})

    def put(self, request):
        data = request.data

        data_id = data.get('id', None)

        serializer = GetLocationSerializer(data = data)  
        if not serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': serializer.errors
            }, status = 400)    
                
        instance = self.get_object(pk = data_id)     

        serializer = AddEditLocationSerializer(instance, data = data)
        if not serializer.is_valid():
            return JsonResponse({'success': False, 'resp': serializer.errors}, status = 400)

        serializer.save()

        return JsonResponse({'success': True, 'resp': 'Edited successfully.'})
    
    def delete(self, request):
        data = request.query_params

        data_id = data.get('id', None)

        serializer = GetLocationSerializer(data = data)  
        if not serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': serializer.errors
            }, status = 400)    
                
        instance = self.get_object(pk = data_id)           
        instance.delete()
        
        return JsonResponse({
            'success': True,
            'resp': 'Deleted successfully.'
        }, status = 200)

#Types ids
class ManageTypesIdsAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk) :
        try:
            return TypesIdsModel.objects.get(pk = pk)
        except TypesIdsModel.DoesNotExist:
            raise Http404('Type id not found.')

    def get(self, request):
        query = request.query_params.get('query', None)
        search = request.query_params.get('search', '')
        
        data = request.query_params
        query = data.get('query', None)
        search = data.get('search', '')
        page_number = request.query_params.get('page', 1)
        order_by = request.query_params.get('order_by', 'id').replace('.', '__')
        order = request.query_params.get('order', 'desc')
        show = request.query_params.get('show', 10)

        if query == 'table':
            search_terms = search.split()
            query_terms = Q()
            for term in search_terms:
                query_terms &= (
                    Q(id__icontains = term)
                )

            model = TypesIdsModel.objects.filter(query_terms)

            if order == 'desc':
                order_by = f'-{order_by}'

            model = model.order_by(order_by)
            paginator = Paginator(model, show)
            model = paginator.page(page_number)

            serialized = TypesIdsSerializer(model, many = True)

            return JsonResponse({
                'success': True,
                'resp': serialized.data,
                'total_pages': paginator.num_pages,
                'current_page': model.number
            })

        elif query == 'get':
            data_id = data.get('id', None)

            serializer = GetTypeIdSerializer(data = data)  
            if not serializer.is_valid():
                return JsonResponse({
                    'success': False, 
                    'resp': serializer.errors
                }, status = 400)    
                    
            instance = self.get_object(pk = data_id)
            serialized = TypesIdsSerializer(instance)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            }) 
        
        elif query == 'list':
            model = TypesIdsModel.objects.filter(
                Q(id__icontains = search) |
                Q(name__icontains = search)
            )[:10]
            serialized = TypesIdsSerializer(model, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })
        
        elif query == 'count':
            total = TypesIdsModel.objects.count()            
            
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
        data = request.data
    
        serializer = AddEditTypeIdSerializer(data = data)
        if not serializer.is_valid():
            return JsonResponse({'success': False, 'resp': serializer.errors}, status = 400)

        serializer.save()

        return JsonResponse({'success': True, 'resp': 'Added successfully.'})

    def put(self, request):
        data = request.data

        data_id = data.get('id', None)

        serializer = GetTypeIdSerializer(data = data)  
        if not serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': serializer.errors
            }, status = 400)    
                
        instance = self.get_object(pk = data_id)     

        serializer = AddEditTypeIdSerializer(instance, data = data)
        if not serializer.is_valid():
            return JsonResponse({'success': False, 'resp': serializer.errors}, status = 400)

        serializer.save()

        return JsonResponse({'success': True, 'resp': 'Edited successfully.'})
    
    def delete(self, request):
        data = request.query_params

        data_id = data.get('id', None)

        serializer = GetTypeIdSerializer(data = data)  
        if not serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': serializer.errors
            }, status = 400)    
                
        instance = self.get_object(pk = data_id)           
        instance.delete()
        
        return JsonResponse({
            'success': True,
            'resp': 'Deleted successfully.'
        }, status = 200)

#Client types    
class ManageClientTypesAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk) :
        try:
            return ClientTypesModel.objects.get(pk = pk)
        except ClientTypesModel.DoesNotExist:
            raise Http404('Client type not found.')

    def get(self, request):
        data = request.query_params
        query = data.get('query', None)
        search = data.get('search', '')
        page_number = request.query_params.get('page', 1)
        order_by = request.query_params.get('order_by', 'id').replace('.', '__')
        order = request.query_params.get('order', 'desc')
        show = request.query_params.get('show', 10)

        if query == 'table':
            search_terms = search.split()
            query_terms = Q()
            for term in search_terms:
                query_terms &= (
                    Q(id__icontains = term)
                )

            model = ClientTypesModel.objects.filter(query_terms)

            if order == 'desc':
                order_by = f'-{order_by}'

            model = model.order_by(order_by)
            paginator = Paginator(model, show)
            model = paginator.page(page_number)

            serialized = ClientTypesSerializer(model, many = True)

            return JsonResponse({
                'success': True,
                'resp': serialized.data,
                'total_pages': paginator.num_pages,
                'current_page': model.number
            })

        elif query == 'get':
            data_id = data.get('id', None)

            serializer = GetClientTypeSerializer(data = data)  
            if not serializer.is_valid():
                return JsonResponse({
                    'success': False, 
                    'resp': serializer.errors
                }, status = 400)    
                    
            instance = self.get_object(pk = data_id)
            serialized = ClientTypesSerializer(instance)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            }) 
        
        elif query == 'list':
            model = ClientTypesModel.objects.filter(
                Q(id__icontains = search) |
                Q(name__icontains = search)
            )[:10]
            serialized = ClientTypesSerializer(model, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })
        elif query == 'count':
            total = ClientTypesModel.objects.count()            
            
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
        data = request.data
    
        serializer = AddEditClientTypeSerializer(data = data)
        if not serializer.is_valid():
            return JsonResponse({'success': False, 'resp': serializer.errors}, status = 400)

        serializer.save()

        return JsonResponse({'success': True, 'resp': 'Added successfully.'})

    def put(self, request):
        data = request.data

        data_id = data.get('id', None)

        serializer = GetClientTypeSerializer(data = data)  
        if not serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': serializer.errors
            }, status = 400)    
                
        instance = self.get_object(pk = data_id)     

        serializer = AddEditClientTypeSerializer(instance, data = data)
        if not serializer.is_valid():
            return JsonResponse({'success': False, 'resp': serializer.errors}, status = 400)

        serializer.save()

        return JsonResponse({'success': True, 'resp': 'Edited successfully.'})
    
    def delete(self, request):
        data = request.query_params

        data_id = data.get('id', None)

        serializer = GetClientTypeSerializer(data = data)  
        if not serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': serializer.errors
            }, status = 400)    
                
        instance = self.get_object(pk = data_id)           
        instance.delete()
        
        return JsonResponse({
            'success': True,
            'resp': 'Deleted successfully.'
        }, status = 200)

#Clients
class ManageClientsAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk) :
        try:
            return ClientsModel.objects.get(pk = pk)
        except ClientsModel.DoesNotExist:
            raise Http404('Client not found.')

    def get(self, request):
        data = request.query_params
        query = data.get('query', None)
        search = data.get('search', '')
        page_number = request.query_params.get('page', 1)
        order_by = request.query_params.get('order_by', 'id').replace('.', '__')
        order = request.query_params.get('order', 'desc')
        show = request.query_params.get('show', 10)

        if query == 'table':   
            search_terms = search.split()
            query_terms = Q()
            for term in search_terms:
                query_terms &= (
                    Q(id__icontains = term) |
                    Q(person__firstname__icontains = term) |
                    Q(person__middlename__icontains = term) |
                    Q(person__lastname__icontains = term) |
                    Q(person__second_lastname__icontains = term)
                )

            model = ClientsModel.objects.filter(query_terms)

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

        elif query == 'list':
            search_terms = search.split()
            query_terms = Q()
            for term in search_terms:
                query_terms &= (
                    Q(id__icontains = term) |
                    Q(person__firstname__icontains = term) |
                    Q(person__middlename__icontains = term) |
                    Q(person__lastname__icontains = term) |
                    Q(person__second_lastname__icontains = term)
                )

            model = ClientsModel.objects.filter(query_terms)[:10]
            serialized = ClientsSerializer(model, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })
        
        
        elif query == 'get':
            data_id = data.get('id', None)

            client_serializer = GetClientSerializer(data = data)  
            if not client_serializer.is_valid():
                return JsonResponse({
                    'success': False, 
                    'resp': client_serializer.errors
                }, status = 400)    
                    
            client_instance = self.get_object(pk = data_id)
            client_serialized = ClientsSerializer(client_instance)
            
            return JsonResponse({
                'success': True,
                'resp': client_serialized.data
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
            data = request.data
            person = data.get('person', {})
            addresses = person.get('addresses', [])

            person_serializer = AddEditPersonSerializer(data = person)
            if not person_serializer.is_valid():
                transaction.set_rollback(True)
                return JsonResponse({'success': False, 'resp': person_serializer.errors}, status = 400)

            person_instance = person_serializer.save()

            if not addresses:
                transaction.set_rollback(True)
                return JsonResponse({'success': False, 'resp': 'Address not found'}, status = 400)
            
            address = addresses[0]
            address['person_id'] = str(person_instance.id)
            
            address_serializer = AddEditAddressesSerializer(data = address)
            if not address_serializer.is_valid():
                transaction.set_rollback(True)
                return JsonResponse({'success': False, 'resp': address_serializer.errors}, status = 400)

            address_serializer.save()

            data['person_id'] = person_instance.id

            client_serializer = AddEditClientSerializer(data = data)
            if not client_serializer.is_valid():
                transaction.set_rollback(True)
                return JsonResponse({'success': False, 'resp': client_serializer.errors}, status = 400)

            client_serializer.save()

            return JsonResponse({'success': True, 'resp': 'Added successfully.'})

    def put(self, request):
        with transaction.atomic():
            data = request.data
            data_id = data.get('id', None)
            person = data.get('person', {})
            addresses = person.get('addresses', [])

            client_serializer = GetClientSerializer(data = data)  
            if not client_serializer.is_valid():
                transaction.set_rollback(True)
                return JsonResponse({
                    'success': False, 
                    'resp': client_serializer.errors
                }, status = 400)    
                    
            client_instance = self.get_object(pk = data_id)  
            person_instance = client_instance.person   

            person_serializer = AddEditPersonSerializer(person_instance, data = person)
            if not person_serializer.is_valid():
                transaction.set_rollback(True)
                return JsonResponse({'success': False, 'resp': person_serializer.errors}, status = 400)

            person_serializer.save()

            data['person_id'] = person_instance.id

            person_instance = person_serializer.save()

            if not addresses:
                transaction.set_rollback(True)
                return JsonResponse({'success': False, 'resp': 'Address not found'}, status = 400)
            
            address_instance = person_instance.addresses.all().first()

            address = addresses[0]
            address['person_id'] = str(person_instance.id)

            address_serializer = AddEditAddressesSerializer(address_instance, data = address)
            if not address_serializer.is_valid():
                transaction.set_rollback(True)
                return JsonResponse({'success': False, 'resp': address_serializer.errors}, status = 400)

            address_serializer.save()

            client_serializer = AddEditClientSerializer(client_instance, data = data)
            if not client_serializer.is_valid():
                transaction.set_rollback(True)
                return JsonResponse({'success': False, 'resp': client_serializer.errors}, status = 400)

            client_serializer.save()

            return JsonResponse({'success': True, 'resp': 'Edited successfully.'})
    
    def delete(self, request):
        data = request.query_params

        data_id = data.get('id', None)

        client_serializer = GetClientSerializer(data = data)  
        if not client_serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': client_serializer.errors,
            }, status = 400)    
                
        client_instance = self.get_object(pk = data_id)           
        client_instance.person.delete()
        
        return JsonResponse({
            'success': True,
            'resp': 'Deleted successfully.'
        }, status = 200)

#Product contact types
class ManageContactTypesAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
  
    def get(self, request):
        query = request.query_params.get('query', None)
        search = request.query_params.get('search', '')
        
        if query == 'list':
            model = ContactTypesModel.objects.filter(
                Q(id__icontains = search) |
                Q(name__icontains = search)
            )[:10]
            serialized = ContactTypesSerializer(model, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })

#Suppliers
class ManageSuppliersAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk) :
        try:
            return SuppliersModel.objects.get(pk = pk)
        except SuppliersModel.DoesNotExist:
            raise Http404('Supplier not found.')

    def get(self, request):
        data = request.query_params
        query = data.get('query', None)
        search = request.query_params.get('search', '')
        page_number = request.query_params.get('page', 1)
        order_by = request.query_params.get('order_by', 'id').replace('.', '__')
        order = request.query_params.get('order', 'desc')
        show = request.query_params.get('show', 10)

        if query == 'table':         
            search_terms = search.split()
            query_terms = Q()
            for term in search_terms:
                query_terms &= (
                    Q(id__icontains = term)
                )

            model = SuppliersModel.objects.filter(query_terms)

            if order == 'desc':
                order_by = f'-{order_by}'

            model = model.order_by(order_by)
            paginator = Paginator(model, show)
            model = paginator.page(page_number)

            serialized = SuppliersSerializer(model, many = True)

            return JsonResponse({
                'success': True,
                'resp': serialized.data,
                'total_pages': paginator.num_pages,
                'current_page': model.number
            })

        elif query == 'get':
            supplier_id = data.get('id', None)

            supplier_serializer = GetSupplierSerializer(data = data)  
            if not supplier_serializer.is_valid():
                return JsonResponse({
                    'success': False, 
                    'resp': supplier_serializer.errors
                }, status = 400)    
                    
            supplier_instance = self.get_object(pk = supplier_id)
            supplier_serialized = SuppliersSerializer(supplier_instance)
            
            return JsonResponse({
                'success': True,
                'resp': supplier_serialized.data
            }) 
        
        elif query == 'list':
            model = SuppliersModel.objects.filter(
                Q(id__icontains = search) |
                Q(company_name__icontains = search)
            )[:10]
            serialized = SuppliersSerializer(model, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })
        
        elif query == 'count':
            total = SuppliersModel.objects.count()            
            
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
        data = request.data

        supplier_serializer = AddEditSupplierSerializer(data = data)
        if not supplier_serializer.is_valid():
            return JsonResponse({'success': False, 'resp': supplier_serializer.errors}, status = 400)

        supplier_serializer.save()

        return JsonResponse({'success': True, 'resp': 'Added successfully.'})

    def put(self, request):
        data = request.data

        supplier_id = data.get('id', None)

        supplier_serializer = GetSupplierSerializer(data = data)  
        if not supplier_serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': supplier_serializer.errors
            }, status = 400)    
                
        supplier_instance = self.get_object(pk = supplier_id)     

        supplier_serializer = AddEditSupplierSerializer(supplier_instance, data = data)
        if not supplier_serializer.is_valid():
            return JsonResponse({'success': False, 'resp': supplier_serializer.errors}, status = 400)

        supplier_serializer.save()

        return JsonResponse({'success': True, 'resp': 'Edited successfully.'})
    
    def delete(self, request):
        data = request.query_params

        supplier_id = data.get('id', None)

        supplier_serializer = GetSupplierSerializer(data = data)  
        if not supplier_serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': supplier_serializer.errors
            }, status = 400)    
                
        supplier_instance = self.get_object(pk = supplier_id)           
        supplier_instance.delete()
        
        return JsonResponse({
            'success': True,
            'resp': 'Deleted successfully.'
        }, status = 200)

#Taxes
class ManageTaxesAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk) :
        try:
            return TaxesModel.objects.get(pk = pk)
        except TaxesModel.DoesNotExist:
            raise Http404('Tax not found.')

    def get(self, request):
        data = request.query_params
        query = data.get('query', None)
        search = data.get('search', '')
        page_number = request.query_params.get('page', 1)
        order_by = request.query_params.get('order_by', 'id').replace('.', '__')
        order = request.query_params.get('order', 'desc')
        show = request.query_params.get('show', 10)

        if query == 'table':
            search_terms = search.split()
            query_terms = Q()
            for term in search_terms:
                query_terms &= (
                    Q(id__icontains = term)
                )

            model = TaxesModel.objects.filter(query_terms)

            if order == 'desc':
                order_by = f'-{order_by}'

            model = model.order_by(order_by)
            paginator = Paginator(model, show)
            model = paginator.page(page_number)

            serialized = TaxesSerializer(model, many = True)

            return JsonResponse({
                'success': True,
                'resp': serialized.data,
                'total_pages': paginator.num_pages,
                'current_page': model.number
            })

        elif query == 'get':
            tax_id = data.get('id', None)

            tax_serializer = GetTaxSerializer(data = data)  
            if not tax_serializer.is_valid():
                return JsonResponse({
                    'success': False, 
                    'resp': tax_serializer.errors
                }, status = 400)    
                    
            tax_instance = self.get_object(pk = tax_id)
            tax_serialized = TaxesSerializer(tax_instance)
            
            return JsonResponse({
                'success': True,
                'resp': tax_serialized.data
            }) 
        
        elif query == 'list':
            model = TaxesModel.objects.filter(
                Q(id__icontains = search) |
                Q(name__icontains = search)
            )[:10]
            serialized = TaxesSerializer(model, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })
        
        elif query == 'count':
            total = TaxesModel.objects.count()            
            
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
        data = request.data
    
        tax_serializer = AddEditTaxSerializer(data = data)
        if not tax_serializer.is_valid():
            return JsonResponse({'success': False, 'resp': tax_serializer.errors}, status = 400)

        tax_serializer.save()

        return JsonResponse({'success': True, 'resp': 'Added successfully.'})

    def put(self, request):
        data = request.data

        tax_id = data.get('id', None)

        tax_serializer = GetTaxSerializer(data = data)  
        if not tax_serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': tax_serializer.errors
            }, status = 400)    
                
        tax_instance = self.get_object(pk = tax_id)     

        tax_serializer = AddEditTaxSerializer(tax_instance, data = data)
        if not tax_serializer.is_valid():
            return JsonResponse({'success': False, 'resp': tax_serializer.errors}, status = 400)

        tax_serializer.save()

        return JsonResponse({'success': True, 'resp': 'Edited successfully.'})
    
    def delete(self, request):
        data = request.query_params

        tax_id = data.get('id', None)

        tax_serializer = GetTaxSerializer(data = data)  
        if not tax_serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': tax_serializer.errors
            }, status = 400)    
                
        tax_instance = self.get_object(pk = tax_id)           
        tax_instance.delete()
        
        return JsonResponse({
            'success': True,
            'resp': 'Deleted successfully.'
        }, status = 200)

#Product brands
class ManageProductBrandsAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk) :
        try:
            return ProductBrandsModel.objects.get(pk = pk)
        except ProductBrandsModel.DoesNotExist:
            raise Http404('Product brand not found.')

    def get(self, request):
        data = request.query_params 
        query = data.get('query', None)
        search = data.get('search', '')
        page_number = request.query_params.get('page', 1)
        order_by = request.query_params.get('order_by', 'id').replace('.', '__')
        order = request.query_params.get('order', 'desc')
        show = request.query_params.get('show', 10)

        if query == 'table':
            search_terms = search.split()
            query_terms = Q()
            for term in search_terms:
                query_terms &= (
                    Q(id__icontains = term) |
                    Q(name__icontains = term)
                )

            model = ProductBrandsModel.objects.filter(query_terms)

            if order == 'desc':
                order_by = f'-{order_by}'

            model = model.order_by(order_by)
            paginator = Paginator(model, show)
            model = paginator.page(page_number)

            serialized = ProductBrandsSerializer(model, many = True)

            return JsonResponse({
                'success': True,
                'resp': serialized.data,
                'total_pages': paginator.num_pages,
                'current_page': model.number
            })

        elif query == 'get':
            product_brand_id = data.get('id', None)

            product_brand_serializer = GetProductBrandSerializer(data = data)  
            if not product_brand_serializer.is_valid():
                return JsonResponse({
                    'success': False, 
                    'resp': product_brand_serializer.errors
                }, status = 400)    
                    
            product_brand_instance = self.get_object(pk = product_brand_id)
            product_brand_serialized = ProductBrandsSerializer(product_brand_instance)
            
            return JsonResponse({
                'success': True,
                'resp': product_brand_serialized.data
            }) 
        
        elif query == 'list':
            model = ProductBrandsModel.objects.filter(
                Q(id__icontains = search) |
                Q(name__icontains = search)
            )[:10]
            serialized = ProductBrandsSerializer(model, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })
        
        elif query == 'count':
            total = ProductBrandsModel.objects.count()            
            
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
        data = request.data

        product_brand_serializer = AddEditProductBrandSerializer(data = data)
        if not product_brand_serializer.is_valid():
            return JsonResponse({'success': False, 'resp': product_brand_serializer.errors}, status = 400)

        product_brand_serializer.save()

        return JsonResponse({'success': True, 'resp': 'Added successfully.'})

    def put(self, request):
        data = request.data

        product_brand_id = data.get('id', None)

        product_brand_serializer = GetProductBrandSerializer(data = data)  
        if not product_brand_serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': product_brand_serializer.errors
            }, status = 400)    
                
        product_brand_instance = self.get_object(pk = product_brand_id)     

        product_brand_serializer = AddEditProductBrandSerializer(product_brand_instance, data = data)
        if not product_brand_serializer.is_valid():
            return JsonResponse({'success': False, 'resp': product_brand_serializer.errors}, status = 400)

        product_brand_serializer.save()

        return JsonResponse({'success': True, 'resp': 'Edited successfully.'})
    
    def delete(self, request):
        data = request.query_params

        product_brand_id = data.get('id', None)

        product_brand_serializer = GetProductBrandSerializer(data = data)  
        if not product_brand_serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': product_brand_serializer.errors
            }, status = 400)    
                
        product_brand_instance = self.get_object(pk = product_brand_id)           
        product_brand_instance.delete()
        
        return JsonResponse({
            'success': True,
            'resp': 'Deleted successfully.'
        }, status = 200)

#Product categories
class ManageProductCategoriesAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk) :
        try:
            return ProductCategoriesModel.objects.get(pk = pk)
        except ProductCategoriesModel.DoesNotExist:
            raise Http404('Product category not found.')

    def get(self, request):
        data = request.query_params
        query = data.get('query', None)
        search = data.get('search', '')
        page_number = request.query_params.get('page', 1)
        order_by = request.query_params.get('order_by', 'id').replace('.', '__')
        order = request.query_params.get('order', 'desc')
        show = request.query_params.get('show', 10)

        if query == 'table':           
            search_terms = search.split()
            query_terms = Q()
            for term in search_terms:
                query_terms &= (
                    Q(id__icontains = term) |
                    Q(name__icontains = term)
                )

            model = ProductCategoriesModel.objects.filter(query_terms)

            if order == 'desc':
                order_by = f'-{order_by}'

            model = model.order_by(order_by)
            paginator = Paginator(model, show)
            model = paginator.page(page_number)

            serialized = ProductCategoriesSerializer(model, many = True)

            return JsonResponse({
                'success': True,
                'resp': serialized.data,
                'total_pages': paginator.num_pages,
                'current_page': model.number
            })

        elif query == 'get':
            product_category_id = data.get('id', None)

            product_category_serializer = GetProductCategorySerializer(data = data)  
            if not product_category_serializer.is_valid():
                return JsonResponse({
                    'success': False, 
                    'resp': product_category_serializer.errors
                }, status = 400)    
                    
            product_category_instance = self.get_object(pk = product_category_id)
            product_category_serialized = ProductCategoriesSerializer(product_category_instance)
            
            return JsonResponse({
                'success': True,
                'resp': product_category_serialized.data
            }) 
        
        elif query == 'list':
            model = ProductCategoriesModel.objects.filter(
                Q(id__icontains = search) |
                Q(name__icontains = search)
            )[:10]
            serialized = ProductCategoriesSerializer(model, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })
        
        elif query == 'count':
            total = ProductCategoriesModel.objects.count()            
            
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
        data = request.data

        product_category_serializer = AddEditProductCategorySerializer(data = data)
        if not product_category_serializer.is_valid():
            return JsonResponse({'success': False, 'resp': product_category_serializer.errors}, status = 400)

        product_category_serializer.save()

        return JsonResponse({'success': True, 'resp': 'Added successfully.'})

    def put(self, request):
        data = request.data

        product_category_id = data.get('id', None)

        product_category_serializer = GetProductCategorySerializer(data = data)  
        if not product_category_serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': product_category_serializer.errors
            }, status = 400)    
                
        product_category_instance = self.get_object(pk = product_category_id)     

        product_category_serializer = AddEditProductCategorySerializer(product_category_instance, data = data)
        if not product_category_serializer.is_valid():
            return JsonResponse({'success': False, 'resp': product_category_serializer.errors}, status = 400)

        product_category_serializer.save()

        return JsonResponse({'success': True, 'resp': 'Edited successfully.'})
    
    def delete(self, request):
        data = request.query_params

        product_category_id = data.get('id', None)

        product_category_serializer = GetProductCategorySerializer(data = data)  
        if not product_category_serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': product_category_serializer.errors
            }, status = 400)    
                
        product_category_instance = self.get_object(pk = product_category_id)           
        product_category_instance.delete()
        
        return JsonResponse({
            'success': True,
            'resp': 'Deleted successfully.'
        }, status = 200)

#Products
class ManageProductsAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk) :
        try:
            return ProductsModel.objects.get(pk = pk)
        except ProductsModel.DoesNotExist:
            raise Http404('Product not found.')

    def get(self, request):
        data = request.query_params
        query = data.get('query', None)
        search = data.get('search', '')
        page_number = request.query_params.get('page', 1)
        order_by = request.query_params.get('order_by', 'id').replace('.', '__')
        order = request.query_params.get('order', 'desc')
        show = request.query_params.get('show', 10)

        brand_id = request.query_params.get('brand[id]', None)
        category_id = request.query_params.get('category[id]', None)
        filter_type = request.query_params.get('filters[type]', None)
        
        if query == 'table':
            search_terms = search.split()
            query_terms = Q()
            for term in search_terms:
                query_terms &= (
                    Q(id__icontains = term) |
                    Q(name__icontains = term) | 
                    Q(model__icontains = term)
                )

            model = ProductsModel.objects.filter(query_terms)
            
            if filter_type == 'pos':
                model = model.filter(status = True)

            if brand_id not in [None,  0, '0']:
                model = model.filter(brand_id = brand_id)

            if category_id not in [None,  0, '0']:
                model = model.filter(category_id = category_id)

            if order == 'desc':
                order_by = f'-{order_by}'

            model = model.order_by(order_by)
            paginator = Paginator(model, show)
            model = paginator.page(page_number)

            serialized = ProductsSerializer(model, many = True)

            return JsonResponse({
                'success': True,
                'resp': serialized.data,
                'total_pages': paginator.num_pages,
                'current_page': model.number
            })

        elif query == 'get':
            product_id = data.get('id', None)

            product_serializer = GetProductSerializer(data = data)  
            if not product_serializer.is_valid():
                return JsonResponse({
                    'success': False, 
                    'resp': product_serializer.errors
                }, status = 400)    
                    
            product_instance = self.get_object(pk = product_id)
            product_serialized = ProductsSerializer(product_instance)
            
            return JsonResponse({
                'success': True,
                'resp': product_serialized.data
            }) 
        
        elif query == 'list':
            model = ProductsModel.objects.filter(
                Q(id__icontains = search) |
                Q(barcode__icontains = search) | 
                Q(name__icontains = search)
            )[:10]
            serialized = ProductsSerializer(model, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })
        
        elif query == 'count':
            total = ProductsModel.objects.count()
            visible = ProductsModel.objects.filter(status = 1).count()
            hidden = ProductsModel.objects.filter(status = 0).count()  
            
            return JsonResponse({
                'success': True,
                'resp': {
                    'total': total,
                    'visible': visible,
                    'hidden': hidden
                }
            })      

        return JsonResponse({
            'success': True, 
            'resp': 'Page not found.'
        }, status = 404) 

    def post(self, request):
        data = request.data

        product_serializer = AddEditProductSerializer(data = data)
        if not product_serializer.is_valid():
            return JsonResponse({'success': False, 'resp': product_serializer.errors}, status = 400)

        product_serializer.save()

        return JsonResponse({'success': True, 'resp': 'Added successfully.'})

    def put(self, request):
        data = request.data

        product_id = data.get('id', None)

        product_serializer = GetProductSerializer(data = data)  
        if not product_serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': product_serializer.errors
            }, status = 400)    
                
        product_instance = self.get_object(pk = product_id)     

        product_serializer = AddEditProductSerializer(product_instance, data = data)
        if not product_serializer.is_valid():
            return JsonResponse({'success': False, 'resp': product_serializer.errors}, status = 400)

        product_serializer.save()

        return JsonResponse({'success': True, 'resp': 'Edited successfully.'})
    
    def delete(self, request):
        data = request.query_params

        product_id = data.get('id', None)

        product_serializer = GetProductSerializer(data = data)  
        if not product_serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': product_serializer.errors,
            }, status = 400)    
                
        product_instance = self.get_object(pk = product_id)           
        product_instance.delete()
        
        return JsonResponse({
            'success': True,
            'resp': 'Deleted successfully.'
        }, status = 200)
    
#Inventory types
class ManageInventoryTypesAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    @classmethod
    def get_object(self, pk) :
        try:
            return InventoryTypesModel.objects.get(pk = pk)
        except InventoryTypesModel.DoesNotExist:
            raise Http404('Inventory type not found.')

    def get(self, request):
        data = request.query_params
        query = data.get('query', None)
        search = data.get('search', '')
        page_number = request.query_params.get('page', 1)
        order_by = request.query_params.get('order_by', 'id').replace('.', '__')
        order = request.query_params.get('order', 'desc')
        show = request.query_params.get('show', 10)

        if query == 'table':      
            search_terms = search.split()
            query_terms = Q()
            for term in search_terms:
                query_terms &= (
                    Q(id__icontains = term)
                )

            model = InventoryTypesModel.objects.filter(query_terms)

            if order == 'desc':
                order_by = f'-{order_by}'

            model = model.order_by(order_by)
            paginator = Paginator(model, show)
            model = paginator.page(page_number)

            serialized = InventoryTypesSerializer(model, many = True)

            return JsonResponse({
                'success': True,
                'resp': serialized.data,
                'total_pages': paginator.num_pages,
                'current_page': model.number
            })

        elif query == 'get':
            inventory_type_id = data.get('id', None)

            inventory_type_serializer = GetInventoryTypeSerializer(data = data)  
            if not inventory_type_serializer.is_valid():
                return JsonResponse({
                    'success': False, 
                    'resp': inventory_type_serializer.errors
                }, status = 400)    
                    
            inventory_type_instance = self.get_object(pk = inventory_type_id)
            inventory_type_serialized = InventoryTypesSerializer(inventory_type_instance)
            
            return JsonResponse({
                'success': True,
                'resp': inventory_type_serialized.data
            }) 
        
        elif query == 'list_all':
            model = InventoryTypesModel.objects.filter(
                Q(id__icontains = search) |
                Q(name__icontains = search)                
            )[:10]
            serialized = InventoryTypesSerializer(model, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })

        elif query == 'list':
            model = InventoryTypesModel.objects.filter(
                Q(id__icontains = search) |
                Q(name__icontains = search),
                type__in = [1, 2]
            )[:10]
            serialized = InventoryTypesSerializer(model, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })

        elif query == 'list_transfer':
            model = InventoryTypesModel.objects.filter(
                Q(id__icontains = search) |
                Q(name__icontains = search),
                type = 3
            )[:10]
            serialized = InventoryTypesSerializer(model, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })
        
        elif query == 'count':
            total = InventoryTypesModel.objects.count()            
            
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
        data = request.data

        inventory_type_serializer = AddEditInventoryTypeSerializer(data = data)
        if not inventory_type_serializer.is_valid():
            return JsonResponse({'success': False, 'resp': inventory_type_serializer.errors}, status = 400)

        inventory_type_serializer.save()

        return JsonResponse({'success': True, 'resp': 'Added successfully.'})

    def put(self, request):
        data = request.data

        inventory_type_id = data.get('id', None)

        inventory_type_serializer = GetInventoryTypeSerializer(data = data)  
        if not inventory_type_serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': inventory_type_serializer.errors
            }, status = 400)    
                
        inventory_type_instance = self.get_object(pk = inventory_type_id)     

        inventory_type_serializer = AddEditInventoryTypeSerializer(inventory_type_instance, data = data)
        if not inventory_type_serializer.is_valid():
            return JsonResponse({'success': False, 'resp': inventory_type_serializer.errors}, status = 400)

        inventory_type_serializer.save()

        return JsonResponse({'success': True, 'resp': 'Edited successfully.'})
    
    def delete(self, request):
        data = request.query_params

        inventory_type_id = data.get('id', None)

        inventory_type_serializer = GetInventoryTypeSerializer(data = data)  
        if not inventory_type_serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': inventory_type_serializer.errors
            }, status = 400)    
                
        inventory_type_instance = self.get_object(pk = inventory_type_id)           
        inventory_type_instance.delete()
        
        return JsonResponse({
            'success': True,
            'resp': 'Deleted successfully.'
        }, status = 200)
    
#Inventory
class AppInventoryAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    @classmethod
    def get_object(self, pk) :
        try:
            return InventoryModel.objects.get(pk = pk)
        except InventoryModel.DoesNotExist:
            raise Http404('Inventory not found.')
        
    @classmethod
    def get_product_entries(cls, product_id, location_id):
        try:
            total_entries = InventoryModel.objects.filter(product_id = product_id, location_id = location_id, type_inventory = 1).aggregate(total_quantity = Sum('quantity'))['total_quantity'] or 0            
            total_exits = InventoryModel.objects.filter(product_id = product_id, location_id = location_id, type_inventory = 2).aggregate(total_quantity = Sum('quantity'))['total_quantity'] or 0
            
            total_inventory = total_entries - total_exits
            return total_inventory
        except InventoryModel.DoesNotExist:
            raise Http404('Inventory not found.')

    def get(self, request):
        data = request.query_params
        query = data.get('query', None)
        search = data.get('search', '')
        page_number = request.query_params.get('page', 1)
        order_by = request.query_params.get('order_by', 'id').replace('.', '__')
        order = request.query_params.get('order', 'desc')
        show = request.query_params.get('show', 10)

        type_id = request.query_params.get('type[id]', None)
        product_id = request.query_params.get('product[id]', None)
        location_id = request.query_params.get('location[id]', None)
        date_1_str = data.get('filters[date_1]', None)
        date_2_str = data.get('filters[date_2]', None)        

        if not product_id:
            product_id = request.query_params.get('filters[product][id]', None)
            
        date_1, date_2 = None, None
        if date_1_str:
            date_1 = datetime.strptime(date_1_str, '%Y-%m-%d').date()

        if date_2_str:
            date_2 = datetime.strptime(date_2_str, '%Y-%m-%d').date()

        if query == 'table':  
            search_terms = search.split()
            query_terms = Q()
            for term in search_terms:
                query_terms &= (
                    Q(id__icontains = term)
                )
                
            model = InventoryModel.objects.filter(
                query_terms,
                type__type__in = [1, 2]
            )

            if date_1:
                model = model.filter(date_reg__gte = date_1)
            
            if date_2:
                model = model.filter(date_reg__lte = date_2)
            
            if product_id not in [None,  0, '0']:
                model = model.filter(product_id = product_id)
            
            if type_id not in [None,  0, '0']:
                model = model.filter(type_id = type_id)
            
            if location_id not in [None,  0, '0']:
                model = model.filter(location_id = location_id)

            if order == 'desc':
                order_by = f'-{order_by}'

            model = model.order_by(order_by)
            paginator = Paginator(model, show)
            model = paginator.page(page_number)

            serialized = InventorySerializer(model, many = True)

            return JsonResponse({
                'success': True,
                'resp': serialized.data,
                'total_pages': paginator.num_pages,
                'current_page': model.number
            })

        if query == 'table_transfer':   
            type_id = request.query_params.get('type[id]', None)
            product_id = request.query_params.get('product[id]', None)
            location_id = request.query_params.get('location[id]', None)

            search_terms = search.split()
            query_terms = Q()
            for term in search_terms:
                query_terms &= (
                    Q(id__icontains = term)
                )

            model = InventoryModel.objects.filter(
               query_terms,
                type__type = 3
            )

            if date_1:
                model = model.filter(date_reg__gte = date_1)
            
            if date_2:
                model = model.filter(date_reg__lte = date_2)
            
            if product_id not in [None,  0, '0']:
                model = model.filter(product_id = product_id)
            
            if type_id not in [None,  0, '0']:
                model = model.filter(type_id = type_id)
            
            if location_id not in [None,  0, '0']:
                model = model.filter(location_id = location_id)

            if order == 'desc':
                order_by = f'-{order_by}'

            model = model.order_by(order_by)
            paginator = Paginator(model, show)
            model = paginator.page(page_number)

            serialized = InventorySerializer(model, many = True)

            return JsonResponse({
                'success': True,
                'resp': serialized.data,
                'total_pages': paginator.num_pages,
                'current_page': model.number
            })

        elif query == 'get':
            inventory_id = data.get('id', None)

            inventory_serializer = GetInventorySerializer(data = data)  
            if not inventory_serializer.is_valid():
                return JsonResponse({
                    'success': False, 
                    'resp': inventory_serializer.errors
                }, status = 400)    
                    
            inventory_instance = self.get_object(pk = inventory_id)
            inventory_serialized = InventorySerializer(inventory_instance)
            
            return JsonResponse({
                'success': True,
                'resp': inventory_serialized.data
            }) 
        
        elif query == 'list':
            model = InventoryModel.objects.filter(
                Q(id__icontains = search) |
                Q(name__icontains = search)
            )[:10]
            serialized = InventorySerializer(model, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })
        
        elif query == 'count':
            model = InventoryModel.objects.filter(type__type__in = [1, 2])
            
            if date_1:
                model = model.filter(date_reg__gte = date_1)
            
            if date_2:
                model = model.filter(date_reg__lte = date_2)

            total = model.count()

            return JsonResponse({
                'success': True,
                'resp': {
                    'total': total
                }
            })    

        elif query == 'count_transfer':
            model = InventoryModel.objects.filter(type__type = 3)
            
            if date_1:
                model = model.filter(date_reg__gte = date_1)
            
            if date_2:
                model = model.filter(date_reg__lte = date_2)

            total = model.count()

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
            user_id = request.user.id
            data = request.data
            
            movements = data.get('movements', [])    
            if not movements:    
                return JsonResponse({'success': False, 'resp': 'You need to do a movement'}, status = 400)    

            for movement in movements:
                product = movement.get('product', {})
                product_id = product.get('id', None)
                product_name = product.get('name', None)
                location = movement.get('location', {})
                location_id = location.get('id', None)
                type_movement = movement.get('type', {})
                type_id = type_movement.get('id', None)

                type_movement_instance = ManageInventoryTypesAPIView.get_object(type_id)
                type_inventory = type_movement_instance.type
                if type_inventory == 2:
                    if self.get_product_entries(product_id, location_id) < movement.get('quantity', 0):
                        transaction.set_rollback(True)
                        return JsonResponse({'success': False, 'resp': f'There is not enough {product_name} product in the location.'}, status = 400)

                movement['user_id'] = user_id
                movement['type_inventory'] = type_inventory

                inventory_serializer = AddEditInventorySerializer(data = movement)
                if not inventory_serializer.is_valid():
                    transaction.set_rollback(True)
                    return JsonResponse({'success': False, 'resp': inventory_serializer.errors}, status = 400)

                inventory_serializer.save()

            return JsonResponse({'success': True, 'resp': 'Added successfully.'})

    def put(self, request):
        data = request.data

        user_id = request.user.id
        data['user_id'] = user_id
        inventory_id = data.get('id', None)

        inventory_serializer = GetInventorySerializer(data = data)  
        if not inventory_serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': inventory_serializer.errors
            }, status = 400)    
                
        inventory_instance = self.get_object(pk = inventory_id)     

        inventory_serializer = AddEditInventorySerializer(inventory_instance, data = data)
        if not inventory_serializer.is_valid():
            return JsonResponse({'success': False, 'resp': inventory_serializer.errors}, status = 400)

        inventory_serializer.save()

        return JsonResponse({'success': True, 'resp': 'Edited successfully.'})
    
    def delete(self, request):
        data = request.query_params

        inventory_id = data.get('id', None)

        inventory_serializer = GetInventorySerializer(data = data)  
        if not inventory_serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': inventory_serializer.errors,
            }, status = 400)    
                
        inventory_instance = self.get_object(pk = inventory_id)           
        inventory_instance.delete()
        
        return JsonResponse({
            'success': True,
            'resp': 'Deleted successfully.'
        }, status = 200)
    
#Payment Methods
class ManagePaymentMethodsAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk) :
        try:
            return PaymentMethodsModel.objects.get(pk = pk)
        except PaymentMethodsModel.DoesNotExist:
            raise Http404('Payment method not found.')

    def get(self, request):
        data = request.query_params
        query = data.get('query', None)
        search = data.get('search', '')
        page_number = request.query_params.get('page', 1)
        order_by = request.query_params.get('order_by', 'id').replace('.', '__')
        order = request.query_params.get('order', 'desc')
        show = request.query_params.get('show', 10)

        if query == 'table':
            search_terms = search.split()
            query_terms = Q()
            for term in search_terms:
                query_terms &= (
                    Q(id__icontains = term)
                )

            model = PaymentMethodsModel.objects.filter(query_terms)

            if order == 'desc':
                order_by = f'-{order_by}'

            model = model.order_by(order_by)
            paginator = Paginator(model, show)
            model = paginator.page(page_number)

            serialized = PaymentMethodsSerializer(model, many = True)

            return JsonResponse({
                'success': True,
                'resp': serialized.data,
                'total_pages': paginator.num_pages,
                'current_page': model.number
            })

        elif query == 'get':
            payment_method_id = data.get('id', None)

            payment_method_serializer = GetPaymentMethodSerializer(data = data)  
            if not payment_method_serializer.is_valid():
                return JsonResponse({
                    'success': False, 
                    'resp': payment_method_serializer.errors
                }, status = 400)    
                    
            payment_method_instance = self.get_object(pk = payment_method_id)
            payment_method_serialized = PaymentMethodsSerializer(payment_method_instance)
            
            return JsonResponse({
                'success': True,
                'resp': payment_method_serialized.data
            }) 
        
        elif query == 'list':
            model = PaymentMethodsModel.objects.filter(
                Q(id__icontains = search) |
                Q(name__icontains = search)
            )[:10]
            serialized = PaymentMethodsSerializer(model, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })
        
        elif query == 'count':
            total = PaymentMethodsModel.objects.count()            
            
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
        data = request.data

        payment_method_serializer = AddEditPaymentMethodSerializer(data = data)
        if not payment_method_serializer.is_valid():
            return JsonResponse({'success': False, 'resp': payment_method_serializer.errors}, status = 400)

        payment_method_serializer.save()

        return JsonResponse({'success': True, 'resp': 'Added successfully.'})

    def put(self, request):
        data = request.data

        payment_method_id = data.get('id', None)

        payment_method_serializer = GetPaymentMethodSerializer(data = data)  
        if not payment_method_serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': payment_method_serializer.errors
            }, status = 400)    
                
        payment_method_instance = self.get_object(pk = payment_method_id)     

        payment_method_serializer = AddEditPaymentMethodSerializer(payment_method_instance, data = data)
        if not payment_method_serializer.is_valid():
            return JsonResponse({'success': False, 'resp': payment_method_serializer.errors}, status = 400)

        payment_method_serializer.save()

        return JsonResponse({'success': True, 'resp': 'Edited successfully.'})
    
    def delete(self, request):
        data = request.query_params

        payment_method_id = data.get('id', None)

        payment_method_serializer = GetPaymentMethodSerializer(data = data)  
        if not payment_method_serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': payment_method_serializer.errors
            }, status = 400)    
                
        payment_method_instance = self.get_object(pk = payment_method_id)           
        payment_method_instance.delete()
        
        return JsonResponse({
            'success': True,
            'resp': 'Deleted successfully.'
        }, status = 200)

#Sale payments
class ManageSalePaymentsAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    @classmethod
    def get_object(self, pk) :
        try:
            return SalePaymentsModel.objects.get(pk = pk)
        except SalePaymentsModel.DoesNotExist:
            raise Http404('Sale payment not found.')
    
    @classmethod
    def get_object_pending(self, sale_id):
        try:
            sale_payments = SalePaymentsModel.objects.filter(sale_id = sale_id)
            
            pending_payment = sale_payments.filter(
                Q(total__lt = F('subtotal'))
                | Q(total__isnull=True)
            ).order_by('date_limit').first()
            
            if not pending_payment:
                raise Http404('No expired or pending sale payments found.')        
            
            return pending_payment        
        except SalePaymentsModel.DoesNotExist:
            raise Http404('Sale payment not found.')

    @classmethod
    def get_max_no(self) :
        try:
            max_payment_no = SalePaymentsModel.objects.aggregate(Max('no'))['no__max']
            
            if max_payment_no and max_payment_no >= 100000:
                max_no = max_payment_no + 1
            else:
                max_no = 100000

            return max_no
        except SalePaymentsModel.DoesNotExist:
            return 100000
    
    @classmethod
    def get_paid(self, sale_id) :
        try:
            paid = SalePaymentsModel.objects.filter(
                sale_id = sale_id
            ).aggregate(
                total = Sum(
                    ExpressionWrapper (
                        (F('total') - F('commission') - F('surcharge')) + F('discount'),
                        output_field = FloatField()
                    )
                )
            )['total']

            return paid
        except:
            raise Http404('Sale remaining error.')

    @classmethod
    def get_remaining(self, sale_id) :
        try:
            sale_instance = ManageSalesAPIView.get_object(sale_id)
            remaining = self.get_paid(sale_id)

            total = sale_instance.total - remaining
            return total
        except:
            raise Http404('Sale remaining error.')
        
    def get(self, request):
        data = request.query_params
        query = data.get('query', None)        
        search = data.get('search', '')
        page_number = request.query_params.get('page', 1)
        order_by = request.query_params.get('order_by', 'id').replace('.', '__')
        order = request.query_params.get('order', 'desc')
        show = request.query_params.get('show', 10)

        data_id = data.get('id', None)
        type = request.query_params.get('type', None)   

        if query == 'table':
            search_terms = search.split()
            query_terms = Q()
            for term in search_terms:
                query_terms &= (
                    Q(id__icontains = term)
                )

            model = SalePaymentsModel.objects.filter(
                query_terms,
                sale_id = data_id
            )

            if type not in [None,  0, '0']:
                model = model.filter(type = type)

            if order == 'desc':
                order_by = f'-{order_by}'

            model = model.order_by(order_by)
            paginator = Paginator(model, show)
            model = paginator.page(page_number)

            serialized = SalePaymentsSerializer(model, many = True)

            return JsonResponse({
                'success': True,
                'resp': serialized.data,
                'total_pages': paginator.num_pages,
                'current_page': model.number
            })
        
        elif query == 'get':
            salePaymentSerializer = GetSalePaymentSerializer(data = data)  
            if not salePaymentSerializer.is_valid():
                return JsonResponse({
                    'success': False, 
                    'resp': salePaymentSerializer.errors
                }, status = 400)    
                    
            instance = self.get_object(pk = data_id)
            serialized = SalePaymentsSerializer(instance)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            }) 
        
        elif query == 'count':
            total = SalePaymentsModel.objects.filter(
                sale_id = data_id
            ).count()

            sale = ManageSalesAPIView.get_object(data_id)

            remaining = self.get_remaining(data_id)
            
            return JsonResponse({
                'success': True,
                'resp': {
                    'total': total,
                    'total_payment': sale.total,
                    'remaining': remaining
                }
            })     

        return JsonResponse({
            'success': True, 
            'resp': 'Page not found.'
        }, status = 404) 

    def post(self, request):
        with transaction.atomic():
            user = request.user
            data = request.data
            sale_id = data.get('sale_id', 0)
            subtotal = data.get('subtotal', 0)
            invoice_id = None
            
            data['no'] = self.get_max_no()
            data['date_reg'] = timezone.now()
            data['user_id'] = user.id
            
            payment_pending = self.get_object_pending(sale_id)
            payment_subtotal = payment_pending.subtotal
            
            subtotal_fin = payment_subtotal - subtotal
            subtotal_fin = round_if_close_to_zero(subtotal_fin, threshold = 0.5)

            if subtotal_fin > 0:
                item_sale_payment = {
                    'subtotal': subtotal_fin,
                    'sale_id': sale_id,
                    'date_limit': payment_pending.date_limit + timedelta(minutes = 1)
                }

                item_sale_payment_serializer = AddEditSalePaymentSerializer(data = item_sale_payment)
                if not item_sale_payment_serializer.is_valid():
                    transaction.set_rollback(True)
                    return JsonResponse({'success': False, 'resp': item_sale_payment_serializer.errors}, status = 400)

                item_sale_payment_serializer.save()

                sale_payment_serializer = AddEditSalePaymentSerializer(payment_pending, data = data, payment_method_required = True)
                if not sale_payment_serializer.is_valid():
                    transaction.set_rollback(True)
                    return JsonResponse({'success': False, 'resp': sale_payment_serializer.errors}, status = 400)

                sale_payment_instance = sale_payment_serializer.save()
                invoice_id = sale_payment_instance.id

                sale_payment_instance.total_paid = self.get_paid(sale_id)
                sale_payment_instance.total_remaining = self.get_remaining(sale_id)
                sale_payment_instance.save()
            elif subtotal_fin <= 0: 
                sale_payment_serializer = AddEditSalePaymentSerializer(payment_pending, data = data, payment_method_required = True)
                if not sale_payment_serializer.is_valid():
                    transaction.set_rollback(True)
                    return JsonResponse({'success': False, 'resp': sale_payment_serializer.errors}, status = 400)

                sale_payment_instance = sale_payment_serializer.save()
                invoice_id = sale_payment_instance.id

                sale_payment_instance.total_paid = self.get_paid(sale_id)
                sale_payment_instance.total_remaining = self.get_remaining(sale_id)
                sale_payment_instance.save()

                remaining_subtotal = abs(subtotal_fin)
                while remaining_subtotal > 0:
                    r_payment_pending = self.get_object_pending(sale_id)
                    r_payment_subtotal = r_payment_pending.subtotal
            
                    r_subtotal_fin = r_payment_subtotal - remaining_subtotal
                    r_subtotal_fin = round_if_close_to_zero(r_subtotal_fin, threshold = 0.5)

                    if r_subtotal_fin <= 0:
                        remaining_subtotal = abs(r_subtotal_fin)
                        r_item_sale_payment = {
                            'subtotal': 0,
                            'date_reg': timezone.now(),
                            'user_id': user.id
                        }
                    else:
                        remaining_subtotal = 0
                        r_item_sale_payment = {
                            'subtotal': r_subtotal_fin
                        }
                    
                    r_item_sale_payment['sale_id'] = sale_id                    

                    r_item_sale_payment_serializer = AddEditSalePaymentSerializer(r_payment_pending, data = r_item_sale_payment)
                    if not r_item_sale_payment_serializer.is_valid():
                        transaction.set_rollback(True)
                        return JsonResponse({'success': False, 'resp': r_item_sale_payment_serializer.errors}, status = 400)

                    r_item_sale_payment_serializer.save()
                
            remaining = self.get_remaining(sale_id)
            if remaining < 1:
                sale = ManageSalesAPIView.get_object(sale_id)
                sale.status_id = 1
                sale.save()

            return JsonResponse({
                'success': True, 
                'resp': {
                    'id': invoice_id,
                    'msg': 'Added successfully.'
                }
            })

    def put(self, request):
        data = request.data  
        data_id = data.get('id', None)   

        salePaymentSerializer = GetSalePaymentSerializer(data = data)  
        if not salePaymentSerializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': salePaymentSerializer.errors
            }, status = 400)    
                
        instance = self.get_object(pk = data_id)
        
        sale_payment_serializer = AddEditSalePaymentSerializer(instance, data = data, payment_method_required = False)
        if not sale_payment_serializer.is_valid():
            return JsonResponse({'success': False, 'resp': sale_payment_serializer.errors}, status = 400)
        
        sale_payment_instance = sale_payment_serializer.save()

        return JsonResponse({
            'success': True, 
            'resp': {
                'id': sale_payment_instance.id,
                'msg': 'Edited successfully.'
            }
        })

#Sale
class ManageSalesAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    @classmethod
    def get_object(self, pk) :
        try:
            return SalesModel.objects.get(pk = pk)
        except SalesModel.DoesNotExist:
            raise Http404('Sale not found.')
    
    @classmethod
    def get_max_id(self) :
        try:
            max_id = SalesModel.objects.aggregate(Max('id'))['id__max']
            
            if max_id and max_id >= 1:
                max_id = max_id + 1
            else:
                max_id = 1

            return max_id
        except SalePaymentsModel.DoesNotExist:
            return 1
    
    def get(self, request):
        data = request.query_params
        data_id = data.get('id', None)
        query = data.get('query', None)
        search = data.get('search', '')
        page_number = data.get('page', 1)
        order_by = data.get('order_by', 'id').replace('.', '__')
        order = data.get('order', 'desc')
        show = data.get('show', 10)

        type = data.get('type', None)   
        location_id = data.get('location[id]', None)   
        status_id = data.get('status[id]', None)
        other = data.get('other', None)
        client_id = data.get('client_id', None)
        
        if query == 'table': 
            if other in [1, '1']:
                overdue_sales = SalePaymentsModel.objects.filter(
                    Q(total__lt=F('subtotal')) | Q(total__isnull = True),
                    date_limit__lt = timezone.now()
                ).values_list('sale_id', flat = True)
                model = SalesModel.objects.filter(id__in = overdue_sales)
            else:   
                search_terms = search.split()
                query_terms = Q()
                for term in search_terms:
                    query_terms &= (
                        Q(id__icontains = term) |
                        Q(client__person__firstname__icontains = term) |
                        Q(client__person__lastname__icontains = term)
                    )

                model = SalesModel.objects.filter(query_terms)

            if type not in [None,  0, '0']:
                model = model.filter(type = type)
            
            if location_id not in [None,  0, '0']:
                model = model.filter(location_id = location_id)
            
            if status_id not in [None,  0, '0']:
                model = model.filter(status_id = status_id)

            if order == 'desc':
                order_by = f'-{order_by}'

            model = model.order_by(order_by)
            paginator = Paginator(model, show)
            model = paginator.page(page_number)

            serialized = SalesSerializer(model, many = True)

            return JsonResponse({
                'success': True,
                'resp': serialized.data,
                'total_pages': paginator.num_pages,
                'current_page': model.number
            })
        elif query == 'get':
            serializer = GetSaleSerializer(data = data)  
            if not serializer.is_valid():
                return JsonResponse({
                    'success': False, 
                    'resp': serializer.errors
                }, status = 400)    
                    
            instance = self.get_object(pk = data_id)
            serialized = SalesSerializer(instance)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })   
        elif query == 'list':          
            model = SalesModel.objects.filter(
                Q(id__icontains = search),
                client_id = client_id
            )[:10]
            serialized = SalesSerializer(model, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })
        elif query == 'count':
            total = SalesModel.objects.count()            
            
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
        data = request.data
        
        with transaction.atomic():
            user_id = request.user.id
            sale = data.get('sale', None)
            type = sale.get('type', None)
            quantity_of_payments = sale.get('quantity_of_payments', 0)
            payment_days = sale.get('payment_days', 0)
            location = sale.get('location', {})
            location_id = location.get('id', None)
            inventory = data.get('inventory', [])
            sale_payment = data.get('sale_payment', None)
            first_payment_amount = sale_payment.get('subtotal', 0)
            invoice_id = None

            sale['id'] = self.get_max_id()
            sale['user_id'] = user_id
            
            if not type in [1, 2, '1' '2']:
                return JsonResponse({'success': False, 'resp': 'Type inventory not found.'}, status = 400)
            
            if type in [1, '1']:
                sale['status_id'] = 1
            else:
                sale['status_id'] = 2

            sale_serializer = AddEditSaleSerializer(data = sale)
            if not sale_serializer.is_valid():
                transaction.set_rollback(True)
                return JsonResponse({'success': False, 'resp': sale_serializer.errors}, status = 400)

            sale_instance = sale_serializer.save()

            for item_inventory in inventory:
                item_inventory['sale_id'] = sale_instance.id
                item_inventory['location'] = location
                item_inventory['user_id'] = user_id
                item_inventory['type_id'] = 3
                item_inventory['type_inventory'] = 2
                product = item_inventory.get('product', {})
                product_id = product.get('id', None)
                product_name = product.get('name', product_id)

                if AppInventoryAPIView.get_product_entries(product_id, location_id) < item_inventory.get('quantity', 0):
                    transaction.set_rollback(True)
                    return JsonResponse({'success': False, 'resp': f'There is not enough {product_name} product in the location.'}, status = 400)

                inventory_serializer = AddEditInventorySerializer(data = item_inventory)
                if not inventory_serializer.is_valid():
                    transaction.set_rollback(True)
                    return JsonResponse({'success': False, 'resp': inventory_serializer.errors}, status = 400)

                inventory_serializer.save()
            
            if first_payment_amount > 0:
                sale_payment['no'] = ManageSalePaymentsAPIView.get_max_no()
                sale_payment['sale_id'] = sale_instance.id
                sale_payment['user_id'] = user_id
                sale_payment['location'] = location
                sale_payment['date_reg'] = timezone.now()
                sale_payment['date_limit'] = timezone.now()

                sale_payment_serializer = AddEditSalePaymentSerializer(data = sale_payment, payment_method_required = True)
                if not sale_payment_serializer.is_valid():
                    transaction.set_rollback(True)
                    return JsonResponse({'success': False, 'resp': sale_payment_serializer.errors}, status = 400)

                sale_payment_instance = sale_payment_serializer.save()
                invoice_id = sale_payment_instance.id
                sale_payment_instance.total_paid = ManageSalePaymentsAPIView.get_paid(sale_instance.id)
                sale_payment_instance.total_remaining = ManageSalePaymentsAPIView.get_remaining(sale_instance.id)
                sale_payment_instance.save()

            if type in [2, '2']:
                if first_payment_amount > 0:
                    quantity_of_payments = int(quantity_of_payments) - 1
                else:
                    quantity_of_payments = int(quantity_of_payments)

                total_remaining = sale_instance.total - sale_payment.get('subtotal', 0)
                
                integer_payment_amount = int(total_remaining // quantity_of_payments)
                
                remainder = total_remaining - (integer_payment_amount * (quantity_of_payments - 1))
                
                date_limit = timezone.now()
                for i in range(quantity_of_payments):
                    item_sale_payment = {}
                    
                    if i < quantity_of_payments - 1:
                        item_sale_payment['subtotal'] = integer_payment_amount
                    else:
                        item_sale_payment['subtotal'] = remainder
                    
                    item_sale_payment['sale_id'] = sale_instance.id
                    
                    if int(payment_days) in [30, 31]:
                        date_limit += relativedelta(months=1)
                    else:
                        date_limit += timedelta(days=payment_days)
                    
                    item_sale_payment['date_limit'] = date_limit

                    item_sale_payment_serializer = AddEditSalePaymentSerializer(data=item_sale_payment)
                    if not item_sale_payment_serializer.is_valid():
                        transaction.set_rollback(True)
                        return JsonResponse({'success': False, 'resp': item_sale_payment_serializer.errors}, status=400)

                    item_sale_payment_instance = item_sale_payment_serializer.save()
                    
                    if not invoice_id and first_payment_amount <= 0:
                        invoice_id = item_sale_payment_instance.id

            return JsonResponse({
                'success': True, 
                'resp': {
                    'id': invoice_id,
                    'msg': 'Added successfully.'
                }
            })
        
    def put(self, request):
        data = request.data

        data_id = data.get('id', None)

        serializer = GetSaleSerializer(data = data)  
        if not serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': serializer.errors
            }, status = 400)    
                
        instance = self.get_object(pk = data_id)     

        serializer = AddEditSaleSerializer(instance, data = data)
        if not serializer.is_valid():
            return JsonResponse({'success': False, 'resp': serializer.errors}, status = 400)

        serializer.save()

        return JsonResponse({'success': True, 'resp': 'Edited successfully.'})

#Sale receipt
class ManageSaleReceiptAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    @classmethod
    def get_object(self, pk) :
        try:
            return SaleReceiptModel.objects.get(pk = pk)
        except SaleReceiptModel.DoesNotExist:
            raise Http404('Sale receipt not found.')
    
    @classmethod
    def get_object_prompter(self, prompter) :
        try:
            return SaleReceiptModel.objects.get(prompter = prompter)
        except SaleReceiptModel.DoesNotExist:
            raise Http404('Sale receipt prompter not found.')

    def get(self, request):
        data = request.query_params
        data_id = data.get('id', None)
        query = data.get('query', None)
        search = data.get('search', '')
        page_number = request.query_params.get('page', 1)
        order_by = request.query_params.get('order_by', 'id').replace('.', '__')
        order = request.query_params.get('order', 'desc')
        show = request.query_params.get('show', 10)

        if query == 'table':
            search_terms = search.split()
            query_terms = Q()
            for term in search_terms:
                query_terms &= (
                    Q(id__icontains = term)
                )

            model = SaleReceiptModel.objects.filter(query_terms)

            if order == 'desc':
                order_by = f'-{order_by}'

            model = model.order_by(order_by)
            paginator = Paginator(model, show)
            model = paginator.page(page_number)

            serialized = SaleReceiptSerializer(model, many = True)

            return JsonResponse({
                'success': True,
                'resp': serialized.data,
                'total_pages': paginator.num_pages,
                'current_page': model.number
            })

        elif query == 'get':
            sale_receipt_serializer = GetSaleReceiptSerializer(data = data)  
            if not sale_receipt_serializer.is_valid():
                return JsonResponse({
                    'success': False, 
                    'resp': sale_receipt_serializer.errors
                }, status = 400)    
                    
            sale_receipt_instance = self.get_object(pk = data_id)
            sale_receipt_serialized = SaleReceiptSerializer(sale_receipt_instance)
            
            return JsonResponse({
                'success': True,
                'resp': sale_receipt_serialized.data
            }) 
        
        elif query == 'count':
            total = SaleReceiptModel.objects.count()            
            
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
        data = request.data

        serializer = AddEditSaleReceiptSerializer(data = data)
        if not serializer.is_valid():
            return JsonResponse({'success': False, 'resp': serializer.errors}, status = 400)

        serializer.save()

        return JsonResponse({'success': True, 'resp': 'Added successfully.'})

    def put(self, request):
        data = request.data

        sale_receipt_id = data.get('id', None)

        serializer = GetSaleReceiptSerializer(data = data)  
        if not serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': serializer.errors
            }, status = 400)    
                
        instance = self.get_object(pk = sale_receipt_id)     

        serializer = AddEditSaleReceiptSerializer(instance, data = data)
        if not serializer.is_valid():
            return JsonResponse({'success': False, 'resp': serializer.errors}, status = 400)

        serializer.save()

        return JsonResponse({'success': True, 'resp': 'Edited successfully.'})
    
    def delete(self, request):
        data = request.query_params

        sale_receipt_id = data.get('id', None)

        serializer = GetSaleReceiptSerializer(data = data)  
        if not serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': serializer.errors
            }, status = 400)    
                
        instance = self.get_object(pk = sale_receipt_id)           
        instance.delete()
        
        return JsonResponse({
            'success': True,
            'resp': 'Deleted successfully.'
        }, status = 200)

#Sale status
class ManageSaleStatusAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    @classmethod
    def get_object(self, pk) :
        try:
            return SaleStatusModel.objects.get(pk = pk)
        except SaleStatusModel.DoesNotExist:
            raise Http404('Sale status not found.')

    def get(self, request):
        data = request.query_params
        data_id = data.get('id', None)
        query = data.get('query', None)
        search = data.get('search', '')
        page_number = request.query_params.get('page', 1)
        order_by = request.query_params.get('order_by', 'id').replace('.', '__')
        order = request.query_params.get('order', 'desc')
        show = request.query_params.get('show', 10)

        if query == 'table':
            search_terms = search.split()
            query_terms = Q()
            for term in search_terms:
                query_terms &= (
                    Q(id__icontains = term)
                )

            model = SaleStatusModel.objects.filter(query_terms)

            if order == 'desc':
                order_by = f'-{order_by}'

            model = model.order_by(order_by)
            paginator = Paginator(model, show)
            model = paginator.page(page_number)

            serialized = SaleStatusSerializer(model, many = True)

            return JsonResponse({
                'success': True,
                'resp': serialized.data,
                'total_pages': paginator.num_pages,
                'current_page': model.number
            })

        elif query == 'get':
            serializer = GetSaleStatusSerializer(data = data)  
            if not serializer.is_valid():
                return JsonResponse({
                    'success': False, 
                    'resp': serializer.errors
                }, status = 400)    
                    
            instance = self.get_object(pk = data_id)
            serialized = SaleStatusSerializer(instance)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            }) 
        
        elif query == 'list':
            model = SaleStatusModel.objects.filter(
                Q(id__icontains = search) |
                Q(name__icontains = search)
            )[:10]
            serialized = TaxesSerializer(model, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })
        
        elif query == 'count':
            total = SaleStatusModel.objects.count()            
            
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
        data = request.data

        serializer = AddEditSaleStatusSerializer(data = data)
        if not serializer.is_valid():
            return JsonResponse({'success': False, 'resp': serializer.errors}, status = 400)

        serializer.save()

        return JsonResponse({'success': True, 'resp': 'Added successfully.'})

    def put(self, request):
        data = request.data

        data_id = data.get('id', None)

        serializer = GetSaleStatusSerializer(data = data)  
        if not serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': serializer.errors
            }, status = 400)    
                
        instance = self.get_object(pk = data_id)     

        serializer = AddEditSaleStatusSerializer(instance, data = data)
        if not serializer.is_valid():
            return JsonResponse({'success': False, 'resp': serializer.errors}, status = 400)

        serializer.save()

        return JsonResponse({'success': True, 'resp': 'Edited successfully.'})
    
    def delete(self, request):
        data = request.query_params

        data_id = data.get('id', None)

        serializer = GetSaleStatusSerializer(data = data)  
        if not serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': serializer.errors
            }, status = 400)    
                
        instance = self.get_object(pk = data_id)           
        instance.delete()
        
        return JsonResponse({
            'success': True,
            'resp': 'Deleted successfully.'
        }, status = 200)

#Cash register
class ManageCashRegisterAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    @classmethod
    def get_object(self, pk) :
        try:
            return CashRegisterModel.objects.get(pk = pk)
        except CashRegisterModel.DoesNotExist:
            raise Http404('Cash register not found.')

    def get(self, request):
        data = request.query_params
        location_id = data.get('location[id]', None)
        data_id = data.get('id', None)
        query = data.get('query', None)
        search = data.get('search', '')
        page_number = request.query_params.get('page', 1)
        order_by = request.query_params.get('order_by', 'id').replace('.', '__')
        order = request.query_params.get('order', 'desc')
        show = request.query_params.get('show', 10)

        date_1_str = data.get('date_1', None)
        date_2_str = data.get('date_2', None)   

        if not date_1_str:
            date_1_str = data.get('filters[date_1]', None)
        
        if not date_2_str:
            date_2_str = data.get('filters[date_2]', None)

        date_1, date_2 = None, None
        if date_1_str:
            date_1 = datetime.strptime(date_1_str, '%Y-%m-%d').date()

        if date_2_str:
            date_2 = datetime.strptime(date_2_str, '%Y-%m-%d').date()

        if query == 'table':
            search_terms = search.split()
            query_terms = Q()
            for term in search_terms:
                query_terms &= (
                    Q(id__icontains = term)
                )

            model = CashRegisterModel.objects.filter(query_terms)

            if date_1:
                model = model.filter(date_reg__gte = date_1)
            
            if date_2:
                model = model.filter(date_reg__lte = date_2)

            if location_id not in [None,  0, '0']:
                model = model.filter(location_id = location_id)

            if order == 'desc':
                order_by = f'-{order_by}'

            model = model.order_by(order_by)
            paginator = Paginator(model, show)
            model = paginator.page(page_number)

            serialized = CashRegisterSerializer(model, many = True)

            return JsonResponse({
                'success': True,
                'resp': serialized.data,
                'total_pages': paginator.num_pages,
                'current_page': model.number
            })

        elif query == 'get':
            serializer = GetCashRegisterSerializer(data = data)  
            if not serializer.is_valid():
                return JsonResponse({
                    'success': False, 
                    'resp': serializer.errors
                }, status = 400)    
                    
            instance = self.get_object(pk = data_id)
            serialized = CashRegisterSerializer(instance)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            }) 
        
        elif query == 'list':
            model = CashRegisterModel.objects.filter(
                Q(id__icontains = search) |
                Q(name__icontains = search)
            )[:10]
            
            serialized = TaxesSerializer(model, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })
        
        elif query == 'count':
            expense = 0
            model = CashRegisterModel.objects.filter()

            if location_id not in [None,  0, '0']:
                model = model.filter(location_id = location_id)
            
            if date_1:
                model = model.filter(date_reg__gte = date_1)
            
            if date_2:
                model = model.filter(date_reg__lte = date_2)
            
            expense = model.aggregate(total = Sum('amount'))['total'] or 0      
            
            return JsonResponse({
                'success': True,
                'resp': {
                    'total': model.count(),
                    'expense': expense
                }
            })      
        
        return JsonResponse({
            'success': True, 
            'resp': 'Page not found.'
        }, status = 404) 

    def post(self, request):
        data = request.data
        data['user_id'] = request.user.id

        serializer = AddEditCashRegisterSerializer(data = data)
        if not serializer.is_valid():
            return JsonResponse({'success': False, 'resp': serializer.errors}, status = 400)

        serializer.save()

        return JsonResponse({'success': True, 'resp': 'Added successfully.'})

    def put(self, request):
        data = request.data

        data_id = data.get('id', None)

        serializer = GetCashRegisterSerializer(data = data)  
        if not serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': serializer.errors
            }, status = 400)    
                
        instance = self.get_object(pk = data_id)     

        serializer = AddEditCashRegisterSerializer(instance, data = data)
        if not serializer.is_valid():
            return JsonResponse({'success': False, 'resp': serializer.errors}, status = 400)

        serializer.save()

        return JsonResponse({'success': True, 'resp': 'Edited successfully.'})
    
    def delete(self, request):
        data = request.query_params

        data_id = data.get('id', None)

        serializer = GetCashRegisterSerializer(data = data)  
        if not serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': serializer.errors
            }, status = 400)    
                
        instance = self.get_object(pk = data_id)           
        instance.delete()
        
        return JsonResponse({
            'success': True,
            'resp': 'Deleted successfully.'
        }, status = 200)

#Cash register sales
class ManageCashRegisterSalesAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        data = request.query_params
        data_id = data.get('id', None)        
        query = data.get('query', None)
        search = data.get('search', '')
        page_number = request.query_params.get('page', 1)
        order_by = request.query_params.get('order_by', 'id').replace('.', '__')
        order = request.query_params.get('order', 'desc')
        show = request.query_params.get('show', 10)

        sale_type = data.get('sale[type]', None)
        payment_method_id = data.get('payment_method[id]', None)    
        
        type = data.get('type', None)   
        location_id = data.get('filters[location][id]', None)
        date_1_str = data.get('filters[date_1]', None)
        date_2_str = data.get('filters[date_2]', None)        

        date_1, date_2 = None, None
        if date_1_str:
            date_1 = datetime.strptime(date_1_str, '%Y-%m-%d').date()

        if date_2_str:
            date_2 = datetime.strptime(date_2_str, '%Y-%m-%d').date()

        if query == 'table':        
            search_terms = search.split()
            query_terms = Q()
            for term in search_terms:
                query_terms &= (
                    Q(id__icontains = term)
                ) 

            model = SalesModel.objects.filter(query_terms)

            if date_1:
                model = model.filter(date_reg__gte = date_1)
            
            if date_2:
                model = model.filter(date_reg__lte = date_2)

            if location_id not in [None,  0, '0']:
                model = model.filter(location_id = location_id)

            if type not in [None,  0, '0']:
                model = model.filter(type = type)

            if order == 'desc':
                order_by = f'-{order_by}'

            model = model.order_by(order_by)
            paginator = Paginator(model, show)
            model = paginator.page(page_number)

            serialized = SalesSerializer(model, many = True)

            return JsonResponse({
                'success': True,
                'resp': serialized.data,
                'total_pages': paginator.num_pages,
                'current_page': model.number
            })
        if query == 'table_payments':   
            search_terms = search.split()
            query_terms = Q()
            for term in search_terms:
                query_terms &= (
                    Q(id__icontains = term)
                ) 

            model = SalePaymentsModel.objects.filter(
                query_terms,
                total__gt = 0
            )

            if date_1:
                model = model.filter(date_reg__gte = date_1)
            
            if date_2:
                model = model.filter(date_reg__lte = date_2)

            if location_id not in [None,  0, '0']:
                model = model.filter(location_id = location_id)
                
            if sale_type not in [None,  0, '0']:
                model = model.filter(sale__type = sale_type)
            
            if payment_method_id not in [None,  0, '0']:
                model = model.filter(payment_method_id = payment_method_id)

            if order == 'desc':
                order_by = f'-{order_by}'

            model = model.order_by(order_by)
            paginator = Paginator(model, show)
            model = paginator.page(page_number)

            serialized = SalePaymentsSaleSerializer(model, many = True)

            return JsonResponse({
                'success': True,
                'resp': serialized.data,
                'total_pages': paginator.num_pages,
                'current_page': model.number
            })    
        elif query == 'get':
            serializer = GetSaleSerializer(data = data)  
            if not serializer.is_valid():
                return JsonResponse({
                    'success': False, 
                    'resp': serializer.errors
                }, status = 400)    
                    
            instance = ManageSalesAPIView.get_object(pk = data_id)
            serialized = SalesSerializer(instance)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })   
        elif query == 'count':
            model = SalesModel.objects.filter(status__calculate = True)                
            
            if location_id not in [None,  0, '0']:
                model = model.filter(
                    location_id = location_id
                )
            
            if date_1:
                model = model.filter(date_reg__gte = date_1)
            
            if date_2:
                model = model.filter(date_reg__lte = date_2)

            if type not in [None,  0, '0']:
                model = model.filter(type = type)

            total = model.aggregate(total = Sum('total'))['total'] or 0

            return JsonResponse({
                'success': True,
                'resp': {
                    'total': total
                }
            })      
        elif query == 'count_payments':
            model = SalePaymentsModel.objects.filter(
                sale__status__calculate = True
            )                
            
            if date_1:
                model = model.filter(date_reg__gte = date_1)
            
            if date_2:
                model = model.filter(date_reg__lte = date_2)

            if location_id not in [None,  0, '0']:
                model = model.filter(location_id = location_id)
            
            if sale_type not in [None,  0, '0']:
                model = model.filter(sale__type = sale_type)
            
            if payment_method_id not in [None,  0, '0']:
                model = model.filter(payment_method_id = payment_method_id)

            total = model.aggregate(total = Sum('total'))['total'] or 0

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

#Statistics sales
class StatisticsSalesAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        data = request.query_params
        query = data.get('query', None)
        search = data.get('search', '')
        page_number = request.query_params.get('page', 1)
        order_by = request.query_params.get('order_by', 'id').replace('.', '__')
        order = request.query_params.get('order', 'desc')
        show = request.query_params.get('show', 10)
        date_1_str = data.get('filters[date_1]', None)
        date_2_str = data.get('filters[date_2]', None)        

        date_1, date_2 = None, None
        if date_1_str:
            date_1 = datetime.strptime(date_1_str, '%Y-%m-%d').date()

        if date_2_str:
            date_2 = datetime.strptime(date_2_str, '%Y-%m-%d').date()

        if query == 'table_payment_methods':        
            payment_summaries = (
                SalePaymentsModel.objects.filter(
                    sale__status__calculate = True, 
                    payment_method__isnull = False
                ).values('payment_method__name').annotate(total_payments = Sum('total')) 
            )

            return JsonResponse({
                'success': True,
                'resp': list(payment_summaries),
                'total_pages':1,
                'current_page':1
            })

        elif query == 'table_location_payment_methods':
            model = SalePaymentsModel.objects.filter(
                sale__status__calculate = True,
                payment_method__isnull = False
            )            

            if date_1:
                model = model.filter(date_reg__gte = date_1)
            
            if date_2:
                model = model.filter(date_reg__lte = date_2)
            
            payment_summaries = (                
                model.values('location__name', 'payment_method__name').annotate(total = Sum('total'))
            )

            location_data = defaultdict(list)
            for item in payment_summaries:
                location_name = item['location__name']
                payment_method_data = {
                    'name': item['payment_method__name'],
                    'total': item['total']
                }
                location_data[location_name].append(payment_method_data)

            response_data = [
                {'location_name': location, 'payment_methods': methods}
                for location, methods in location_data.items()
            ]

            return JsonResponse({
                'success': True,
                'resp': response_data,
                'total_pages': 1,
                'current_page': 1
            })

        elif query == 'table_sales':     
            model = SalesModel.objects.filter(
                status__calculate=True 
            )

            if date_1:
                model = model.filter(date_reg__gte = date_1)
            
            if date_2:
                model = model.filter(date_reg__lte = date_2)

            model = model.values('location__name').annotate(total_sales=Sum('total'))

            return JsonResponse({
                'success': True,
                'resp': list(model),
                'total_pages':1,
                'current_page':1
            })
        
        elif query == 'count':        
            total_sales = SalesModel.objects.filter(status__calculate = True)
            total_payments = SalePaymentsModel.objects.filter(sale__status__calculate = True)

            if date_1_str:
                total_sales = total_sales.filter(date_reg__gte = date_1)
                total_payments = total_payments.filter(date_reg__gte = date_1)
            
            if date_2_str:
                total_sales = total_sales.filter(date_reg__lte = date_2)
                total_payments = total_payments.filter(date_reg__lte = date_2)            

            total_sales = total_sales.aggregate(total_sales = Sum('total'))['total_sales']
            total_payments = total_payments.aggregate(total_payments = Sum('total'))['total_payments']

            return JsonResponse({
                'success': True,
                'resp': {
                    'total_sales': total_sales,
                    'total_payments': total_payments
                }
            })
        
        return JsonResponse({
            'success': True, 
            'resp': 'Page not found.'
        }, status = 404)

#Expenses
class ManageExpensesAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    @classmethod
    def get_object(self, pk) :
        try:
            return ExpensesModel.objects.get(pk = pk)
        except ExpensesModel.DoesNotExist:
            raise Http404('Expenses not found.')

    @classmethod
    def get_total(self):
        total = ExpensesModel.objects.filter().aggregate(total_sum = Sum('total'))['total_sum'] or 0 

        return total

    @classmethod
    def get_total_paid(self):
        total_paid = ExpensePaymentsModel.objects.filter().aggregate(total = Sum('amount'))['total'] or 0 

        return total_paid

    @classmethod
    def get_remaining(self):
        total = self.get_total()
        total_remaining = self.get_total_paid()

        return total - total_remaining
        
    def get(self, request):
        data = request.query_params
        query = data.get('query', None)
        search = data.get('search', '')
        page_number = request.query_params.get('page', 1)
        order_by = request.query_params.get('order_by', 'id').replace('.', '__')
        order = request.query_params.get('order', 'desc')
        show = request.query_params.get('show', 10)

        supplier_id = data.get('supplier[id]', None)
        isactive = data.get('status', None)

        if query == 'table':
            search_terms = search.split()
            query_terms = Q()
            for term in search_terms:
                query_terms &= (
                    Q(id__icontains = term)
                )

            model = ExpensesModel.objects.filter(query_terms)

            if supplier_id not in [None,  0, '0']:
                model = model.filter(supplier_id = supplier_id)
            
            if isactive not in [None,  0, '0']:
                if isactive in [2, '2']:
                    model = model.filter(isactive = False)
                else:
                    model = model.filter(isactive = isactive)
  
            if order == 'desc':
                order_by = f'-{order_by}'

            model = model.order_by(order_by)
            paginator = Paginator(model, show)
            model = paginator.page(page_number)

            serialized = ExpensesSerializer(model, many = True)

            return JsonResponse({
                'success': True,
                'resp': serialized.data,
                'total_pages': paginator.num_pages,
                'current_page': model.number
            })

        elif query == 'get':
            data_id = data.get('id', None)

            serializer = GetExpenseSerializer(data = data)  
            if not serializer.is_valid():
                return JsonResponse({
                    'success': False, 
                    'resp': serializer.errors
                }, status = 400)    
                    
            instance = self.get_object(pk = data_id)

            serialized = ExpensesSerializer(instance)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            }) 
        
        elif query == 'list':
            model = ExpensesModel.objects.filter(
                Q(id__icontains = search) |
                Q(name__icontains = search)                
            )[:10]
            serialized = ExpensesSerializer(model, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })
        
        elif query == 'count':
            total = ExpensesModel.objects.count()            
            
            return JsonResponse({
                'success': True,
                'resp': {
                    'total': total,
                    'total_sum': self.get_total(),
                    'total_paid': self.get_total_paid(),
                    'total_remaining': self.get_remaining()
                }
            })      
        
        return JsonResponse({
            'success': True, 
            'resp': 'Page not found.'
        }, status = 404) 

    def post(self, request):
        user = request.user
        data = request.data

        data['user_id'] = user.id

        serializer = AddEditExpenseSerializer(data = data)
        if not serializer.is_valid():
            return JsonResponse({'success': False, 'resp': serializer.errors}, status = 400)

        serializer.save()

        return JsonResponse({'success': True, 'resp': 'Added successfully.'})

    def put(self, request):
        user = request.user
        data = request.data

        data['user_id'] = user.id

        data_id = data.get('id', None)

        serializer = GetExpenseSerializer(data = data)  
        if not serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': serializer.errors
            }, status = 400)    
                
        instance = self.get_object(pk = data_id)     

        serializer = AddEditExpenseSerializer(instance, data = data)
        if not serializer.is_valid():
            return JsonResponse({'success': False, 'resp': serializer.errors}, status = 400)

        serializer.save()

        return JsonResponse({'success': True, 'resp': 'Edited successfully.'})
    
    def delete(self, request):
        data = request.query_params

        data_id = data.get('id', None)

        serializer = GetExpenseSerializer(data = data)  
        if not serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': serializer.errors
            }, status = 400)    
                
        instance = self.get_object(pk = data_id)           
        instance.delete()
        
        return JsonResponse({
            'success': True,
            'resp': 'Deleted successfully.'
        }, status = 200)

#Expense details
class ManageExpenseDetailsAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk) :
        try:
            return ExpenseDetailsModel.objects.get(pk = pk)
        except ExpenseDetailsModel.DoesNotExist:
            raise Http404('Expense detail not found.')

    def get(self, request):
        data = request.query_params
        data_id = data.get('id', None)
        query = data.get('query', None)
        search = data.get('search', '')
        page_number = data.get('page', 1)
        order_by = data.get('order_by', 'id').replace('.', '__')
        order = data.get('order', 'desc')
        show = data.get('show', 10)

        if query == 'table':
            search_terms = search.split()
            query_terms = Q()
            for term in search_terms:
                query_terms &= (
                    Q(id__icontains = term)
                )

            model = ExpenseDetailsModel.objects.filter(
                query_terms,
                expense_id = data_id
            )

            if order == 'desc':
                order_by = f'-{order_by}'

            model = model.order_by(order_by)
            paginator = Paginator(model, show)
            model = paginator.page(page_number)

            serialized = ExpenseDetailsSerializer(model, many = True)

            return JsonResponse({
                'success': True,
                'resp': serialized.data,
                'total_pages': paginator.num_pages,
                'current_page': model.number
            })

        elif query == 'get':
            data_id = data.get('id', None)

            serializer = GetExpenseDetailsSerializer(data = data)  
            if not serializer.is_valid():
                return JsonResponse({
                    'success': False, 
                    'resp': serializer.errors
                }, status = 400)    
                    
            instance = self.get_object(pk = data_id)

            serialized = ExpenseDetailsSerializer(instance)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            }) 
        
        elif query == 'list':
            model = ExpenseDetailsModel.objects.filter(
                Q(id__icontains = search) |
                Q(product__name__icontains = search) |
                Q(serial_number__icontains = search) 
            )[:10]
            serialized = ExpenseDetailsSerializer(model, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })
        
        elif query == 'count':
            total = ExpenseDetailsModel.objects.filter(expense_id = data_id).count()            
            
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
        user = request.user
        data = request.data

        data['user_id'] = user.id

        serializer = AddEditExpenseDetailsSerializer(data = data)
        if not serializer.is_valid():
            return JsonResponse({'success': False, 'resp': serializer.errors}, status = 400)

        serializer.save()

        return JsonResponse({'success': True, 'resp': 'Added successfully.'})

    def put(self, request):
        user = request.user
        data = request.data

        data['user_id'] = user.id

        data_id = data.get('id', None)

        serializer = GetExpenseDetailsSerializer(data = data)  
        if not serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': serializer.errors
            }, status = 400)    
                
        instance = self.get_object(pk = data_id)     

        serializer = AddEditExpenseDetailsSerializer(instance, data = data)
        if not serializer.is_valid():
            return JsonResponse({'success': False, 'resp': serializer.errors}, status = 400)

        serializer.save()

        return JsonResponse({'success': True, 'resp': 'Edited successfully.'})
    
    def delete(self, request):
        data = request.query_params

        data_id = data.get('id', None)

        serializer = GetExpenseDetailsSerializer(data = data)  
        if not serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': serializer.errors
            }, status = 400)    
                
        instance = self.get_object(pk = data_id)           
        instance.delete()
        
        return JsonResponse({
            'success': True,
            'resp': 'Deleted successfully.'
        }, status = 200)

#Expense payments
class ManageExpensePaymentsAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    @classmethod
    def get_object(self, pk) :
        try:
            return ExpensePaymentsModel.objects.get(pk = pk)
        except ExpensePaymentsModel.DoesNotExist:
            raise Http404('Expense detail not found.')
    
    @classmethod
    def get_total_paid(self, expense_id):
        model = ExpensePaymentsModel.objects.filter(expense_id = expense_id)
        total_paid = model.aggregate(total = Sum('amount'))['total'] or 0 

        return total_paid
    
    @classmethod
    def get_remaining(self, expense_id):
        model = ManageExpensesAPIView.get_object(expense_id)
        total_remaining = self.get_total_paid(expense_id)

        return model.total - total_remaining

    def get(self, request):
        data = request.query_params
        data_id = data.get('id', None)
        query = data.get('query', None)
        search = data.get('search', '')
        page_number = data.get('page', 1)
        order_by = data.get('order_by', 'id').replace('.', '__')
        order = data.get('order', 'desc')
        show = data.get('show', 10)

        if query == 'table':
            search_terms = search.split()
            query_terms = Q()
            for term in search_terms:
                query_terms &= (
                    Q(id__icontains = term)
                )

            model = ExpensePaymentsModel.objects.filter(
                query_terms,
                expense_id = data_id
            )

            if order == 'desc':
                order_by = f'-{order_by}'

            model = model.order_by(order_by)
            paginator = Paginator(model, show)
            model = paginator.page(page_number)

            serialized = ExpensePaymentsSerializer(model, many = True)

            return JsonResponse({
                'success': True,
                'resp': serialized.data,
                'total_pages': paginator.num_pages,
                'current_page': model.number
            })

        elif query == 'get':
            data_id = data.get('id', None)

            serializer = GetExpensePaymentSerializer(data = data)  
            if not serializer.is_valid():
                return JsonResponse({
                    'success': False, 
                    'resp': serializer.errors
                }, status = 400)    
                    
            instance = self.get_object(pk = data_id)

            serialized = ExpensePaymentsSerializer(instance)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            }) 
        
        elif query == 'list':
            model = ExpensePaymentsModel.objects.filter(
                Q(id__icontains = search) |
                Q(name__icontains = search)
            )[:10]
            serialized = ExpensePaymentsSerializer(model, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })
        
        elif query == 'count':
            total = ExpensePaymentsModel.objects.filter(expense_id = data_id).count()            
            
            return JsonResponse({
                'success': True,
                'resp': {
                    'total': total,
                    'total_paid': self.get_total_paid(data_id),
                    'total_remaining': self.get_remaining(data_id)
                }
            })      
        
        return JsonResponse({
            'success': True, 
            'resp': 'Page not found.'
        }, status = 404) 

    def post(self, request):
        user = request.user
        data = request.data

        with transaction.atomic():
            data['user_id'] = user.id
            expense_id = data.get('expense_id', None)
            amount = data.get('amount', 0)
            amount = int(amount) if str(amount).isnumeric() else 0
            
            if amount <= 0:
                transaction.set_rollback(True)
                return JsonResponse({
                    'success': False, 
                    'resp': 'The amount to be paid is equal to or less than 0.'
                }, status = 400)
            elif self.get_remaining(expense_id) < amount:
                transaction.set_rollback(True)
                return JsonResponse({
                    'success': False, 
                    'resp': 'The amount to be paid exceeds the total payment.'
                }, status = 400)
            
            serializer = AddEditExpensePaymentSerializer(data = data)
            if not serializer.is_valid():
                transaction.set_rollback(True)
                return JsonResponse({'success': False, 'resp': serializer.errors}, status = 400)

            serializer.save()

            remaining = self.get_remaining(expense_id)
            if remaining <= 0:
                expense = ManageExpensesAPIView.get_object(expense_id)
                expense.isactive = False
                expense.save()

            return JsonResponse({'success': True, 'resp': 'Added successfully.'})

    def put(self, request):
        user = request.user
        data = request.data

        data['user_id'] = user.id

        data_id = data.get('id', None)
        

        serializer = GetExpensePaymentSerializer(data = data)  
        if not serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': serializer.errors
            }, status = 400)    
                
        instance = self.get_object(pk = data_id) 

        serializer = AddEditExpensePaymentSerializer(instance, data = data)
        if not serializer.is_valid():
            return JsonResponse({'success': False, 'resp': serializer.errors}, status = 400)

        serializer.save()

        return JsonResponse({'success': True, 'resp': 'Edited successfully.'})
    
    def delete(self, request):
        data = request.query_params

        data_id = data.get('id', None)

        serializer = GetExpensePaymentSerializer(data = data)  
        if not serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': serializer.errors
            }, status = 400)    
                
        instance = self.get_object(pk = data_id)  

        expense = ManageExpensesAPIView.get_object(instance.expense.id)  
        if not expense.isactive:
            return JsonResponse({
                'success': False, 
                'resp': 'It cannot be deleted because it is already complete.'
            }, status = 400)    

        instance.delete()
        
        return JsonResponse({
            'success': True,
            'resp': 'Deleted successfully.'
        }, status = 200)

#Banks
class ManageBanksAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    @classmethod
    def get_object(self, pk) :
        try:
            return BanksModel.objects.get(pk = pk)
        except BanksModel.DoesNotExist:
            raise Http404('Bank not found.')
        
    def get(self, request):
        data = request.query_params
        data_id = data.get('id', None)
        query = data.get('query', None)
        search = data.get('search', '')
        page_number = data.get('page', 1)
        order_by = data.get('order_by', 'id').replace('.', '__')
        order = data.get('order', 'desc')
        show = data.get('show', 10)

        if query == 'table':
            search_terms = search.split()
            query_terms = Q()
            for term in search_terms:
                query_terms &= (
                    Q(id__icontains = term)
                )

            model = BanksModel.objects.filter(query_terms)

            if order == 'desc':
                order_by = f'-{order_by}'

            model = model.order_by(order_by)
            paginator = Paginator(model, show)
            model = paginator.page(page_number)

            serialized = BanksSerializer(model, many = True)

            return JsonResponse({
                'success': True,
                'resp': serialized.data,
                'total_pages': paginator.num_pages,
                'current_page': model.number
            })

        elif query == 'get':
            data_id = data.get('id', None)

            serializer = GetBankSerializer(data = data)  
            if not serializer.is_valid():
                return JsonResponse({
                    'success': False, 
                    'resp': serializer.errors
                }, status = 400)    
                    
            instance = self.get_object(pk = data_id)

            serialized = BanksSerializer(instance)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            }) 
        
        elif query == 'list':
            model = BanksModel.objects.filter(
                Q(id__icontains = search) |
                Q(name__icontains = search)
            )[:10]
            serialized = BanksSerializer(model, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })
        
        elif query == 'count':
            total = BanksModel.objects.filter().count()            
            
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
        data = request.data
        
        serializer = AddEditBankSerializer(data = data)
        if not serializer.is_valid():
            return JsonResponse({'success': False, 'resp': serializer.errors}, status = 400)

        serializer.save()

        return JsonResponse({'success': True, 'resp': 'Added successfully.'})

    def put(self, request):
        data = request.data

        data_id = data.get('id', None)

        serializer = GetBankSerializer(data = data)  
        if not serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': serializer.errors
            }, status = 400)    
                
        instance = self.get_object(pk = data_id)     

        serializer = AddEditBankSerializer(instance, data = data)
        if not serializer.is_valid():
            return JsonResponse({'success': False, 'resp': serializer.errors}, status = 400)

        serializer.save()

        return JsonResponse({'success': True, 'resp': 'Edited successfully.'})
    
    def delete(self, request):
        data = request.query_params

        data_id = data.get('id', None)

        serializer = GetBankSerializer(data = data)  
        if not serializer.is_valid():
            return JsonResponse({
                'success': False, 
                'resp': serializer.errors
            }, status = 400)    
                
        instance = self.get_object(pk = data_id)           
        instance.delete()
        
        return JsonResponse({
            'success': True,
            'resp': 'Deleted successfully.'
        }, status = 200)

#Signatures
class ManageSignaturesAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
        
    def post(self, request):
        data = request.data
        signature_buyer = data.get('signature_buyer', None)
        signature_guarantor = data.get('signature_guarantor', None)
        signature_seller = data.get('signature_seller', None)
        sale_id = data.get('sale_id', None)

        with transaction.atomic():
            if signature_buyer and signature_guarantor and signature_seller and sale_id:
                buyer = {
                    'type': 1,
                    'signature': signature_buyer,
                    'sale_id': sale_id
                }
                serializer = AddEditSignatureImageSerializer(data = buyer)
                if not serializer.is_valid():
                    transaction.set_rollback(True)
                    return JsonResponse({'success': False, 'resp': serializer.errors}, status = 400)

                serializer.save()

                guarantor = {
                    'type': 2,
                    'signature': signature_guarantor,
                    'sale_id': sale_id
                }
                serializer = AddEditSignatureImageSerializer(data = guarantor)
                if not serializer.is_valid():
                    transaction.set_rollback(True)
                    return JsonResponse({'success': False, 'resp': serializer.errors}, status = 400)

                serializer.save()

                seller = {
                    'type': 3,
                    'signature': signature_seller,
                    'sale_id': sale_id
                }
                serializer = AddEditSignatureImageSerializer(data = seller)
                if not serializer.is_valid():
                    transaction.set_rollback(True)
                    return JsonResponse({'success': False, 'resp': serializer.errors}, status = 400)

                serializer.save()

                return JsonResponse({'success': True, 'resp': 'Added successfully.'})
        
        transaction.set_rollback(True)
        return JsonResponse({'success': False, 'resp': 'Empty signatures'}, status = 400)

#PDF
class PDFGeneratorAPIView(APIView):
    authentication_classes = []
    permission_classes = []
    
    def get(self, request):
        data = request.query_params
        one = data.get('one', False)
        payment_id = data.get('id', None)

        instance_payment = ManageSalePaymentsAPIView.get_object(payment_id)

        #payment_date_utc = instance_payment.date_reg.strftime('%Y-%m-%dT%H:%M:%SZ')

        instance_sale = instance_payment.sale
        sale_serialized = SalesSerializer(instance_sale).data

        sale_serialized['sale_payments'] = sorted(
            sale_serialized['sale_payments'],
            key = lambda x: x['date_limit']
        )

        for item in sale_serialized['inventory']:
            item['total'] = item['price'] * item['quantity']

        for item in sale_serialized['sale_payments']:
            item['subtotal'] = round(item['subtotal'], 2)
            item['total_without'] = round((item['total'] - item['commission'] - item['surcharge']) + item['discount'], 2)
            item['date_limit_formatted'] = format_date_local(item['date_limit'])

        current_url = request.build_absolute_uri() 

        qr = qrcode.QRCode(
            version = 1,
            error_correction = qrcode.constants.ERROR_CORRECT_L,
            box_size = 10,
            border = 4,
        )
        qr.add_data(current_url)
        qr.make(fit = True)

        qr_img = io.BytesIO()
        img = qr.make_image(fill='black', back_color='white')
        img.save(qr_img, format='PNG')
        qr_img.seek(0)

        qr_base64 = base64.b64encode(qr_img.getvalue()).decode('utf-8')       

        data = {
            'base_url': request.build_absolute_uri('/'),
            'uuid': uuid.uuid4(),
            'payment': instance_payment,
            'payment_date_utc': format_datetime_local(instance_payment.date_reg),
            'sale': sale_serialized,
            'qr': qr_base64,
            'address': ManageSaleReceiptAPIView.get_object_prompter('address'),
            'nit': ManageSaleReceiptAPIView.get_object_prompter('nit'),
            'tel': ManageSaleReceiptAPIView.get_object_prompter('tel'),
            'one': one
        }

        html = render_to_string('pdf/payment.html', context = data)
        #return HttpResponse(html)
        
        pdf_bytes = convert_html_to_pdf(html)
        if pdf_bytes:
            response = HttpResponse(pdf_bytes, content_type='application/pdf')
            response['Content-Disposition'] = 'inline; filename=factura.pdf'
            return response
        
        return JsonResponse({
            'success': False, 
            'resp': 'Error generating PDF.'
        }, status = 500)

#PDF Certificate
class PDFCertificateAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        data = request.query_params
        sale_id = data.get('id', None)

        instance_sale = ManageSalesAPIView.get_object(sale_id)
        inventory_items = instance_sale.inventory_sale.all()

        pdf_path = settings.BASE_DIR / 'api/templates/pdf/certificate.pdf'
        pdf_document = fitz.open(pdf_path)

        coordinates_name = {
            0: (110, 655),
            1: (110, 666),
            2: (110, 655),
            3: (110, 653),
            4: (110, 638),
            5: (110, 638),
            6: (110, 604),
            7: (110, 610),
            8: (110, 622),
        }
        coordinates_date = {
            0: (305, 688),
            1: (305, 699),
            2: (305, 687), 
            3: (305, 687),
            4: (305, 671),
            5: (305, 671),
            6: (305, 638),
            7: (305, 643),
            8: (305, 654),  
        }

        new_pdf = fitz.open()
        
        added_pages = {}
        for item in inventory_items:
            product = item.product
            category = product.category
            page_number = category.page_number - 1 

            if page_number in added_pages:
                continue

            original_page = pdf_document[page_number]

            new_page = new_pdf.new_page(width = original_page.rect.width, height = original_page.rect.height)
            new_page.show_pdf_page(new_page.rect, pdf_document, page_number)

            new_page.insert_text(
                coordinates_name.get(page_number, (110, 655)),
                f'{instance_sale.client.person.firstname} {instance_sale.client.person.middlename} {instance_sale.client.person.lastname} {instance_sale.client.person.second_lastname}',
                fontname='helv',
                fontsize=9,
                color=(0, 0, 0)
            )

            new_page.insert_text(
                coordinates_date.get(page_number, (305, 688)),
                str(instance_sale.date_reg),
                fontname='helv',
                fontsize=9,
                color=(0, 0, 0)
            )

            added_pages[page_number] = True
        
        '''
        for page_number in range(min(pdf_document.page_count, 9)):  # Cambia 9 según el total de páginas
            original_page = pdf_document[page_number]

            # Crea una nueva página en el nuevo documento para cada página del original
            new_page = new_pdf.new_page(width=original_page.rect.width, height=original_page.rect.height)
            new_page.show_pdf_page(new_page.rect, pdf_document, page_number)

            # Inserta el nombre y la fecha en las coordenadas especificadas para esa página
            new_page.insert_text(
                coordinates_name.get(page_number, (110, 655)),
                f'{instance_sale.client.person.firstname} {instance_sale.client.person.middlename} {instance_sale.client.person.lastname} {instance_sale.client.person.second_lastname}',
                fontname='helv',
                fontsize=9,
                color=(0, 0, 0)
            )

            new_page.insert_text(
                coordinates_date.get(page_number, (305, 688)),
                str(instance_sale.date_reg),
                fontname='helv',
                fontsize=9,
                color=(0, 0, 0)
            )
        '''

        pdf_bytes = io.BytesIO()
        new_pdf.save(pdf_bytes)
        pdf_bytes.seek(0)

        pdf_document.close()
        new_pdf.close()

        response = HttpResponse(pdf_bytes, content_type='application/pdf')
        response['Content-Disposition'] = 'inline; filename=certificate_page.pdf'
        return response

#PDF Contract
class PDFContractAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        data = request.query_params
        sale_id = data.get('id', None)

        instance_sale = ManageSalesAPIView.get_object(sale_id)
        inventory_items = instance_sale.inventory_sale.all()
        sale_payments = instance_sale.sale_payments_sale.all()
        addresses = instance_sale.client.person.addresses.all()

        signature_buyer = SignatureImagesModel.objects.filter(sale_id = sale_id, type = 1).first()
        signature_guarantor = SignatureImagesModel.objects.filter(sale_id = sale_id, type = 2).first()
        signature_seller = SignatureImagesModel.objects.filter(sale_id = sale_id, type = 3).first()

        signature_buyer_url = signature_buyer.signature.url if signature_buyer else None
        signature_guarantor_url = signature_guarantor.signature.url if signature_guarantor else None
        signature_seller_url = signature_seller.signature.url if signature_seller else None
        
        data = {
            'base_url': request.build_absolute_uri('/'),
            'uuid': uuid.uuid4(),
            'sale': instance_sale,
            'inventory': inventory_items,
            'sale_payments': sale_payments,
            'addresses': addresses,
            'signature_buyer_url': signature_buyer_url,
            'signature_guarantor_url': signature_guarantor_url,
            'signature_seller_url': signature_seller_url
        }

        html = settings.BASE_DIR / 'api/templates/pdf/contract.html'
        html_content = render_to_string(html, data)
        #return HttpResponse(html_content)

        options = {
            'page-size': 'Letter',
            'margin-top': '0.4in',
            'margin-right': '0.6in',
            'margin-bottom': '0.4in',
            'margin-left': '0.6in',
            'encoding': 'UTF-8'
        }

        pdf = pdfkit.from_string(html_content, False, options = options, configuration = settings.PDFKIT_CONFIG_2)

        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = f'inline; filename="Contract-{sale_id}.pdf"'
        return response
        
#Excel clients
class ExcelClientsAPIView(APIView):
    #authentication_classes = [JWTAuthentication]
    #permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            template_path = settings.BASE_DIR / 'api/templates/excel/pending_clients.xlsx'
            wb = openpyxl.load_workbook(template_path)
            ws = wb.active

            start_row = 5
            total_row = 34

            sales_data = SalesModel.objects.filter(
                status_id = 2
            ).select_related('client')

            for idx, sale in enumerate(sales_data):
                row = start_row + idx
                if row >= total_row:
                    ws.insert_rows(row)
                    total_row += 1

                ws[f'A{row}'] = sale.id
                ws[f'B{row}'] = sale.date_reg.strftime('%Y-%m-%d')
                ws[f'C{row}'] = sale.client.person.firstname + ' ' + sale.client.person.lastname
                ws[f'D{row}'] = sale.total
                
                remaining = ManageSalePaymentsAPIView.get_remaining(sale.id)
                ws[f'E{row}'] = remaining if remaining is not None else 0

            ws[f'D{total_row}'] = f'=SUM(D{start_row}:D{total_row - 1})'
            ws[f'E{total_row}'] = f'=SUM(E{start_row}:E{total_row - 1})'

            output = io.BytesIO()
            wb.save(output)
            output.seek(0)

            response = HttpResponse(
                output,
                content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            response['Content-Disposition'] = 'attachment; filename="pending_clients.xlsx"'
            return response

        except Exception as e:
            return JsonResponse({
                'success': False,
                'resp': f'Error generating Excel'
            }, status=500)
        
#Excel cash register
class ExcelCashRegisterAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            data = request.query_params
            date_1_str = data.get('filters[date_1]', None)
            date_2_str = data.get('filters[date_2]', None)    
            location_id = data.get('filters[location][id]', None)   

            date_1, date_2 = None, None
            if date_1_str:
                date_1 = datetime.strptime(date_1_str, '%Y-%m-%d').date()

            if date_2_str:
                date_2 = datetime.strptime(date_2_str, '%Y-%m-%d').date()

            user = request.user
            template_path = settings.BASE_DIR / 'api/templates/excel/cash_register.xlsx'
            wb = openpyxl.load_workbook(template_path)
            ws = wb.active

            ws['B4'] = user.first_name + ' ' + user.last_name
            
            start_row = 7
            total_row = 25

            cash_register_model = CashRegisterModel.objects.filter()
            b3_date = ''
            if date_1:
                cash_register_model = cash_register_model.filter(date_reg__gte = date_1)
                b3_date = date_1
            
            if date_2:
                cash_register_model = cash_register_model.filter(date_reg__lte = date_2)
                b3_date = f'{b3_date} - {date_2}'

            ws['B3'] = b3_date

            if location_id not in [None,  0, '0']:
                cash_register_model = cash_register_model.filter(location_id = location_id)
            
            for idx, cash_register in enumerate(cash_register_model):
                row = start_row + idx
                if row >= total_row:
                    ws.insert_rows(row)
                    total_row += 1 

                ws[f'A{row}'] = cash_register.no
                ws[f'B{row}'] = cash_register.date_reg.strftime('%Y-%m-%d')
                ws[f'C{row}'] = cash_register.supplier
                ws[f'E{row}'] = cash_register.description     
                ws[f'F{row}'] = cash_register.amount     

            output = io.BytesIO()
            wb.save(output)
            output.seek(0)

            response = HttpResponse(
                output,
                content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            response['Content-Disposition'] = 'attachment; filename="cash_register.xlsx"'
            return response

        except Exception as e:
            return JsonResponse({
                'success': False,
                'resp': f'Error generating Excel'
            }, status=500)
        
#Excel statistics sales
class ExcelStatisticsSalesAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            data = request.query_params
            date_1_str = data.get('filters[date_1]', None)
            date_2_str = data.get('filters[date_2]', None)    

            date_1, date_2 = None, None
            if date_1_str:
                date_1 = datetime.strptime(date_1_str, '%Y-%m-%d').date()

            if date_2_str:
                date_2 = datetime.strptime(date_2_str, '%Y-%m-%d').date()
            
            template_path = settings.BASE_DIR / 'api/templates/excel/statistics_sales.xlsx'
            wb = openpyxl.load_workbook(template_path)
            ws = wb.active
            
            start_row = 93
            total_row = 387

            sale_payments_model = SalePaymentsModel.objects.filter(no__isnull = False)
            if date_1:
                sale_payments_model = sale_payments_model.filter(date_reg__gte = date_1)
            
            if date_2:
                sale_payments_model = sale_payments_model.filter(date_reg__lte = date_2)
            

            sale_payments_model = sale_payments_model.select_related(
                'sale__client__person', 'sale__location', 'sale__status'
            ).prefetch_related('sale__inventory_sale')

            for idx, item in enumerate(sale_payments_model):
                row = start_row + idx
                if row >= total_row:
                    ws.insert_rows(row)
                    total_row += 1 
                
                ws[f'B{row}'] = item.date_reg.strftime('%Y-%m-%d')
                ws[f'C{row}'] = item.no

                if item.sale.status.calculate:
                    ws[f'E{row}'] = item.sale.client.id
                    ws[f'F{row}'] = f'{item.sale.client.person.firstname} {item.sale.client.person.lastname}'
                    ws[f'G{row}'] = item.location.name
                    ws[f'H{row}'] = ' + '.join([inventory.product.name for inventory in item.sale.inventory_sale.all()])
                    
                    if item.sale.type == 2:
                        ws[f'K{row}'] = item.total_remaining + item.subtotal
                    else:
                        ws[f'K{row}'] = item.total

                    ws[f'L{row}'] = item.total                
                    ws[f'N{row}'] = item.payment_method.name
                    ws[f'R{row}'] = item.user.first_name + ' ' + item.user.last_name
                else:
                    ws[f'F{row}'] = item.sale.status.name

            start_row = 6
            total_row = 89

            sales_model = SalesModel.objects.filter().prefetch_related('inventory_sale')
            if date_1:
                sales_model = sales_model.filter(date_reg__gte = date_1)
            
            if date_2:
                sales_model = sales_model.filter(date_reg__lte = date_2)
            
            for idx, sale in enumerate(sales_model):
                row = start_row + idx
                if row >= total_row:
                    ws.insert_rows(row)
                    total_row += 1                     
                
                ws[f'B{row}'] = sale.date_reg.strftime('%Y-%m-%d')
                ws[f'C{row}'] = sale.id

                if sale.status.calculate:
                    ws[f'E{row}'] = sale.client.id
                    ws[f'F{row}'] = f'{sale.client.person.firstname} {sale.client.person.lastname}'
                    ws[f'G{row}'] = sale.location.name
                    ws[f'H{row}'] = 'CRÉDITO' if sale.type == 2 else 'CONTADO'
                    ws[f'I{row}'] = ' + '.join([inventory.product.name for inventory in sale.inventory_sale.all()])
                    ws[f'K{row}'] = sale.total
                    ws[f'R{row}'] = sale.user.first_name + ' ' + sale.user.last_name
                else:
                    ws[f'F{row}'] = sale.status.name

            output = io.BytesIO()
            wb.save(output)
            output.seek(0)

            response = HttpResponse(
                output,
                content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            response['Content-Disposition'] = 'attachment; filename="statistics_sales.xlsx"'
            return response

        except Exception as e:
            return JsonResponse({
                'success': False,
                'resp': f'Error generating Excel'
            }, status=500)