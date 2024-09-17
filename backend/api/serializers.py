from rest_framework import serializers
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.core.validators import FileExtensionValidator
from .models import *
import json

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

#Types Ids
class TypesIdsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypesIdsModel
        fields = '__all__'

#Locations
class LocationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationsModel
        fields = '__all__'

#Addresses
class AddressesSerializer(serializers.ModelSerializer):
    city =  CitiesSerializer(read_only = True)

    class Meta:
        model = AddressesModel
        fields = ['id', 'street', 'area', 'city']

class AddEditAddressesSerializer(serializers.ModelSerializer):
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
    }, required = False, max_length = 50, allow_blank = True, allow_null = True)

    city_id = serializers.IntegerField(error_messages = {
        'required': 'The city is required.',
        'blank': 'The city cannot be blank.',
        'null': 'The city cannot be blank.',
        'invalid': 'The city is invalid.',
    })

    person_id = serializers.IntegerField(error_messages = {
        'required': 'The person is required.',
        'blank': 'The person cannot be blank.',
        'null': 'The person cannot be blank.',
        'invalid': 'The person is invalid.',
    })

    def to_internal_value(self, data): 
        if 'city' in data and isinstance(data['city'], dict) and 'id' in data['city']:
            data['city_id'] = data['city']['id']

        if 'person' in data and isinstance(data['person'], dict) and 'id' in data['person']:
            data['person_id'] = data['person']['id']
            
        return super().to_internal_value(data)
    
    def create(self, validated_data):
        try: 
            return super().create(validated_data)
        except IntegrityError as e:
            raise serializers.ValidationError('An ocurred has error! City or person not found.')
    
    class Meta:
        model = AddressesModel
        fields = ['street', 'area', 'city_id', 'person_id']

#Identification pictures
class IdentificationPicturesSerializer(serializers.ModelSerializer):
    class Meta:
        model = IdentificationPictures
        fields = '__all__'

#Person
class PersonSerializer(serializers.ModelSerializer):
    addresses = AddressesSerializer(many = True, read_only = True)
    identification_pictures = IdentificationPicturesSerializer(many = True, read_only = True)
    type_id = TypesIdsSerializer(read_only = True)

    class Meta:
        model = PersonsModel
        fields = '__all__'

class AddEditPersonSerializer(serializers.ModelSerializer):
    identification_id = serializers.CharField(error_messages = {
        'required': 'The identification is required.',
        'blank': 'The identification cannot be blank.',
        'null': 'The identification cannot be blank.',
        'max_length': 'The identification cannot exceed 100 characters.',
    }, max_length = 100)

    profile_picture = serializers.ImageField(
        error_messages = {
            'required': 'The profile picture is required.',
            'blank': 'The profile picture cannot be blank.',
            'null': 'The profile picture cannot be blank.',
            'invalid': 'The profile picture is invalid.',
        }, validators=[
            FileExtensionValidator(allowed_extensions = ['jpg', 'jpeg', 'png'])
        ], 
        required = False,
        allow_null = True
    )

    identification_pictures = serializers.ListField(
        child = serializers.ImageField(
            error_messages={
                'invalid': 'One or more identification pictures are invalid.',
            },
            validators=[
                FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])
            ], 
            allow_null = True
        ),
        required = False,
        allow_empty = True,
        allow_null = True,
    )

    alias = serializers.CharField(error_messages = {
        'required': 'The alias is required.',
        'blank': 'The alias cannot be blank.',
        'null': 'The alias cannot be blank.',
        'max_length': 'The alias cannot exceed 50 characters.',
    }, required = False, max_length = 50,  allow_blank = True, allow_null = True)

    occupation = serializers.CharField(error_messages = {
        'required': 'The occupation is required.',
        'blank': 'The occupation cannot be blank.',
        'null': 'The occupation cannot be blank.',
        'max_length': 'The occupation cannot exceed 50 characters.',
    }, required = False, max_length = 50, allow_blank = True, allow_null = True)

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
    }, required = False, max_length = 50, allow_blank = True, allow_null = True)

    lastname = serializers.CharField(error_messages = {
        'required': 'The lastname is required.',
        'blank': 'The lastname cannot be blank.',
        'null': 'The lastname cannot be blank.',
        'max_length': 'The lastname cannot exceed 50 characters.',
    }, max_length = 50)

    second_lastname = serializers.CharField(error_messages = {
        'required': 'The second lastname is required.',
        'blank': 'The second lastname cannot be blank.',
        'null': 'The second lastname cannot be blank.',
        'max_length': 'The second lastname cannot exceed 50 characters.',
    }, required = False, max_length = 50, allow_blank = True, allow_null = True)

    mobile = serializers.CharField(error_messages = {
        'required': 'The mobile is required.',
        'blank': 'The mobile cannot be blank.',
        'null': 'The mobile cannot be blank.',
        'max_length': 'The mobile cannot exceed 20 characters.',
    }, required = False, max_length = 20, allow_blank = True, allow_null = True)

    phone = serializers.CharField(error_messages = {
        'required': 'The phone is required.',
        'blank': 'The phone cannot be blank.',
        'null': 'The phone cannot be blank.',
        'max_length': 'The phone cannot exceed 20 characters.',
    }, required = False, max_length = 20, allow_blank = True, allow_null = True)

    birthdate = serializers.DateField(error_messages = {
        'required': 'The birthdate is required.',
        'blank': 'The birthdate cannot be blank.',
        'null': 'The birthdate cannot be blank.',
        'invalid': 'The birthdate is invalid.',
    }, required = False, allow_null = True)

    type_id_id = serializers.IntegerField(
        error_messages = {
            'required': 'The type identification is required.',
            'blank': 'The type identification cannot be blank.',
            'null': 'The type identification cannot be blank.',
            'invalid': 'The type identification is invalid.',
        }
    )

    def to_internal_value(self, data): 
        if 'type_id' in data and isinstance(data['type_id'], dict) and 'id' in data['type_id']:
            data['type_id_id'] = data['type_id']['id']
            
        return super().to_internal_value(data)

    def create(self, validated_data):
        try:
            identification_pictures = validated_data.pop('identification_pictures', [])
            person_instance = super().create(validated_data)

            for picture in identification_pictures:
                IdentificationPictures.objects.create(person = person_instance, image = picture)

            return person_instance
        except IntegrityError as e:
            raise serializers.ValidationError('An error occurred! Type identification not found.')
    
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == 'profile_picture':
                if value:
                    if instance.profile_picture:
                        instance.profile_picture.delete(save = False)

                    setattr(instance, attr, value)
            elif attr == 'identification_pictures':
                if value:  
                    #existing_pictures = IdentificationPictures.objects.filter(person=instance)
                    #for picture in existing_pictures:
                    #    picture.image.delete(save=False)
                    
                    #existing_pictures.delete()

                    for picture in value:
                        IdentificationPictures.objects.create(person=instance, image=picture)
            else:
                setattr(instance, attr, value)

        instance.save()

        return instance
    
    class Meta:
        model = PersonsModel
        fields = ['identification_id', 'profile_picture', 'identification_pictures', 'alias', 'occupation', 'firstname', 'middlename', 'lastname', 'second_lastname', 'mobile', 'phone', 'birthdate', 'type_id_id']

#Contact types
class ContactTypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactTypesModel
        fields = '__all__'

#ClientContacts
class ClientContactsSerializer(serializers.ModelSerializer):
    type = ContactTypesSerializer(read_only = True)

    class Meta:
        model = ClientContactsModel
        fields = ['id', 'relationship', 'fullname', 'phone', 'address', 'type']

class AddClientContactSerializer(serializers.ModelSerializer):
    relationship = serializers.CharField(
        error_messages = {
            'required': 'The contact relationship is required.',
            'blank': 'The contact relationship cannot be blank.',
            'null': 'The contact relationship cannot be blank.',
            'max_length': 'The contact relationship cannot exceed 100 characters.',
        }, max_length = 100
    )

    fullname = serializers.CharField(
        error_messages = {
            'required': 'The contact fullname is required.',
            'blank': 'The contact fullname cannot be blank.',
            'null': 'The contact fullname cannot be blank.',
            'max_length': 'The contact fullname cannot exceed 254 characters.',
        }
    )

    phone = serializers.CharField(
        error_messages = {
            'required': 'The contact phone is required.',
            'blank': 'The contact phone cannot be blank.',
            'null': 'The contact phone cannot be blank.',
            'max_length': 'The contact phone cannot exceed 20 characters.',
        }, max_length = 20
    )

    address = serializers.CharField(
        error_messages = {
            'required': 'The contact address is required.',
            'blank': 'The contact address cannot be blank.',
            'null': 'The contact address cannot be blank.',
            'max_length': 'The contact address cannot exceed 254 characters.',
        }
    )

    type_id = serializers.IntegerField(
        error_messages = {
            'required': 'The contact type is required.',
            'blank': 'The contact type cannot be blank.',
            'null': 'The contact type cannot be blank.',
            'invalid': 'The contact type is invalid.',
        }
    )

    client_id = serializers.IntegerField(
        error_messages = {
            'required': 'The client is required.',
            'blank': 'The client cannot be blank.',
            'null': 'The client cannot be blank.',
            'invalid': 'The client is invalid.',
        }
    )

    def to_internal_value(self, data): 
        if 'type' in data and isinstance(data['type'], dict) and 'id' in data['type']:
            data['type_id'] = data['type']['id']
            
        return super().to_internal_value(data)
    
    def create(self, validated_data):
        try: 
            return super().create(validated_data)
        except IntegrityError as e:
            raise serializers.ValidationError('An ocurred has error! Type or client not found.')
    
    class Meta:
        model = ClientContactsModel
        exclude = ['id']

#Client types
class ClientTypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientTypesModel
        fields = '__all__'

#Clients
class ClientsSerializer(serializers.ModelSerializer):
    person = PersonSerializer(read_only = True)
    location = LocationsSerializer(read_only = True)
    type = ClientTypesSerializer(read_only = True)
    contacts = ClientContactsSerializer(many = True, read_only = True)

    class Meta:
        model = ClientsModel
        fields = '__all__'

class AddEditClientSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(error_messages = {
        'required': 'The email is required.',
        'blank': 'The email cannot be blank.',
        'null': 'The email cannot be blank.',
        'max_length': 'The clientemail cannot exceed 50 characters.',
    }, required = False, allow_blank = True, allow_null = True)

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
    }, required = False, max_length = 100, allow_blank = True, allow_null = True)

    location_id = serializers.IntegerField(error_messages = {
        'required': 'The location is required.',
        'blank': 'The location cannot be blank.',
        'null': 'The location cannot be blank.',
        'invalid': 'The location is invalid.',
    })

    type_id = serializers.IntegerField(error_messages = {
        'required': 'The type is required.',
        'blank': 'The typet cannot be blank.',
        'null': 'The type cannot be blank.',
        'invalid': 'The type is invalid.',
    }, required = False, allow_null = True)

    person_id = serializers.IntegerField(error_messages = {
        'required': 'The person is required.',
        'blank': 'The person cannot be blank.',
        'null': 'The person cannot be blank.',
        'invalid': 'The person is invalid.',
    })

    def to_internal_value(self, data):
        type_json = data.get('type', '{}')
        location_json = data.get('location', '{}')
            
        try:
            data['location'] = json.loads(location_json)
            data['type'] = json.loads(type_json)
        except json.JSONDecodeError:
            pass    
        
        if 'location' in data and isinstance(data['location'], dict) and 'id' in data['location']:
            data['location_id'] = data['location']['id']
            
        if 'type' in data and isinstance(data['type'], dict) and 'id' in data['type']:
            data['type_id'] = data['type']['id']
        else:
            data['type_id'] = None
            
        return super().to_internal_value(data)
    
    def create(self, validated_data):
        try: 
            return super().create(validated_data)
        except IntegrityError as e:
            raise serializers.ValidationError('An ocurred has error! Location, type or person not found.')
    
    class Meta:
        model = ClientsModel
        exclude = ['id', 'date_reg']

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

#Suppliers
class SuppliersSerializer(serializers.ModelSerializer):
    class Meta:
        model = SuppliersModel
        fields = '__all__'

class AddEditSupplierSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(error_messages = {
        'required': 'The company name is required.',
        'blank': 'The company name cannot be blank.',
        'null': 'The company name cannot be blank.',
        'max_length': 'The company name cannot exceed 100 characters.',
    }, required = True, max_length = 100, allow_blank = False, allow_null = False)

    company_identification = serializers.CharField(error_messages = {
        'required': 'The company identification is required.',
        'blank': 'The company identification cannot be blank.',
        'null': 'The company identification cannot be blank.',
        'max_length': 'The company identification cannot exceed 50 characters.',
    }, required = False, max_length = 50, allow_blank = True, allow_null = True)

    company_email = serializers.EmailField(error_messages = {
        'required': 'The company email is required.',
        'blank': 'The company email cannot be blank.',
        'null': 'The company email cannot be blank.',
        'max_length': 'The company email cannot exceed 254 characters.',
    }, required = False, allow_blank = True, allow_null = True)

    company_phone = serializers.CharField(error_messages = {
        'required': 'The company phone is required.',
        'blank': 'The company phone cannot be blank.',
        'null': 'The company phone cannot be blank.',
        'max_length': 'The company phone cannot exceed 20 characters.',
    }, required = False, max_length = 20, allow_blank = True, allow_null = True)

    company_phone_2 = serializers.CharField(error_messages = {
        'required': 'The company phone 2 is required.',
        'blank': 'The company phone 2 cannot be blank.',
        'null': 'The company phone 2 cannot be blank.',
        'max_length': 'The company phone 2 cannot exceed 20 characters.',
    }, required = False, max_length = 20, allow_blank = True, allow_null = True)

    company_address = serializers.CharField(error_messages = {
        'required': 'The company address is required.',
        'blank': 'The company address cannot be blank.',
        'null': 'The company address cannot be blank.',
        'max_length': 'The company address cannot exceed 254 characters.',
    }, required = False, allow_blank = True, allow_null = True)

    advisor_fullname = serializers.CharField(error_messages = {
        'required': 'The advisor fullname is required.',
        'blank': 'The advisor fullname cannot be blank.',
        'null': 'The advisor fullname cannot be blank.',
        'max_length': 'The advisor fullname cannot exceed 254 characters.',
    }, required = False, allow_blank = True, allow_null = True)

    company_email = serializers.EmailField(error_messages = {
        'required': 'The advisor email is required.',
        'blank': 'The advisor email cannot be blank.',
        'null': 'The advisor email cannot be blank.',
        'max_length': 'The advisor email cannot exceed 254 characters.',
    }, required = False, allow_blank = True, allow_null = True)

    advisor_phone = serializers.CharField(error_messages = {
        'required': 'The advisor phone is required.',
        'blank': 'The advisor phone cannot be blank.',
        'null': 'The advisor phone cannot be blank.',
        'max_length': 'The advisor phone cannot exceed 20 characters.',
    }, required = False, max_length = 20, allow_blank = True, allow_null = True)

    advisor_phone_2 = serializers.CharField(error_messages = {
        'required': 'The advisor phone 2 is required.',
        'blank': 'The advisor phone 2 cannot be blank.',
        'null': 'The advisor phone 2 cannot be blank.',
        'max_length': 'The advisor phone 2 cannot exceed 20 characters.',
    }, required = False, max_length = 20, allow_blank = True, allow_null = True)    
    
    class Meta:
        model = SuppliersModel
        exclude = ['id']

class GetSupplierSerializer(serializers.ModelSerializer):    
    id = serializers.IntegerField(error_messages = {
        'required': 'The supplier is required.',
        'blank': 'The supplier cannot be blank.',
        'null': 'The supplier cannot be blank.',
        'invalid': 'The supplier is invalid.',
    })
    
    class Meta:
        model = SuppliersModel
        fields = ['id']