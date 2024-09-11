from rest_framework import serializers
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.core.validators import FileExtensionValidator
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

#Countries
class CountriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = CountriesModel
        fields = '__all__'

#States
class StatesSerializer(serializers.ModelSerializer):
    country =  CountriesSerializer(read_only = True)

    class Meta:
        model = StatesModel
        fields = '__all__'

#Cities
class CitiesSerializer(serializers.ModelSerializer):
    state =  StatesSerializer(read_only = True)

    class Meta:
        model = CitiesModel
        fields = '__all__'

#Addresses
class AddressesSerializer(serializers.ModelSerializer):
    city =  CitiesSerializer(read_only = True)

    class Meta:
        model = AddressesModel
        fields = '__all__'

class AddAddressesSerializer(serializers.ModelSerializer):
    street = serializers.CharField(error_messages = {
        'required': 'The street is required.',
        'blank': 'The street cannot be blank.',
        'null': 'The street cannot be blank.',
        'max_length': 'The street cannot exceed 100 characters.',
    }, max_length = 100)

    area = serializers.CharField(error_messages = {
        'required': 'The area is required.',
        'blank': 'The area cannot be blank.',
        'null': 'The area cannot be blank.',
        'max_length': 'The area cannot exceed 50 characters.',
    }, max_length = 50, allow_blank = True, allow_null = True)

    city_id = serializers.IntegerField(error_messages = {
        'required': 'The city is required.',
        'blank': 'The city cannot be blank.',
        'null': 'The city cannot be blank.',
        'invalid': 'The city is invalid.',
    })
    
    def create(self, validated_data):
        try: 
            return super().create(validated_data)
        except IntegrityError as e:
            raise serializers.ValidationError(f'An ocurred has error! City not found. {e}')
    
    class Meta:
        model = AddressesModel
        fields = ['street', 'area', 'city_id']

#Person
class PersonSerializer(serializers.ModelSerializer):
    addresses =  AddressesSerializer(many = True, read_only = True)

    class Meta:
        model = PersonsModel
        fields = '__all__'

class AddPersonSerializer(serializers.ModelSerializer):
    identification_id = serializers.CharField(error_messages = {
        'required': 'The identification is required.',
        'blank': 'The identification cannot be blank.',
        'null': 'The identification cannot be blank.',
        'max_length': 'The identification cannot exceed 100 characters.',
    }, max_length = 100)

    profile_picture = serializers.ImageField(error_messages = {
            'required': 'The profile picture is required.',
            'blank': 'The profile picture cannot be blank.',
            'null': 'The profile picture cannot be blank.',
            'invalid': 'The profile picture is invalid.',
        }, validators=[
            FileExtensionValidator(allowed_extensions = ['jpg', 'jpeg', 'png'])
        ], 
        allow_null = True
    )

    identification_pictures = serializers.ListField(
        child=serializers.ImageField(
            error_messages={
                'invalid': 'One or more identification pictures are invalid.',
            },
            validators=[
                FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])
            ],
        ),
        allow_empty=True,
        allow_null=True
    )

    alias = serializers.CharField(error_messages = {
        'required': 'The alias is required.',
        'blank': 'The alias cannot be blank.',
        'null': 'The alias cannot be blank.',
        'max_length': 'The alias cannot exceed 50 characters.',
    }, max_length = 50,  allow_blank = True, allow_null = True)

    occupation = serializers.CharField(error_messages = {
        'required': 'The occupation is required.',
        'blank': 'The occupation cannot be blank.',
        'null': 'The occupation cannot be blank.',
        'max_length': 'The occupation cannot exceed 50 characters.',
    }, max_length = 50, allow_blank = True, allow_null = True)

    firstname = serializers.CharField(error_messages = {
        'required': 'The firstname is required.',
        'blank': 'The firstname cannot be blank.',
        'null': 'The firstname cannot be blank.',
        'max_length': 'The firstname cannot exceed 50 characters.',
    }, max_length = 50)

    middlename = serializers.CharField(error_messages = {
        'required': 'The middlename is required.',
        'blank': 'The middlename cannot be blank.',
        'null': 'The middlename cannot be blank.',
        'max_length': 'The middlename cannot exceed 50 characters.',
    }, max_length = 50, allow_blank = True, allow_null = True)

    lastname = serializers.CharField(error_messages = {
        'required': 'The lastname is required.',
        'blank': 'The lastname cannot be blank.',
        'null': 'The lastname cannot be blank.',
        'max_length': 'The lastname cannot exceed 50 characters.',
    }, max_length = 50)

    second_lastname = serializers.CharField(error_messages = {
        'required': 'The second_lastname is required.',
        'blank': 'The second_lastname cannot be blank.',
        'null': 'The second_lastname cannot be blank.',
        'max_length': 'The second_lastname cannot exceed 50 characters.',
    }, max_length = 50, allow_blank = True, allow_null = True)

    mobile = serializers.CharField(error_messages = {
        'required': 'The mobile is required.',
        'blank': 'The mobile cannot be blank.',
        'null': 'The mobile cannot be blank.',
        'max_length': 'The mobile cannot exceed 20 characters.',
    }, max_length = 20, allow_blank = True, allow_null = True)

    phone = serializers.CharField(error_messages = {
        'required': 'The phone is required.',
        'blank': 'The phone cannot be blank.',
        'null': 'The phone cannot be blank.',
        'max_length': 'The phone cannot exceed 20 characters.',
    }, max_length = 20, allow_blank = True, allow_null = True)

    birthdate = serializers.DateField(error_messages = {
        'required': 'The birthdate is required.',
        'blank': 'The birthdate cannot be blank.',
        'null': 'The birthdate cannot be blank.',
        'invalid': 'The birthdate is invalid.',
    }, allow_null = True, required = False)

    type_id_id = serializers.IntegerField(error_messages = {
        'required': 'The type identification is required.',
        'blank': 'The type identification cannot be blank.',
        'null': 'The type identification cannot be blank.',
        'invalid': 'The type identification is invalid.',
    })

    def create(self, validated_data):
        try:
            identification_pictures = validated_data.pop('identification_pictures', [])
            person_instance = super().create(validated_data)

            for picture in identification_pictures:
                IdentificationPictures.objects.create(person = person_instance, image = picture)

            return person_instance
        except IntegrityError as e:
            raise serializers.ValidationError('An error occurred! Type identification or person not found.')
    
    class Meta:
        model = PersonsModel
        fields = ['identification_id', 'profile_picture', 'identification_pictures', 'alias', 'occupation', 'firstname', 'middlename', 'lastname', 'second_lastname', 'mobile', 'phone', 'birthdate', 'type_id_id']

#Client types
class ClientTypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientTypesModel
        fields = '__all__'

#Clients
class ClientsSerializer(serializers.ModelSerializer):
    person = PersonSerializer(read_only = True)

    class Meta:
        model = ClientsModel
        fields = '__all__'

class AddClientSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(error_messages = {
        'required': 'The email is required.',
        'blank': 'The email cannot be blank.',
        'null': 'The email cannot be blank.',
        'max_length': 'The email cannot exceed 50 characters.',
    }, allow_blank = True, allow_null = True)

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

    type_id = serializers.IntegerField(error_messages = {
        'required': 'The class client is required.',
        'blank': 'The class client cannot be blank.',
        'null': 'The class client cannot be blank.',
        'invalid': 'The class client is invalid.',
    }, allow_null = True)

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
        fields = ['email', 'allow_credit', 'note', 'location_id', 'type_id', 'person_id']

class DeleteClientSerializer(serializers.ModelSerializer):    
    id = serializers.IntegerField(error_messages = {
        'required': 'The client is required.',
        'blank': 'The client cannot be blank.',
        'null': 'The client cannot be blank.',
        'invalid': 'The client is invalid.',
    })
    
    class Meta:
        model = ClientsModel
        fields = ['id']

#Contact types
class ContactTypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactTypesModel
        fields = '__all__'

#Locations
class LocationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationsModel
        fields = '__all__'

#Types Ids
class TypesIdsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypesIdsModel
        fields = '__all__'