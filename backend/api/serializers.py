from rest_framework import serializers
from django.contrib.auth.models import User

class LogInSerializer(serializers.ModelSerializer):
    username = serializers.CharField(error_messages = {
        'required': 'The username is required. Please provide a valid username.',
        'blank': 'The username cannot be blank. Please provide a valid username.',
        'null': 'The username cannot be blank. Please provide a valid username.',
    })

    password = serializers.CharField(error_messages = {
        'required': 'The password is required. Please provide a valid password.',
        'blank': 'The password cannot be blank. Please provide a valid password.',
        'null': 'The password cannot be blank. Please provide a valid password.',
        'invalid': 'The password is invalid. Please provide a valid password.',
    })

    class Meta:
        model = User
        fields = ['username', 'password']
