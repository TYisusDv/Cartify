from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import *

urlpatterns = [
    path('auth/log-in', LoginAPIView.as_view(), name='auth-log-in'),
    path('auth/refresh', AuthRefreshAPIView.as_view(), name='auth-log-in'),
    path('manage/countries', ManageCountriesAPIView.as_view(), name='manage-countries'),
    path('manage/states', ManageStatesAPIView.as_view(), name='manage-states'),
    path('manage/cities', ManageCitiesAPIView.as_view(), name='manage-cities'),
    path('manage/typesids', ManageTypesIdsAPIView.as_view(), name='manage-typesids'),
    path('manage/locations', ManageLocationsAPIView.as_view(), name='manage-locations'),
    path('manage/clienttypes', ManageClientTypesAPIView.as_view(), name='manage-clienttypes'),
    path('manage/clients', ManageClientsAPIView.as_view(), name='manage-clients'),
    path('manage/contacttypes', ManageContactTypesAPIView.as_view(), name='manage-contacttypes'),
    path('manage/suppliers', ManageSuppliersAPIView.as_view(), name='manage-suppliers'),
] + static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)