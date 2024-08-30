from django.urls import path, include
from .views import (
    LoginInAPIView
)

urlpatterns = [
    path('auth/log-in', LoginInAPIView.as_view(), name='auth-log-in'),
]