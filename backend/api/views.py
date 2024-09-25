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
        query = request.query_params.get('query', None)
        search = request.query_params.get('search', '')
        
        if query == 'list':
            model = StatesModel.objects.filter(
                Q(id__icontains = search) |
                Q(name__icontains = search)
            )[:10]
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
        query = request.query_params.get('query', None)
        search = request.query_params.get('search', '')
        
        if query == 'list':
            model = CitiesModel.objects.filter(
                Q(id__icontains = search) |
                Q(name__icontains = search)
            )[:10]
            serialized = CitiesSerializer(model, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })

#Locations
class ManageLocationsAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
  
    def get(self, request):
        query = request.query_params.get('query', None)
        search = request.query_params.get('search', '')
        
        if query == 'list':
            model = LocationsModel.objects.filter(
                Q(id__icontains = search) |
                Q(name__icontains = search)
            )[:10]
            serialized = LocationsSerializer(model, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })

#Types ids
class ManageTypesIdsAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
  
    def get(self, request):
        query = request.query_params.get('query', None)
        search = request.query_params.get('search', '')
        
        if query == 'list':
            model = TypesIdsModel.objects.filter(
                Q(id__icontains = search) |
                Q(name__icontains = search)
            )[:10]
            serialized = TypesIdsSerializer(model, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })

#Client types    
class ManageClientTypesAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
  
    def get(self, request):
        query = request.query_params.get('query', None)
        search = request.query_params.get('search', '')
        
        if query == 'list':
            model = ClientTypesModel.objects.filter(
                Q(id__icontains = search) |
                Q(name__icontains = search)
            )[:10]
            serialized = ClientTypesSerializer(model, many = True)
            
            return JsonResponse({
                'success': True,
                'resp': serialized.data
            })

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
        query = request.query_params.get('query', None)
        search = request.query_params.get('search', '')
        page_number = request.query_params.get('page', 1)
        order_by = request.query_params.get('order_by', 'id').replace('.', '__')
        order = request.query_params.get('order', 'desc')
        show = request.query_params.get('show', 10)
        
        if query == 'table':           
            if order_by == 'actions':
                order_by = 'id'

            model = ClientsModel.objects.filter(
                Q(id__icontains = search)
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
            client = ClientsModel.objects.select_related('person').prefetch_related('person__identification_images').prefetch_related('contacts').get(pk = client_id)
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
                'profile_image': request.FILES.get('profile_image'),
                'identification_images': [request.FILES[key] for key in request.FILES if key.startswith('identification_images[')]
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
                'profile_image': request.FILES.get('profile_image'),
                'identification_images': [request.FILES[key] for key in request.FILES if key.startswith('identification_images[')]
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
            if order_by == 'actions':
                order_by = 'id'

            model = SuppliersModel.objects.filter(
                Q(id__icontains = search)
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
            if order_by == 'actions':
                order_by = 'id'

            model = TaxesModel.objects.filter(
                Q(id__icontains = search)
            )

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
            if order_by == 'actions':
                order_by = 'id'

            model = ProductBrandsModel.objects.filter(
                Q(id__icontains = search)
            )

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
            if order_by == 'actions':
                order_by = 'id'

            model = ProductCategoriesModel.objects.filter(
                Q(id__icontains = search)
            )

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

        if query == 'table':   
            brand_id = request.query_params.get('brand[id]', None)
            category_id = request.query_params.get('category[id]', None)

            if order_by == 'actions':
                order_by = 'id'

            model = ProductsModel.objects.filter(
                Q(id__icontains = search) |
                Q(name__icontains = search) |
                Q(model__icontains = search)
            )

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

#Inventory
class AppInventoryAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk) :
        try:
            return InventoryModel.objects.get(pk = pk)
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

        if query == 'table':   
            if order_by == 'actions':
                order_by = 'id'

            model = InventoryModel.objects.filter(
                Q(id__icontains = search)
            )

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
            total = InventoryModel.objects.count()
            visible = InventoryModel.objects.filter(status = 1).count()
            hidden = InventoryModel.objects.filter(status = 0).count()  
            
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
        with transaction.atomic():
            user_id = request.user.id
            data = request.data
            
            movements = data.get('movements', [])            
            for movement in movements:
                movement['user_id'] = user_id

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