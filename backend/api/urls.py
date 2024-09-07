from django.urls import path, include
from .views import *

urlpatterns = [
    path('auth/log-in', LoginAPIView.as_view(), name='auth-log-in'),
    path('auth/refresh', AuthRefreshAPIView.as_view(), name='auth-log-in'),
    path('manage/clients', ManageClientsAPIView.as_view(), name='manage-clients'),
    path('manage/locations', ManageLocationsAPIView.as_view(), name='manage-locations'),
    path('manage/typesofids', ManageTypesOfIdsAPIView.as_view(), name='manage-typesofids'),
    path('manage/countries', ManageCountriesAPIView.as_view(), name='manage-countries'),
    path('manage/states', ManageStatesAPIView.as_view(), name='manage-states'),
    path('manage/cities', ManageCitiesAPIView.as_view(), name='manage-cities'),
]