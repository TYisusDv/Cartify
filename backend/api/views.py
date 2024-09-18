from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer
)
from django.http import Http404, JsonResponse
from django.contrib.auth import authenticate, login
from django.db import transaction
from django.db.models import Q
from django.core.paginator import Paginator
from .serializers import *
from .models import *
from .utils import *

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
    
    def get_object(self, pk) :
        try:
            return ClientsModel.objects.get(pk = pk)
        except ClientsModel.DoesNotExist:
            raise Http404('Client not found.')
        
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
            client = ClientsModel.objects.select_related('person').prefetch_related('person__identification_pictures').prefetch_related('contacts').get(pk = client_id)
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

            try:
                person = parse_json(request, 'person', '{}')
                contacts = parse_json(request, 'contacts', '[]')
            except ValueError as e:
                return JsonResponse({'success': False, 'resp': str(e)}, status=400)

            person.update({
                'profile_picture': request.FILES.get('profile_picture'),
                'identification_pictures': [request.FILES[key] for key in request.FILES if key.startswith('identification_pictures[')]
            })

            person_serializer = AddEditPersonSerializer(data=person)
            if not person_serializer.is_valid():
                transaction.set_rollback(True)
                return JsonResponse({'success': False, 'resp': person_serializer.errors}, status=400)

            person_instance = person_serializer.save()
            data['person_id'] = person_instance.id

            address = person.get('addresses', [])[0]

            city = address.get('city', {})
            city_name = city.get('name', '')

            state = city.get('state', {})
            state_name = state.get('name', '')

            country = state.get('country', {})
            country_id = country.get('id', None)

            if not city_name:
                transaction.set_rollback(True)
                return JsonResponse({'success': False, 'resp': 'City is required'}, status=400)

            if not state_name:
                transaction.set_rollback(True)
                return JsonResponse({'success': False, 'resp': 'State is required'}, status=400)
            
            if not country_id:
                transaction.set_rollback(True)
                return JsonResponse({'success': False, 'resp': 'Country is required'}, status=400)            

            country_instance, _ = CountriesModel.objects.get_or_create(id=country_id)
            state_instance, _ = StatesModel.objects.get_or_create(
                name=state_name.capitalize(),
                country=country_instance
            )
            city_instance, _ = CitiesModel.objects.get_or_create(
                name=city_name.capitalize(),
                state=state_instance
            )

            address['city']['id'] = city_instance.id
            address['person'] = {}
            address['person']['id'] = person_instance.id

            address_serializer = AddEditAddressesSerializer(data=address, partial=True)
            if not address_serializer.is_valid():
                transaction.set_rollback(True)
                return JsonResponse({'success': False, 'resp': address_serializer.errors}, status=400)
            
            address_instance = address_serializer.save()

            client_serializer = AddEditClientSerializer(data=data)
            if not client_serializer.is_valid():
                transaction.set_rollback(True)
                return JsonResponse({'success': False, 'resp': client_serializer.errors}, status=400)

            client_instance = client_serializer.save()

            for contact in contacts:
                contact['client_id'] = client_instance.id
                contact_serializer = AddClientContactSerializer(data=contact)
                if not contact_serializer.is_valid():
                    transaction.set_rollback(True)
                    return JsonResponse({'success': False, 'resp': contact_serializer.errors}, status=400)
                contact_serializer.save()

            return JsonResponse({'success': True, 'resp': 'Added successfully.'})

    def put(self, request):
        with transaction.atomic():
            data = request.data.copy()

            client_id = request.data.get('id', None) 
            client_instance = self.get_object(client_id)
            person_instance = client_instance.person 
            
            try:
                person = parse_json(request, 'person', '{}')
                contacts = parse_json(request, 'contacts', '[]')
            except ValueError as e:
                return JsonResponse({'success': False, 'resp': str(e)}, status = 400)

            person.update({
                'profile_picture': request.FILES.get('profile_picture'),
                'identification_pictures': [request.FILES[key] for key in request.FILES if key.startswith('identification_pictures[')]
            })

            person_serializer = AddEditPersonSerializer(person_instance, data = person)
            if not person_serializer.is_valid():
                transaction.set_rollback(True)
                return JsonResponse({'success': False, 'resp': person_serializer.errors}, status = 400)

            person_instance = person_serializer.save()
            data['person_id'] = person_instance.id

            address = person.get('addresses', [])[0]

            city = address.get('city', {})
            city_name = city.get('name', '')

            state = city.get('state', {})
            state_name = state.get('name', '')

            country = state.get('country', {})
            country_id = country.get('id', None)

            if not city_name:
                transaction.set_rollback(True)
                return JsonResponse({'success': False, 'resp': 'City is required'}, status = 400)

            if not state_name:
                transaction.set_rollback(True)
                return JsonResponse({'success': False, 'resp': 'State is required'}, status = 400)
            
            if not country_id:
                transaction.set_rollback(True)
                return JsonResponse({'success': False, 'resp': 'country is required'}, status = 400)            

            country_instance, _ = CountriesModel.objects.get_or_create(id = country_id)
            state_instance, _ = StatesModel.objects.get_or_create(
                name = state_name.capitalize(),
                country = country_instance
            )
            city_instance, _ = CitiesModel.objects.get_or_create(
                name = city_name.capitalize(),
                state = state_instance
            )
            
            address['city']['id'] = city_instance.id

            first_address = AddressesModel.objects.filter(person = person_instance).first()
            address_serializer = AddEditAddressesSerializer(first_address, data = address, partial = True)
            if not address_serializer.is_valid():
                transaction.set_rollback(True)
                return JsonResponse({
                    'success': False,
                    'resp': address_serializer.errors
                }, status = 400)
            
            address_serializer.save()

            client_serializer = AddEditClientSerializer(client_instance, data = data)
            if not client_serializer.is_valid():
                transaction.set_rollback(True)
                return JsonResponse({
                    'success': False,
                    'resp': client_serializer.errors
                }, status = 400)

            client_serializer.save()  

            existing_contacts = list(ClientContactsModel.objects.filter(client = client_instance))
            new_contacts = contacts

            existing_contact_ids = [contact.id for contact in existing_contacts]
            new_contact_ids = [contact.get('id') for contact in new_contacts if contact.get('id')]

            for existing_contact in existing_contacts:
                if existing_contact.id not in new_contact_ids:
                    existing_contact.delete()

            for contact in new_contacts:
                contact_id = contact.get('id', None)
                contact['client_id'] = client_instance.id

                if contact_id and contact_id in existing_contact_ids:
                    existing_contact_instance = ClientContactsModel.objects.get(id = contact_id)
                    contact_serializer = AddClientContactSerializer(existing_contact_instance, data = contact, partial = True)
                    if not contact_serializer.is_valid():
                        transaction.set_rollback(True)
                        return JsonResponse({'success': False, 'resp': contact_serializer.errors}, status = 400)
                    
                    contact_serializer.save()
                else:
                    contact_serializer = AddClientContactSerializer(data = contact)
                    if not contact_serializer.is_valid():
                        transaction.set_rollback(True)
                        return JsonResponse({'success': False, 'resp': contact_serializer.errors}, status = 400)
                    
                    contact_serializer.save() 

            return JsonResponse({'success': True, 'resp': 'Edited successfully.'})
    
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

        if query == 'table':
            search_query = request.query_params.get('search', '')
            page_number = request.query_params.get('page', 1)
            order_by = request.query_params.get('order_by', 'id')
            order = request.query_params.get('order', 'desc')
            show = request.query_params.get('show', 10)
            
            if order_by == 'actions':
                order_by = 'id'

            model = SuppliersModel.objects.filter(
                Q(id__icontains = search_query)
            )

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