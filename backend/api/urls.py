from django.urls import path, include
from .views import *

urlpatterns = [
    path('auth/log-in', LoginInAPIView.as_view(), name='auth-log-in'),
    path('manage/clients', ManageClientsAPIView.as_view(), name='manage-clients'),
    path('manage/locations', ManageLocationsAPIView.as_view(), name='manage-locations'),
    path('manage/typesofids', ManageTypesOfIdsAPIView.as_view(), name='manage-typesofids'),
]