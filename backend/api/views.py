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
import uuid, qrcode, io

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
        data = request.query_params
        query = data.get('query', None)
        search = data.get('search', '')
        page_number = request.query_params.get('page', 1)
        order_by = request.query_params.get('order_by', 'id').replace('.', '__')
        order = request.query_params.get('order', 'desc')
        show = request.query_params.get('show', 10)

        if query == 'table':   
            model = ClientsModel.objects.filter(
                Q(id__icontains = search)
            )

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

            person_serializer = AddEditPersonSerializer(data = person)
            if not person_serializer.is_valid():
                transaction.set_rollback(True)
                return JsonResponse({'success': False, 'resp': person_serializer.errors}, status = 400)

            person_instance = person_serializer.save()

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

            client_serializer = GetClientSerializer(data = data)  
            if not client_serializer.is_valid():
                transaction.set_rollback(True)
                return JsonResponse({
                    'success': False, 
                    'resp': client_serializer.errors
                }, status = 400)    
                    
            client_instance = self.get_object(pk = data_id)  
            person_instance = client_instance.person   

            person = data.get('person', {})

            person_serializer = AddEditPersonSerializer(person_instance, data = person)
            if not person_serializer.is_valid():
                transaction.set_rollback(True)
                return JsonResponse({'success': False, 'resp': person_serializer.errors}, status = 400)

            person_serializer.save()

            data['person_id'] = person_instance.id

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
            model = ProductBrandsModel.objects.filter(
                Q(id__icontains = search) |
                Q(name__icontains = search)
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
            model = InventoryTypesModel.objects.filter(
                Q(id__icontains = search)
            )

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

        if query == 'table':   
            type_id = request.query_params.get('type[id]', None)
            product_id = request.query_params.get('product[id]', None)
            location_id = request.query_params.get('location[id]', None)

            model = InventoryModel.objects.filter(
                Q(id__icontains = search),
                type__type__in = [1, 2]
            )
            
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

            model = InventoryModel.objects.filter(
                Q(id__icontains = search),
                type__type = 3
            )
            
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
            total = InventoryModel.objects.filter(type__type__in = [1, 2]).count()
            
            return JsonResponse({
                'success': True,
                'resp': {
                    'total': total
                }
            })    

        elif query == 'count_transfer':
            total = InventoryModel.objects.filter(type__type = 3).count()
            
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
            model = PaymentMethodsModel.objects.filter(
                Q(id__icontains = search)
            )

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
        data_id = data.get('id', None)
        search = data.get('search', '')
        page_number = request.query_params.get('page', 1)
        order_by = request.query_params.get('order_by', 'id').replace('.', '__')
        order = request.query_params.get('order', 'desc')
        show = request.query_params.get('show', 10)

        if query == 'table':
            type = request.query_params.get('type', None)   
           
            model = SalePaymentsModel.objects.filter(
                Q(id__icontains = search),
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
        
        if query == 'table': 
            if other in [1, '1']:
                overdue_sales = SalePaymentsModel.objects.filter(
                    Q(total__lt=F('subtotal')) | Q(total__isnull = True),
                    date_limit__lt = timezone.now()
                ).values_list('sale_id', flat = True)
                model = SalesModel.objects.filter(id__in = overdue_sales)
            else:          
                model = SalesModel.objects.filter(
                    Q(id__icontains = search) |
                    Q(client__person__firstname__icontains = search) |
                    Q(client__person__lastname__icontains = search)
                )

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
                quantity_of_payments = int(quantity_of_payments) - 1
                date_limit = timezone.now()
                for i in range(quantity_of_payments):
                    item_sale_payment = {}
                    item_sale_payment['subtotal'] = (sale_instance.total - sale_payment.get('subtotal', 0)) / quantity_of_payments
                    item_sale_payment['sale_id'] = sale_instance.id
                    
                    if(int(payment_days) == 30 or int(payment_days) == 31):
                        date_limit += relativedelta(months = 1)
                    else:
                        date_limit += timedelta(days = payment_days)

                    item_sale_payment['date_limit'] = date_limit

                    item_sale_payment_serializer = AddEditSalePaymentSerializer(data = item_sale_payment)
                    if not item_sale_payment_serializer.is_valid():
                        transaction.set_rollback(True)
                        return JsonResponse({'success': False, 'resp': item_sale_payment_serializer.errors}, status = 400)

                    item_sale_payment_serializer.save()

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
            model = SaleReceiptModel.objects.filter(
                Q(id__icontains = search)
            )

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
            model = SaleStatusModel.objects.filter(
                Q(id__icontains = search)
            )

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
            model = CashRegisterModel.objects.filter(
                Q(id__icontains = search)
            )

            if date_1_str:
                model = model.filter(date_reg__gte = date_1)
            
            if date_2_str:
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
            
            if date_1_str:
                model = model.filter(date_reg__gte = date_1)
            
            if date_2_str:
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
            model = SalesModel.objects.filter(
                Q(id__icontains = search)
            )

            if date_1_str:
                model = model.filter(date_reg__gte = date_1)
            
            if date_2_str:
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
            model = SalePaymentsModel.objects.filter(
                Q(id__icontains = search),
                total__gt = 0
            )

            if date_1_str:
                model = model.filter(date_reg__gte = date_1)
            
            if date_2_str:
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
            
            if date_1_str:
                model = model.filter(date_reg__gte = date_1)
            
            if date_2_str:
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
            
            if date_1_str:
                model = model.filter(date_reg__gte = date_1)
            
            if date_2_str:
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

            if date_1_str:
                model = model.filter(date_reg__gte = date_1)
            
            if date_2_str:
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

            if date_1_str:
                model = model.filter(date_reg__gte = date_1)
            
            if date_2_str:
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