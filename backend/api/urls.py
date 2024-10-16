from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import *

urlpatterns = [
    path('auth/log-in', LoginAPIView.as_view(), name='auth-log-in'),
    path('auth/refresh', AuthRefreshAPIView.as_view(), name='auth-log-in'),
    path('app/inventory', AppInventoryAPIView.as_view(), name='app-inventory'),
    path('manage/users', ManageUsersAPIView.as_view(), name='manage-users'),
    path('manage/countries', ManageCountriesAPIView.as_view(), name='manage-countries'),
    path('manage/states', ManageStatesAPIView.as_view(), name='manage-states'),
    path('manage/cities', ManageCitiesAPIView.as_view(), name='manage-cities'),
    path('manage/typesids', ManageTypesIdsAPIView.as_view(), name='manage-typesids'),
    path('manage/locations', ManageLocationsAPIView.as_view(), name='manage-locations'),
    path('manage/clienttypes', ManageClientTypesAPIView.as_view(), name='manage-clienttypes'),
    path('manage/clients', ManageClientsAPIView.as_view(), name='manage-clients'),
    path('manage/contacttypes', ManageContactTypesAPIView.as_view(), name='manage-contacttypes'),
    path('manage/suppliers', ManageSuppliersAPIView.as_view(), name='manage-suppliers'),
    path('manage/taxes', ManageTaxesAPIView.as_view(), name='manage-taxes'),
    path('manage/product/brands', ManageProductBrandsAPIView.as_view(), name='manage-product-brands'),
    path('manage/product/categories', ManageProductCategoriesAPIView.as_view(), name='manage-product-categories'),
    path('manage/products', ManageProductsAPIView.as_view(), name='manage-products'),
    path('manage/inventory/types', ManageInventoryTypesAPIView.as_view(), name='manage-inventory-types'),
    path('manage/paymentmethods', ManagePaymentMethodsAPIView.as_view(), name='manage-paymentmethods'),
    path('manage/sales', ManageSalesAPIView.as_view(), name='manage-sales'),
    path('manage/sale/payments', ManageSalePaymentsAPIView.as_view(), name='manage-sale-payments'),
    path('pdf/payment', PDFGeneratorAPIView.as_view(), name='pdf-payment'),
] + static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)