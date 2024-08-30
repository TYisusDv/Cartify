from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    #TokenRefreshView,
)
from django.http import JsonResponse
from django.contrib.auth import authenticate, login

from .serializers import (
    LogInSerializer
)

class LoginInAPIView(APIView):
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
            return JsonResponse({'success': False, 'resp': 'Incorrect user or password.'}, status = 401)
        
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