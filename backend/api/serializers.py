from rest_framework import serializers
from django.contrib.auth.models import User
from django.db import IntegrityError
from .models import *

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

class AddPersonSerializer(serializers.ModelSerializer):
    identification_id = serializers.CharField(error_messages = {
        'required': 'The identification is required.',
        'blank': 'The identification cannot be blank.',
        'null': 'The identification cannot be blank.',
        'max_length': 'The identification cannot exceed 100 characters.',
    }, max_length = 100)

    alias = serializers.CharField(error_messages = {
        'required': 'The alias is required.',
        'blank': 'The alias cannot be blank.',
        'null': 'The alias cannot be blank.',
        'max_length': 'The alias cannot exceed 100 characters.',
    }, max_length = 50, allow_blank = True, allow_null = True)

    firstname = serializers.CharField(error_messages = {
        'required': 'The firstname is required.',
        'blank': 'The firstname cannot be blank.',
        'null': 'The firstname cannot be blank.',
        'max_length': 'The firstname cannot exceed 100 characters.',
    }, max_length = 50)

    middlename = serializers.CharField(error_messages = {
        'required': 'The middlename is required.',
        'blank': 'The middlename cannot be blank.',
        'null': 'The middlename cannot be blank.',
        'max_length': 'The middlename cannot exceed 100 characters.',
    }, max_length = 50, allow_blank = True, allow_null = True)

    lastname = serializers.CharField(error_messages = {
        'required': 'The lastname is required.',
        'blank': 'The lastname cannot be blank.',
        'null': 'The lastname cannot be blank.',
        'max_length': 'The lastname cannot exceed 100 characters.',
    }, max_length = 50)

    second_lastname = serializers.CharField(error_messages = {
        'required': 'The second_lastname is required.',
        'blank': 'The second_lastname cannot be blank.',
        'null': 'The second_lastname cannot be blank.',
        'max_length': 'The second_lastname cannot exceed 100 characters.',
    }, max_length = 50, allow_blank = True, allow_null = True)

    mobile = serializers.CharField(error_messages = {
        'required': 'The mobile is required.',
        'blank': 'The mobile cannot be blank.',
        'null': 'The mobile cannot be blank.',
        'max_length': 'The mobile cannot exceed 100 characters.',
    }, max_length = 20, allow_blank = True, allow_null = True)

    phone = serializers.CharField(error_messages = {
        'required': 'The class is required.',
        'blank': 'The class cannot be blank.',
        'null': 'The class cannot be blank.',
        'max_length': 'The class cannot exceed 100 characters.',
    }, max_length = 20, allow_blank = True, allow_null = True)

    birthdate = serializers.DateField(error_messages = {
        'required': 'The birthdate is required.',
        'blank': 'The birthdate cannot be blank.',
        'null': 'The birthdate cannot be blank.',
        'invalid': 'The birthdate is invalid.',
    }, allow_null = True, required = False)

    type_of_ids_id = serializers.IntegerField(error_messages = {
        'required': 'The type of identification is required.',
        'blank': 'The type of identification cannot be blank.',
        'null': 'The type of identification cannot be blank.',
        'invalid': 'The type of identification is invalid.',
    })

    def create(self, validated_data):
        try: 
            return super().create(validated_data)
        except IntegrityError as e:
            raise serializers.ValidationError('An ocurred has error! Type of identification or person not found.')
    
    class Meta:
        model = PersonsModel
        fields = ['identification_id', 'alias', 'firstname', 'middlename', 'lastname', 'second_lastname', 'mobile', 'phone', 'birthdate', 'type_of_ids_id']

class AddClientSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(error_messages = {
        'required': 'The email is required.',
        'blank': 'The email cannot be blank.',
        'null': 'The email cannot be blank.',
        'max_length': 'The email cannot exceed 50 characters.',
    }, allow_blank = True, allow_null = True)

    client_class = serializers.CharField(error_messages = {
        'required': 'The class is required.',
        'blank': 'The class cannot be blank.',
        'null': 'The class cannot be blank.',
        'max_length': 'The class cannot exceed 100 characters.',
    }, max_length = 100, allow_blank = True, allow_null = True)

    allow_credit = serializers.BooleanField(error_messages = {
        'required': 'The allow credit is required.',
        'blank': 'The allow credit cannot be blank.',
        'null': 'The allow credit cannot be blank.',
        'invalid': 'The allow credit is invalid.',
    }, default = True)

    note = serializers.CharField(error_messages = {
        'required': 'The note is required.',
        'blank': 'The note cannot be blank.',
        'null': 'The note cannot be blank.',
        'max_length': 'The note cannot exceed 100 characters.',
    }, max_length = 100, allow_blank = True, allow_null = True)

    location_id = serializers.IntegerField(error_messages = {
        'required': 'The location is required.',
        'blank': 'The location cannot be blank.',
        'null': 'The location cannot be blank.',
        'invalid': 'The location is invalid.',
    })

    person_id = serializers.IntegerField(error_messages = {
        'required': 'The person is required.',
        'blank': 'The person cannot be blank.',
        'null': 'The person cannot be blank.',
        'invalid': 'The person is invalid.',
    })
    
    def create(self, validated_data):
        try: 
            return super().create(validated_data)
        except IntegrityError as e:
            raise serializers.ValidationError(f'An ocurred has error! Location or person not found. {e}')
    
    class Meta:
        model = ClientsModel
        fields = ['email', 'client_class', 'allow_credit', 'note', 'location_id', 'person_id']

class LocationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationsModel
        fields = '__all__'

class TypesOfIdsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypesOfIdsModel
        fields = '__all__'