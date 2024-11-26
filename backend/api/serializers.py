from rest_framework import serializers
from django.core.files.base import ContentFile
from django.contrib.auth.models import User
from django.core.validators import FileExtensionValidator
from django.db.models import Q, F, Sum
from .models import *
import base64

#Serializer Base64ImageField
class Base64ImageField(serializers.ImageField):
    """Field to handle images in base64 format."""
    
    def to_internal_value(self, data):
        if isinstance(data, str) and data.startswith('data:image'):
            format, imgstr = data.split(';base64,')
            ext = format.split('/')[-1]
            file = ContentFile(base64.b64decode(imgstr), name=f'temp.{ext}')
            return super().to_internal_value(file) 

        return super().to_internal_value(data)

#Locations
class LocationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationsModel
        fields = '__all__'

class AddEditLocationSerializer(serializers.ModelSerializer):
    name = serializers.CharField(error_messages = {
        'required': 'The name is required.',
        'blank': 'The name cannot be blank.',
        'null': 'The name cannot be blank.',
        'max_length': 'The name cannot exceed 254 characters.',
    }, allow_blank = False, allow_null = False)

    status = serializers.BooleanField(error_messages = {
        'required': 'The status is required.',
        'blank': 'The status cannot be blank.',
        'null': 'The status cannot be blank.',
        'invalid': 'The status is invalid.',
    }, required = False)
    
    class Meta:
        model = LocationsModel
        exclude = ['id']

class GetLocationSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(error_messages = {
        'required': 'The tax is required.',
        'blank': 'The tax cannot be blank.',
        'null': 'The tax cannot be blank.',
        'invalid': 'The tax is invalid.',
    })
    
    class Meta:
        model = LocationsModel
        fields = ['id']

#Profile
class ProfileSerializer(serializers.ModelSerializer):
    location = LocationsSerializer(read_only = True)

    class Meta:
        model = ProfilesModel
        fields = '__all__'

class AddEditProfileSerializer(serializers.ModelSerializer):    
    phone = serializers.CharField(error_messages = {
        'required': 'The phone is required.',
        'blank': 'The phone cannot be blank.',
        'null': 'The phone cannot be blank.',
        'max_length': 'The phone cannot exceed 50 characters.',
    }, max_length = 50)

    location_id = serializers.IntegerField(error_messages = {
        'required': 'The location is required.',
        'blank': 'The location cannot be blank.',
        'null': 'The location cannot be blank.',
        'invalid': 'The location is invalid.',
    }, allow_null = True)

    commission = serializers.FloatField(error_messages = {
        'required': 'The commission is required.',
        'blank': 'The commission cannot be blank.',
        'null': 'The commission cannot be blank.',
         'invalid': 'The commission is invalid.',
    }, allow_null = True)

    def to_internal_value(self, data):       
        if data.get('location_id') in [0, '0']:
            data['location_id'] = None
            
        return super().to_internal_value(data)
    
    class Meta:
        model = ProfilesModel
        exclude = ['location', 'user']

#User
class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only = True)

    class Meta:
        model = User
        fields = '__all__'

class UserExcludeSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only = True)

    class Meta:
        model = User
        exclude = ['password', 'last_login', 'is_superuser', 'is_staff', 'is_active', 'date_joined', 'groups', 'user_permissions']

class GetUserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(error_messages = {
        'required': 'The user is required.',
        'blank': 'The user cannot be blank.',
        'null': 'The user cannot be blank.',
        'invalid': 'The user is invalid.',
    })
    
    class Meta:
        model = User
        fields = ['id'] 

#Auth login
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

class AddEditTypeIdSerializer(serializers.ModelSerializer):
    name = serializers.CharField(error_messages = {
        'required': 'The name is required.',
        'blank': 'The name cannot be blank.',
        'null': 'The name cannot be blank.',
        'max_length': 'The name cannot exceed 254 characters.',
    }, allow_blank = False, allow_null = False)

    status = serializers.BooleanField(error_messages = {
        'required': 'The status is required.',
        'blank': 'The status cannot be blank.',
        'null': 'The status cannot be blank.',
        'invalid': 'The status is invalid.',
    }, required = False)
    
    class Meta:
        model = TypesIdsModel
        exclude = ['id']

class GetTypeIdSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(error_messages = {
        'required': 'The tax is required.',
        'blank': 'The tax cannot be blank.',
        'null': 'The tax cannot be blank.',
        'invalid': 'The tax is invalid.',
    })
    
    class Meta:
        model = TypesIdsModel
        fields = ['id']

#Addresses
class AddressesSerializer(serializers.ModelSerializer):
    city =  CitiesSerializer(read_only = True)

    class Meta:
        model = AddressesModel
        fields = '__all__'

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

    person_id = serializers.UUIDField(error_messages = {
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
       
        if data.get('city_id') in [0, '0']:
            data['city_id'] = None
        
        if data.get('person_id') in [0, '0']:
            data['person_id'] = None
            
        return super().to_internal_value(data)
    
    class Meta:
        model = AddressesModel
        fields = ['street', 'area', 'city_id', 'person_id']

#Identification images
class IdentificationImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = IdentificationImagesModel
        fields = '__all__'

#Person
class PersonSerializer(serializers.ModelSerializer):
    addresses = AddressesSerializer(many = True, read_only = True)
    identification_images = IdentificationImagesSerializer(many = True, read_only = True)
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

    profile_image = Base64ImageField(
        error_messages = {
            'required': 'The profile image is required.',
            'blank': 'The profile image cannot be blank.',
            'null': 'The profile image cannot be blank.',
            'invalid': 'The profile image is invalid.',
        }, validators=[
            FileExtensionValidator(allowed_extensions = ['jpg', 'jpeg', 'png'])
        ], 
        required = False,
        allow_null = True
    )

    identification_images = serializers.ListField(
        child = Base64ImageField(
            error_messages = {
                'invalid': 'One or more identification images are invalid.',
            },
            validators = [
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
        identification_images = validated_data.pop('identification_images', [])
        instance = super().create(validated_data)

        for image in identification_images:
            IdentificationImagesModel.objects.create(person = instance, image = image)

        return instance

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == 'profile_image':
                if value:
                    if instance.profile_image:
                        instance.profile_image.delete(save=False)
                setattr(instance, attr, value)

            elif attr == 'identification_images':
                if value:
                    for image in value:
                        IdentificationImagesModel.objects.create(person=instance, image=image)
            else:
                setattr(instance, attr, value)
        
        instance.save()
        return instance
    
    class Meta:
        model = PersonsModel
        fields = ['identification_id', 'profile_image', 'identification_images', 'alias', 'occupation', 'firstname', 'middlename', 'lastname', 'second_lastname', 'mobile', 'phone', 'birthdate', 'type_id_id']

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
    
    class Meta:
        model = ClientContactsModel
        exclude = ['id']

#Client types
class ClientTypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientTypesModel
        fields = '__all__'

class AddEditClientTypeSerializer(serializers.ModelSerializer):
    name = serializers.CharField(error_messages = {
        'required': 'The name is required.',
        'blank': 'The name cannot be blank.',
        'null': 'The name cannot be blank.',
        'max_length': 'The name cannot exceed 254 characters.',
    }, allow_blank = False, allow_null = False)
    
    class Meta:
        model = ClientTypesModel
        exclude = ['id']

class GetClientTypeSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(error_messages = {
        'required': 'The tax is required.',
        'blank': 'The tax cannot be blank.',
        'null': 'The tax cannot be blank.',
        'invalid': 'The tax is invalid.',
    })
    
    class Meta:
        model = ClientTypesModel
        fields = ['id']

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

    marital_status = serializers.CharField(error_messages = {
        'required': 'The marital status is required.',
        'blank': 'The marital status cannot be blank.',
        'null': 'The marital status cannot be blank.',
        'max_length': 'The marital status cannot exceed 100 characters.',
    }, required = False, max_length = 100, allow_blank = True, allow_null = True)

    nationality = serializers.CharField(error_messages = {
        'required': 'The nationality is required.',
        'blank': 'The nationality cannot be blank.',
        'null': 'The nationality cannot be blank.',
        'max_length': 'The nationality cannot exceed 100 characters.',
    }, required = False, max_length = 100, allow_blank = True, allow_null = True)

    income_amount = serializers.FloatField(error_messages = {
        'required': 'The income amount is required.',
        'blank': 'The income amount cannot be blank.',
        'null': 'The income amount cannot be blank.',
        'invalid': 'The income amount is invalid.',
    }, required = False)

    current_job = serializers.CharField(error_messages = {
        'required': 'The current job is required.',
        'blank': 'The current job cannot be blank.',
        'null': 'The current job cannot be blank.',
        'max_length': 'The current job cannot exceed 100 characters.',
    }, required = False, max_length = 100, allow_blank = True, allow_null = True)

    time_job = serializers.CharField(error_messages = {
        'required': 'The time job is required.',
        'blank': 'The time job cannot be blank.',
        'null': 'The time job cannot be blank.',
        'max_length': 'The time job cannot exceed 100 characters.',
    }, required = False, max_length = 100, allow_blank = True, allow_null = True)

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

    person_id = serializers.UUIDField(error_messages = {
        'required': 'The person is required.',
        'blank': 'The person cannot be blank.',
        'null': 'The person cannot be blank.',
        'invalid': 'The person is invalid.',
    })

    def to_internal_value(self, data):
        if 'location' in data and isinstance(data['location'], dict) and 'id' in data['location']:
            data['location_id'] = data['location']['id']
        
        if 'type' in data and isinstance(data['type'], dict) and 'id' in data['type']:
            data['type_id'] = data['type']['id']

        if 'person' in data and isinstance(data['person'], dict) and 'id' in data['person']:
            data['person_id'] = data['person']['id']
       
        if data.get('location_id') in [0, '0']:
            data['location_id'] = None
        
        if data.get('type_id') in [0, '0']:
            data['type_id'] = None
        
        if data.get('location_id') in [0, '0']:
            data['location_id'] = None
            
        return super().to_internal_value(data)
    
    
    class Meta:
        model = ClientsModel
        exclude = ['id', 'date_reg', 'location', 'type', 'person']

class GetClientSerializer(serializers.ModelSerializer):    
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
    }, max_length = 100, allow_blank = False, allow_null = False)

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
    id = serializers.UUIDField(error_messages = {
        'required': 'The supplier is required.',
        'blank': 'The supplier cannot be blank.',
        'null': 'The supplier cannot be blank.',
        'invalid': 'The supplier is invalid.',
    })
    
    class Meta:
        model = SuppliersModel
        fields = ['id']

#Taxes
class TaxesSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxesModel
        fields = '__all__'

class AddEditTaxSerializer(serializers.ModelSerializer):
    name = serializers.CharField(error_messages = {
        'required': 'The name is required.',
        'blank': 'The name cannot be blank.',
        'null': 'The name cannot be blank.',
        'max_length': 'The name cannot exceed 254 characters.',
    }, allow_blank = False, allow_null = False)

    value = serializers.FloatField(error_messages = {
        'required': 'The value is required.',
        'blank': 'The value cannot be blank.',
        'null': 'The value cannot be blank.',
        'invalid': 'The value is invalid.',
    }, required = False)

    status = serializers.BooleanField(error_messages = {
        'required': 'The status is required.',
        'blank': 'The status cannot be blank.',
        'null': 'The status cannot be blank.',
        'invalid': 'The status is invalid.',
    }, required = False)
    
    class Meta:
        model = TaxesModel
        exclude = ['id']

class GetTaxSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(error_messages = {
        'required': 'The tax is required.',
        'blank': 'The tax cannot be blank.',
        'null': 'The tax cannot be blank.',
        'invalid': 'The tax is invalid.',
    })
    
    class Meta:
        model = TaxesModel
        fields = ['id']
        
#Product brands
class ProductBrandsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductBrandsModel
        fields = '__all__'

class AddEditProductBrandSerializer(serializers.ModelSerializer):
    name = serializers.CharField(error_messages = {
        'required': 'The name is required.',
        'blank': 'The name cannot be blank.',
        'null': 'The name cannot be blank.',
        'max_length': 'The name cannot exceed 254 characters.',
    }, allow_blank = False, allow_null = False)

    status = serializers.BooleanField(error_messages = {
        'required': 'The status is required.',
        'blank': 'The status cannot be blank.',
        'null': 'The status cannot be blank.',
        'invalid': 'The status is invalid.',
    }, required = False)
    
    class Meta:
        model = ProductBrandsModel
        exclude = ['id']

class GetProductBrandSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(error_messages = {
        'required': 'The product brand is required.',
        'blank': 'The product brand cannot be blank.',
        'null': 'The product brand cannot be blank.',
        'invalid': 'The product brand is invalid.',
    })
    
    class Meta:
        model = ProductBrandsModel
        fields = ['id']
        
#Product categories
class ProductCategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategoriesModel
        fields = '__all__'

class AddEditProductCategorySerializer(serializers.ModelSerializer):
    name = serializers.CharField(error_messages = {
        'required': 'The name is required.',
        'blank': 'The name cannot be blank.',
        'null': 'The name cannot be blank.',
        'max_length': 'The name cannot exceed 254 characters.',
    }, allow_blank = False, allow_null = False)   

    status = serializers.BooleanField(error_messages = {
        'required': 'The status is required.',
        'blank': 'The status cannot be blank.',
        'null': 'The status cannot be blank.',
        'invalid': 'The status is invalid.',
    }, required = False)
    
    class Meta:
        model = ProductCategoriesModel
        exclude = ['id']

class GetProductCategorySerializer(serializers.ModelSerializer):    
    id = serializers.IntegerField(error_messages = {
        'required': 'The product category is required.',
        'blank': 'The product category cannot be blank.',
        'null': 'The product category cannot be blank.',
        'invalid': 'The product category is invalid.',
    })
    
    class Meta:
        model = ProductCategoriesModel
        fields = ['id']

#Product images
class ProductImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImagesModel
        fields = '__all__'

#Products
class ProductsSerializer(serializers.ModelSerializer):
    product_images = ProductImagesSerializer(many = True, read_only = True)
    category = ProductCategoriesSerializer(read_only = True)
    brand = ProductBrandsSerializer(read_only = True)
    supplier = SuppliersSerializer(read_only = True)
    tax = TaxesSerializer(read_only = True)

    class Meta:
        model = ProductsModel
        fields = '__all__'

class AddEditProductSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child = Base64ImageField(
            error_messages = {
                'invalid': 'One or more identification images are invalid.',
            },
            validators = [
                FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])
            ], 
            allow_null = True
        ),
        required = False,
        allow_empty = True,
        allow_null = True,
    )

    barcode = serializers.CharField(error_messages = {
        'required': 'The barcode is required.',
        'blank': 'The barcode cannot be blank.',
        'null': 'The barcode cannot be blank.',
        'max_length': 'The barcode cannot exceed 50 characters.',
    }, required= False, max_length = 50, allow_blank = True, allow_null = True)

    name = serializers.CharField(error_messages = {
        'required': 'The name is required.',
        'blank': 'The name cannot be blank.',
        'null': 'The name cannot be blank.',
        'max_length': 'The name cannot exceed 254 characters.',
    }, allow_blank = False, allow_null = False)

    model = serializers.CharField(error_messages = {
        'required': 'The model is required.',
        'blank': 'The model cannot be blank.',
        'null': 'The model cannot be blank.',
        'max_length': 'The model cannot exceed 50 characters.',
    }, required= False, max_length = 50, allow_blank = True, allow_null = True)

    note = serializers.CharField(error_messages = {
        'required': 'The note is required.',
        'blank': 'The note cannot be blank.',
        'null': 'The note cannot be blank.',
        'max_length': 'The note cannot exceed 100 characters.',
    }, required= False, max_length = 100, allow_blank = True, allow_null = True)

    cost_price = serializers.FloatField(error_messages = {
        'required': 'The cost price is required.',
        'blank': 'The cost price cannot be blank.',
        'null': 'The cost price cannot be blank.',
        'invalid': 'The cost price is invalid.',
    }, required = False)

    cash_profit = serializers.FloatField(error_messages = {
        'required': 'The cash profit is required.',
        'blank': 'The cash profit cannot be blank.',
        'null': 'The cash profit cannot be blank.',
        'invalid': 'The cash profit is invalid.',
    }, required = False)

    cash_price = serializers.FloatField(error_messages = {
        'required': 'The cash price is required.',
        'blank': 'The cash price cannot be blank.',
        'null': 'The cash price cannot be blank.',
        'invalid': 'The cash price is invalid.',
    }, required = False)

    credit_profit = serializers.FloatField(error_messages = {
        'required': 'The credit profit is required.',
        'blank': 'The credit profit cannot be blank.',
        'null': 'The credit profit cannot be blank.',
        'invalid': 'The credit profit is invalid.',
    }, required = False)

    credit_price = serializers.FloatField(error_messages = {
        'required': 'The credit price is required.',
        'blank': 'The credit price cannot be blank.',
        'null': 'The credit price cannot be blank.',
        'invalid': 'The credit price is invalid.',
    }, required = False)

    min_stock = serializers.IntegerField(error_messages = {
        'required': 'The min stock is required.',
        'blank': 'The min stock cannot be blank.',
        'null': 'The min stock cannot be blank.',
        'invalid': 'The min stock is invalid.',
    }, required = False)

    status = serializers.BooleanField(error_messages = {
        'required': 'The status is required.',
        'blank': 'The status cannot be blank.',
        'null': 'The status cannot be blank.',
        'invalid': 'The status is invalid.',
    }, required = False)

    category_id = serializers.IntegerField(error_messages = {
        'required': 'The category is required.',
        'blank': 'The category cannot be blank.',
        'null': 'The category cannot be blank.',
        'invalid': 'The category is invalid.',
    }, required = False, allow_null = True)

    brand_id = serializers.IntegerField(error_messages = {
        'required': 'The brand is required.',
        'blank': 'The brand cannot be blank.',
        'null': 'The brand cannot be blank.',
        'invalid': 'The brand is invalid.',
    }, required = False, allow_null = True)

    supplier_id = serializers.UUIDField(error_messages = {
        'required': 'The supplier is required.',
        'blank': 'The supplier cannot be blank.',
        'null': 'The supplier cannot be blank.',
        'invalid': 'The supplier is invalid.',
    }, required = False, allow_null = True)

    tax_id = serializers.IntegerField(error_messages = {
        'required': 'The tax is required.',
        'blank': 'The tax cannot be blank.',
        'null': 'The tax cannot be blank.',
        'invalid': 'The tax is invalid.',
    }, required = False, allow_null = True)

    def to_internal_value(self, data):
        if 'category' in data and isinstance(data['category'], dict) and 'id' in data['category']:
            data['category_id'] = data['category']['id']
        
        if 'brand' in data and isinstance(data['brand'], dict) and 'id' in data['brand']:
            data['brand_id'] = data['brand']['id']

        if 'supplier' in data and isinstance(data['supplier'], dict) and 'id' in data['supplier']:
            data['supplier_id'] = data['supplier']['id']

        if 'tax' in data and isinstance(data['tax'], dict) and 'id' in data['tax']:
            data['tax_id'] = data['tax']['id']
        
        if data.get('category_id') in [0, '0']:
            data['category_id'] = None
        
        if data.get('brand_id') in [0, '0']:
            data['brand_id'] = None
        
        if data.get('supplier_id') in [0, '0']:
            data['supplier_id'] = None
        
        if data.get('tax_id') in [0, '0']:
            data['tax_id'] = None

        return super().to_internal_value(data)
    
    def create(self, validated_data):
        images = validated_data.pop('images', [])
        instance = super().create(validated_data)

        for image in images:
            ProductImagesModel.objects.create(product = instance, image = image)

        return instance

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == 'images':
                if value:
                    for image in value:
                        ProductImagesModel.objects.create(product = instance, image = image)
            else:
                setattr(instance, attr, value)
        
        instance.save()

        return instance 

    class Meta:
        model = ProductsModel
        exclude = ['id', 'category', 'brand', 'supplier', 'tax']

class GetProductSerializer(serializers.ModelSerializer):    
    id = serializers.UUIDField(error_messages = {
        'required': 'The product is required.',
        'blank': 'The product cannot be blank.',
        'null': 'The product cannot be blank.',
        'invalid': 'The product is invalid.',
    })
    
    class Meta:
        model = ProductsModel
        fields = ['id']

#PaymentMethods
class PaymentMethodsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethodsModel
        fields = '__all__'

class AddEditPaymentMethodSerializer(serializers.ModelSerializer):
    name = serializers.CharField(error_messages = {
        'required': 'The name is required.',
        'blank': 'The name cannot be blank.',
        'null': 'The name cannot be blank.',
        'max_length': 'The name cannot exceed 254 characters.',
    }, allow_blank = False, allow_null = False)

    value = serializers.FloatField(error_messages = {
        'required': 'The value is required.',
        'blank': 'The value cannot be blank.',
        'null': 'The value cannot be blank.',
        'invalid': 'The value is invalid.',
    }, required = False)

    allow_discount = serializers.BooleanField(error_messages = {
        'required': 'The allow discount is required.',
        'blank': 'The allow discount cannot be blank.',
        'null': 'The allow discount cannot be blank.',
        'invalid': 'The allow discount is invalid.',
    }, required = False)

    allow_note = serializers.BooleanField(error_messages = {
        'required': 'The allow note is required.',
        'blank': 'The allow note cannot be blank.',
        'null': 'The allow note cannot be blank.',
        'invalid': 'The allow note is invalid.',
    }, required = False)

    status = serializers.BooleanField(error_messages = {
        'required': 'The status is required.',
        'blank': 'The status cannot be blank.',
        'null': 'The status cannot be blank.',
        'invalid': 'The status is invalid.',
    }, required = False)
    
    class Meta:
        model = PaymentMethodsModel
        exclude = ['id']

class GetPaymentMethodSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(error_messages = {
        'required': 'The payment method is required.',
        'blank': 'The payment method cannot be blank.',
        'null': 'The payment method cannot be blank.',
        'invalid': 'The payment method is invalid.',
    })
    
    class Meta:
        model = PaymentMethodsModel
        fields = ['id']

#Inventory types
class InventoryTypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryTypesModel
        fields = '__all__'

class AddEditInventoryTypeSerializer(serializers.ModelSerializer):
    name = serializers.CharField(error_messages = {
        'required': 'The name is required.',
        'blank': 'The name cannot be blank.',
        'null': 'The name cannot be blank.',
        'max_length': 'The name cannot exceed 100 characters.',
    }, max_length = 100, allow_blank = False, allow_null = False)

    type = serializers.IntegerField(error_messages = {
        'required': 'The inventory type is required.',
        'blank': 'The inventory type cannot be blank.',
        'null': 'The inventory type cannot be blank.',
        'invalid': 'The inventory type is invalid.',
    }, required = True)
    
    class Meta:
        model = InventoryTypesModel
        exclude = ['id']

class GetInventoryTypeSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(error_messages = {
        'required': 'The inventory type is required.',
        'blank': 'The inventory type cannot be blank.',
        'null': 'The inventory type cannot be blank.',
        'invalid': 'The inventory type is invalid.',
    })
    
    class Meta:
        model = InventoryTypesModel
        fields = ['id'] 

#Inventory
class InventorySerializer(serializers.ModelSerializer):
    product = ProductsSerializer(read_only = True)
    type = InventoryTypesSerializer(read_only = True)
    location = LocationsSerializer(read_only = True)
    user = UserExcludeSerializer(read_only = True)
    location_transfer = LocationsSerializer(read_only = True)
    user_transfer = UserExcludeSerializer(read_only = True)
    user_transfer_receives = UserExcludeSerializer(read_only = True)

    class Meta:
        model = InventoryModel
        fields = '__all__'

class AddEditInventorySerializer(serializers.ModelSerializer):
    price = serializers.FloatField(error_messages = {
        'required': 'The price is required.',
        'blank': 'The price cannot be blank.',
        'null': 'The price cannot be blank.',
        'invalid': 'The price is invalid.',
    }, required = False)

    cost = serializers.FloatField(error_messages = {
        'required': 'The cost is required.',
        'blank': 'The cost cannot be blank.',
        'null': 'The cost cannot be blank.',
        'invalid': 'The cost is invalid.',
    }, required = False)

    quantity = serializers.FloatField(error_messages = {
        'required': 'The quantity is required.',
        'blank': 'The quantity cannot be blank.',
        'null': 'The quantity cannot be blank.',
        'invalid': 'The quantity is invalid.',
    }, required = False)

    note = serializers.CharField(error_messages = {
        'required': 'The note is required.',
        'blank': 'The note cannot be blank.',
        'null': 'The note cannot be blank.',
        'max_length': 'The note cannot exceed 100 characters.',
    }, required= False, max_length = 100, allow_blank = True, allow_null = True)

    type_inventory = serializers.IntegerField(error_messages = {
        'required': 'The type inventory is required.',
        'blank': 'The type inventory cannot be blank.',
        'null': 'The type inventory cannot be blank.',
        'invalid': 'The type inventory is invalid.',
    })

    product_id = serializers.UUIDField(error_messages = {
        'required': 'The product is required.',
        'blank': 'The product cannot be blank.',
        'null': 'The product cannot be blank.',
        'invalid': 'The product is invalid.',
    }, allow_null = False)

    location_id = serializers.IntegerField(error_messages = {
        'required': 'The location is required.',
        'blank': 'The location cannot be blank.',
        'null': 'The location cannot be blank.',
        'invalid': 'The location is invalid.',
    }, allow_null = False)

    user_id = serializers.IntegerField(error_messages = {
        'required': 'The user is required.',
        'blank': 'The user cannot be blank.',
        'null': 'The user cannot be blank.',
        'invalid': 'The user is invalid.',
    }, allow_null = False)

    type_id = serializers.IntegerField(error_messages = {
        'required': 'The type is required.',
        'blank': 'The type cannot be blank.',
        'null': 'The type cannot be blank.',
        'invalid': 'The type is invalid.',
    }, required = False, allow_null = True)

    location_transfer_id = serializers.IntegerField(error_messages = {
        'required': 'The location is required.',
        'blank': 'The location cannot be blank.',
        'null': 'The location cannot be blank.',
        'invalid': 'The location is invalid.',
    }, required = False, allow_null = True)

    user_transfer_id = serializers.IntegerField(error_messages = {
        'required': 'The dealer is required.',
        'blank': 'The dealer cannot be blank.',
        'null': 'The dealer cannot be blank.',
        'invalid': 'The dealer is invalid.',
    }, required = False, allow_null = True)

    user_transfer_receives_id = serializers.IntegerField(error_messages = {
        'required': 'The person who receives is required.',
        'blank': 'The person who receives cannot be blank.',
        'null': 'The person who receives cannot be blank.',
        'invalid': 'The person who receives is invalid.',
    }, required = False, allow_null = True)

    sale_id = serializers.IntegerField(error_messages = {
        'required': 'The sale is required.',
        'blank': 'The sale cannot be blank.',
        'null': 'The sale cannot be blank.',
        'invalid': 'The sale is invalid.',
    }, required = False, allow_null = True)

    def to_internal_value(self, data):
        if 'product' in data and isinstance(data['product'], dict) and 'id' in data['product']:
            data['product_id'] = data['product']['id']

        if 'type' in data and isinstance(data['type'], dict) and 'id' in data['type']:
            data['type_id'] = data['type']['id']
        
        if 'location' in data and isinstance(data['location'], dict) and 'id' in data['location']:
            data['location_id'] = data['location']['id']
        
        if 'location_transfer' in data and isinstance(data['location_transfer'], dict) and 'id' in data['location_transfer']:
            data['location_transfer_id'] = data['location_transfer']['id']
        
        if 'user_transfer' in data and isinstance(data['user_transfer'], dict) and 'id' in data['user_transfer']:
            data['user_transfer_id'] = data['user_transfer']['id']
        
        if 'user_transfer_receives' in data and isinstance(data['user_transfer_receives'], dict) and 'id' in data['user_transfer_receives']:
            data['user_transfer_receives_id'] = data['user_transfer_receives']['id']
        
        if 'sale' in data and isinstance(data['sale'], dict) and 'id' in data['sale']:
            data['sale_id'] = data['sale']['id']
        
        if data.get('product_id') in [0, '0']:
            data['product_id'] = None

        if data.get('type_id') in [0, '0']:
            data['type_id'] = None
        
        if data.get('location_id') in [0, '0']:
            data['location_id'] = None
        
        if data.get('location_transfer_id') in [0, '0']:
            data['location_transfer_id'] = None
        
        if data.get('user_transfer_id') in [0, '0']:
            data['user_transfer_id'] = None
        
        if data.get('user_transfer_receives_id') in [0, '0']:
            data['user_transfer_receives_id'] = None
        
        if data.get('sale_id') in [0, '0']:
            data['sale_id'] = None

        return super().to_internal_value(data)

    class Meta:
        model = InventoryModel
        exclude = ['id', 'product', 'type', 'location', 'user', 'location_transfer', 'user_transfer', 'user_transfer_receives', 'sale']
    
    def validate_type(self, value):
        if value not in [1, 2, 3]:
            raise serializers.ValidationError('Invalid inventory type.')
        
        return value

class GetInventorySerializer(serializers.ModelSerializer):    
    id = serializers.UUIDField(error_messages = {
        'required': 'The inventory is required.',
        'blank': 'The inventory cannot be blank.',
        'null': 'The inventory cannot be blank.',
        'invalid': 'The inventory is invalid.',
    })
    
    class Meta:
        model = InventoryModel
        fields = ['id']

#Sale status
class SaleStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleStatusModel
        fields = '__all__'

class AddEditSaleStatusSerializer(serializers.ModelSerializer):
    name = serializers.CharField(error_messages = {
        'required': 'The name is required.',
        'blank': 'The name cannot be blank.',
        'null': 'The name cannot be blank.',
        'max_length': 'The name cannot exceed 100 characters.',
    }, max_length = 100)

    calculate = serializers.BooleanField(error_messages = {
        'required': 'The calculate is required.',
        'blank': 'The calculate cannot be blank.',
        'null': 'The calculate cannot be blank.',
        'invalid': 'The calculate is invalid.',
    })

    class Meta:
        model = SaleStatusModel
        exclude = ['id']

class GetSaleStatusSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(error_messages = {
        'required': 'The sale status is required.',
        'blank': 'The sale status cannot be blank.',
        'null': 'The sale status cannot be blank.',
        'invalid': 'The sale status is invalid.',
    })
    
    class Meta:
        model = SaleStatusModel
        fields = ['id']

#Sale payment
class SalePaymentsSerializer(serializers.ModelSerializer):
    payment_method = PaymentMethodsSerializer(read_only = True)
    location = LocationsSerializer(read_only = True)
    user = UserExcludeSerializer(read_only = True)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        if instance.date_limit:
            representation['date_limit'] = instance.date_limit.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'
        
        return representation
    
    class Meta:
        model = SalePaymentsModel
        fields = '__all__'

class SalesNoPaymentSerializer(serializers.ModelSerializer):
    client = ClientsSerializer(read_only = True)
    inventory = InventorySerializer(source = 'inventory_sale', many = True, read_only = True)
    location = LocationsSerializer(read_only = True)
    user = UserExcludeSerializer(read_only = True)
    status = SaleStatusSerializer(read_only = True)

    class Meta:
        model = SalesModel
        fields = '__all__'

class SalePaymentsSaleSerializer(serializers.ModelSerializer):
    payment_method = PaymentMethodsSerializer(read_only = True)
    location = LocationsSerializer(read_only = True)
    user = UserExcludeSerializer(read_only = True)
    sale = SalesNoPaymentSerializer(read_only = True)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        if instance.date_limit:
            representation['date_limit'] = instance.date_limit.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'
        
        return representation
    
    class Meta:
        model = SalePaymentsModel
        fields = '__all__'

class AddEditSalePaymentSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        payment_method_required = kwargs.pop('payment_method_required', False)

        super(AddEditSalePaymentSerializer, self).__init__(*args, **kwargs)

        self.fields['payment_method_id'].required = payment_method_required

    no = serializers.IntegerField(error_messages = {
        'required': 'The no is required.',
        'blank': 'The no cannot be blank.',
        'null': 'The no cannot be blank.',
        'invalid': 'The no is invalid.',
    }, required = False, allow_null = True)

    note = serializers.CharField(error_messages = {
        'required': 'The note is required.',
        'blank': 'The note cannot be blank.',
        'null': 'The note cannot be blank.',
    }, required = False, allow_null = True)

    subtotal = serializers.FloatField(error_messages = {
        'required': 'The subtotal is required.',
        'blank': 'The subtotal cannot be blank.',
        'null': 'The subtotal cannot be blank.',
        'invalid': 'The subtotal is invalid.',
    })

    commission = serializers.FloatField(error_messages = {
        'required': 'The commission is required.',
        'blank': 'The commission cannot be blank.',
        'null': 'The commission cannot be blank.',
        'invalid': 'The commission is invalid.',
    }, required = False)

    surcharge = serializers.FloatField(error_messages = {
        'required': 'The surcharge is required.',
        'blank': 'The surcharge cannot be blank.',
        'null': 'The surcharge cannot be blank.',
        'invalid': 'The surcharge is invalid.',
    }, required = False)

    discount_per = serializers.FloatField(error_messages = {
        'required': 'The discount per is required.',
        'blank': 'The discount per cannot be blank.',
        'null': 'The discount per cannot be blank.',
        'invalid': 'The discount per is invalid.',
    }, required = False)

    discount = serializers.FloatField(error_messages = {
        'required': 'The discount is required.',
        'blank': 'The discount cannot be blank.',
        'null': 'The discount cannot be blank.',
        'invalid': 'The discount is invalid.',
    }, required = False)

    total = serializers.FloatField(error_messages = {
        'required': 'The total is required.',
        'blank': 'The total cannot be blank.',
        'null': 'The total cannot be blank.',
        'invalid': 'The total is invalid.',
    }, required = False)

    pay = serializers.FloatField(error_messages = {
        'required': 'The pay is required.',
        'blank': 'The pay cannot be blank.',
        'null': 'The pay cannot be blank.',
        'invalid': 'The pay is invalid.',
    }, required = False)

    change = serializers.FloatField(error_messages = {
        'required': 'The change is required.',
        'blank': 'The change cannot be blank.',
        'null': 'The change cannot be blank.',
        'invalid': 'The change is invalid.',
    }, required = False)

    location_id = serializers.IntegerField(error_messages = {
        'required': 'The location is required.',
        'blank': 'The location cannot be blank.',
        'null': 'The location cannot be blank.',
        'invalid': 'The location is invalid.',
    }, required = False)

    payment_method_id = serializers.IntegerField(error_messages = {
        'required': 'The payment method is required.',
        'blank': 'The payment method cannot be blank.',
        'null': 'The payment method cannot be blank.',
        'invalid': 'The payment method is invalid.',
    }, required = False)

    sale_id = serializers.IntegerField(error_messages = {
        'required': 'The sale is required.',
        'blank': 'The sale cannot be blank.',
        'null': 'The sale cannot be blank.',
        'invalid': 'The sale is invalid.',
    })

    user_id = serializers.IntegerField(error_messages = {
        'required': 'The user is required.',
        'blank': 'The user cannot be blank.',
        'null': 'The user cannot be blank.',
        'invalid': 'The user is invalid.',
    }, required = False)

    def to_internal_value(self, data):
        if 'location' in data and isinstance(data['location'], dict) and 'id' in data['location']:
            data['location_id'] = data['location']['id']
        
        if 'payment_method' in data and isinstance(data['payment_method'], dict) and 'id' in data['payment_method']:
            data['payment_method_id'] = data['payment_method']['id']
        
        if 'sale' in data and isinstance(data['sale'], dict) and 'id' in data['sale']:
            data['sale_id'] = data['sale']['id']

        if 'user' in data and isinstance(data['user'], dict) and 'id' in data['user']:
            data['user_id'] = data['user']['id']
        
        if data.get('no') in [0, '0']:
            data['no'] = None

        if data.get('location_id') in [0, '0']:
            data['location_id'] = None
        
        if data.get('payment_method_id') in [0, '0']:
            data['payment_method_id'] = None
        
        if data.get('sale_id') in [0, '0']:
            data['sale_id'] = None
        
        if data.get('user_id') in [0, '0']:
            data['user_id'] = None

        return super().to_internal_value(data)
    
    class Meta:
        model = SalePaymentsModel
        exclude = ['id', 'location', 'payment_method', 'sale', 'user']

class GetSalePaymentSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(error_messages = {
        'required': 'The sale payment is required.',
        'blank': 'The sale payment cannot be blank.',
        'null': 'The sale payment cannot be blank.',
        'invalid': 'The sale payment is invalid.',
    })
    
    class Meta:
        model = SalePaymentsModel
        fields = ['id']

#Signature images
class SignatureImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = SignatureImagesModel
        fields = '__all__'

class AddEditSignatureImageSerializer(serializers.ModelSerializer):
    type = serializers.ChoiceField(choices=[1, 2, 3])
    
    signature = Base64ImageField(
        error_messages = {
            'required': 'The signature image is required.',
            'blank': 'The signature image cannot be blank.',
            'null': 'The signature image cannot be blank.',
            'invalid': 'The signature image is invalid.',
        }, validators=[
            FileExtensionValidator(allowed_extensions = ['jpg', 'jpeg', 'png'])
        ]
    )

    sale_id = serializers.IntegerField(error_messages = {
        'required': 'The sale is required.',
        'blank': 'The sale cannot be blank.',
        'null': 'The sale cannot be blank.',
        'invalid': 'The sale is invalid.',
    })

    class Meta:
        model = SignatureImagesModel
        exclude = ['sale']

#Sale
class SalesSerializer(serializers.ModelSerializer):
    last_pending_payment = serializers.SerializerMethodField()
    client = ClientsSerializer(read_only = True)
    sale_payments = SalePaymentsSerializer(source = 'sale_payments_sale', many = True, read_only = True)
    inventory = InventorySerializer(source = 'inventory_sale', many = True, read_only = True)
    location = LocationsSerializer(read_only = True)
    user = UserExcludeSerializer(read_only = True)
    status = SaleStatusSerializer(read_only = True)
    signature_images = SignatureImagesSerializer(many = True, read_only = True)

    def get_last_pending_payment(self, obj):
        sale_payments = SalePaymentsModel.objects.filter(sale_id = obj.id)            
        pending_payment = sale_payments.filter(
            Q(total__lt = F('subtotal'))
            | Q(total__isnull=True)
        ).order_by('date_limit').first()

        return {
            'id': pending_payment.id,
            'subtotal': pending_payment.subtotal,
            'date_limit': pending_payment.date_limit
        } if pending_payment else None

    class Meta:
        model = SalesModel
        fields = '__all__'

class AddEditSaleSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(error_messages = {
        'required': 'The id is required.',
        'blank': 'The id cannot be blank.',
        'null': 'The id cannot be blank.',
        'invalid': 'The id is invalid.',
    })

    total = serializers.FloatField(error_messages = {
        'required': 'The total is required.',
        'blank': 'The total cannot be blank.',
        'null': 'The total cannot be blank.',
        'invalid': 'The total is invalid.',
    })

    type = serializers.IntegerField(error_messages = {
        'required': 'The type is required.',
        'blank': 'The type cannot be blank.',
        'null': 'The type cannot be blank.',
        'invalid': 'The type is invalid.',
    })

    quantity_of_payments = serializers.IntegerField(error_messages = {
        'required': 'The quantity of payments is required.',
        'blank': 'The quantity of payments cannot be blank.',
        'null': 'The quantity of payments cannot be blank.',
        'invalid': 'The quantity of payments is invalid.',
    }, required = False)

    payment_days = serializers.IntegerField(error_messages = {
        'required': 'The payment days is required.',
        'blank': 'The payment days cannot be blank.',
        'null': 'The payment days cannot be blank.',
        'invalid': 'The payment days is invalid.',
    }, required = False, allow_null = True)

    note = serializers.CharField(error_messages = {
        'required': 'The note is required.',
        'blank': 'The note cannot be blank.',
        'null': 'The note cannot be blank.',
        'max_length': 'The note cannot exceed 100 characters.',
    }, max_length = 100, required = False, allow_blank = True)

    client_id = serializers.IntegerField(error_messages = {
        'required': 'The client is required.',
        'blank': 'The client cannot be blank.',
        'null': 'The client cannot be blank.',
        'invalid': 'The client is invalid.',
    })

    location_id = serializers.IntegerField(error_messages = {
        'required': 'The location is required.',
        'blank': 'The location cannot be blank.',
        'null': 'The location cannot be blank.',
        'invalid': 'The location is invalid.',
    })

    user_id = serializers.IntegerField(error_messages = {
        'required': 'The user is required.',
        'blank': 'The user cannot be blank.',
        'null': 'The user cannot be blank.',
        'invalid': 'The user is invalid.',
    })

    status_id = serializers.IntegerField(error_messages = {
        'required': 'The status is required.',
        'blank': 'The status cannot be blank.',
        'null': 'The status cannot be blank.',
        'invalid': 'The status is invalid.',
    })

    def to_internal_value(self, data):
        if 'client' in data and isinstance(data['client'], dict) and 'id' in data['client']:
            data['client_id'] = data['client']['id']
        
        if 'location' in data and isinstance(data['location'], dict) and 'id' in data['location']:
            data['location_id'] = data['location']['id']
        
        if 'user' in data and isinstance(data['user'], dict) and 'id' in data['user']:
            data['user_id'] = data['user']['id']
        
        if 'status' in data and isinstance(data['status'], dict) and 'id' in data['status']:
            data['status_id'] = data['status']['id']
    
        if data.get('client_id') in [0, '0']:
            data['client_id'] = None
        
        if data.get('location_id') in [0, '0']:
            data['location_id'] = None
        
        if data.get('user_id') in [0, '0']:
            data['user_id'] = None
        
        if data.get('status_id') in [0, '0']:
            data['status_id'] = None

        return super().to_internal_value(data)
    
    class Meta:
        model = SalesModel
        exclude = ['client', 'location', 'user', 'status']

class GetSaleSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(error_messages = {
        'required': 'The sale is required.',
        'blank': 'The sale cannot be blank.',
        'null': 'The sale cannot be blank.',
        'invalid': 'The sale is invalid.',
    })
    
    class Meta:
        model = SalesModel
        fields = ['id']

#Sale receipt
class SaleReceiptSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleReceiptModel
        fields = '__all__'

class AddEditSaleReceiptSerializer(serializers.ModelSerializer):
    prompter = serializers.CharField(error_messages = {
        'required': 'The prompter is required.',
        'blank': 'The prompter cannot be blank.',
        'null': 'The prompter cannot be blank.',
        'max_length': 'The prompter cannot exceed 50 characters.',
    }, max_length = 50)

    description = serializers.CharField(error_messages = {
        'required': 'The description is required.',
        'blank': 'The description cannot be blank.',
        'null': 'The description cannot be blank.',
        'max_length': 'The description cannot exceed 254 characters.',
    }, max_length = 254)

    class Meta:
        model = SaleReceiptModel
        exclude = ['id']

class GetSaleReceiptSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(error_messages = {
        'required': 'The sale receipt is required.',
        'blank': 'The sale receipt cannot be blank.',
        'null': 'The sale receipt cannot be blank.',
        'invalid': 'The sale receipt is invalid.',
    })
    
    class Meta:
        model = SaleReceiptModel
        fields = ['id']

#Cash Register
class CashRegisterSerializer(serializers.ModelSerializer):
    location = LocationsSerializer(read_only = True)
    user = UserExcludeSerializer(read_only = True)
    
    class Meta:
        model = CashRegisterModel
        fields = '__all__'

class AddEditCashRegisterSerializer(serializers.ModelSerializer):
    no = serializers.CharField(error_messages = {
        'required': 'The no document is required.',
        'blank': 'The no document cannot be blank.',
        'null': 'The no document cannot be blank.',
        'max_length': 'The no document cannot exceed 100 characters.',
    }, max_length = 100)

    amount = serializers.FloatField(error_messages = {
        'required': 'The amount is required.',
        'blank': 'The amount cannot be blank.',
        'null': 'The amount cannot be blank.',
        'invalid': 'The amount is invalid.',
    })

    supplier = serializers.CharField(error_messages = {
        'required': 'The supplier is required.',
        'blank': 'The supplier cannot be blank.',
        'null': 'The supplier cannot be blank.',
        'max_length': 'The supplier cannot exceed 100 characters.',
    }, max_length = 100)

    description = serializers.CharField(error_messages = {
        'required': 'The description is required.',
        'blank': 'The description cannot be blank.',
        'null': 'The description cannot be blank.',
        'max_length': 'The description cannot exceed 254 characters.',
    }, max_length = 254)

    location_id = serializers.IntegerField(error_messages = {
        'required': 'The location is required.',
        'blank': 'The location cannot be blank.',
        'null': 'The location cannot be blank.',
        'invalid': 'The location is invalid.',
    })

    user_id = serializers.IntegerField(error_messages = {
        'required': 'The user is required.',
        'blank': 'The user cannot be blank.',
        'null': 'The user cannot be blank.',
        'invalid': 'The user is invalid.',
    })

    def to_internal_value(self, data):
        if 'location' in data and isinstance(data['location'], dict) and 'id' in data['location']:
            data['location_id'] = data['location']['id']
        
        if 'user' in data and isinstance(data['user'], dict) and 'id' in data['user']:
            data['user_id'] = data['user']['id']
        
        if data.get('location_id') in [0, '0']:
            data['location_id'] = None
        
        if data.get('user_id') in [0, '0']:
            data['user_id'] = None

        return super().to_internal_value(data)
    
    class Meta:
        model = CashRegisterModel
        exclude = ['id', 'location', 'user']

class GetCashRegisterSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(error_messages = {
        'required': 'The cash register is required.',
        'blank': 'The cash register cannot be blank.',
        'null': 'The cash register cannot be blank.',
        'invalid': 'The cash register is invalid.',
    })
    
    class Meta:
        model = CashRegisterModel
        fields = ['id']

#Expenses
class ExpensesSerializer(serializers.ModelSerializer):
    total_paid = serializers.SerializerMethodField()
    supplier = SuppliersSerializer(read_only = True)
    user = UserExcludeSerializer(read_only = True)

    def get_total_paid(self, obj):
        model = ExpensePaymentsModel.objects.filter(expense_id = obj.id)
        total_paid = model.aggregate(total = Sum('amount'))['total'] or 0 

        return total_paid
    
    class Meta:
        model = ExpensesModel
        fields = '__all__'

class AddEditExpenseSerializer(serializers.ModelSerializer):
    no = serializers.CharField(error_messages = {
        'required': 'The no is required.',
        'blank': 'The no cannot be blank.',
        'null': 'The no cannot be blank.',
        'max_length': 'The no cannot exceed 254 characters.',
    })

    transaction_number = serializers.CharField(error_messages = {
        'required': 'The transaction number is required.',
        'blank': 'The transaction number cannot be blank.',
        'null': 'The transaction number cannot be blank.',
        'max_length': 'The transaction number cannot exceed 254 characters.',
    })

    total = serializers.FloatField(error_messages = {
        'required': 'The total is required.',
        'blank': 'The total cannot be blank.',
        'null': 'The total cannot be blank.',
        'invalid': 'The total is invalid.',
    })

    date_limit = serializers.DateField(error_messages = {
        'required': 'The date limit is required.',
        'blank': 'The date limit cannot be blank.',
        'null': 'The date limit cannot be blank.',
        'invalid': 'The date limit is invalid.',
    })

    date_reg = serializers.DateField(error_messages = {
        'required': 'The date registration is required.',
        'blank': 'The date registration cannot be blank.',
        'null': 'The date registration cannot be blank.',
        'invalid': 'The date registration is invalid.',
    })

    supplier_id = serializers.UUIDField(error_messages = {
        'required': 'The supplier is required.',
        'blank': 'The supplier cannot be blank.',
        'null': 'The supplier cannot be blank.',
        'invalid': 'The supplier is invalid.',
    })

    user_id = serializers.IntegerField(error_messages = {
        'required': 'The user is required.',
        'blank': 'The user cannot be blank.',
        'null': 'The user cannot be blank.',
        'invalid': 'The user is invalid.',
    })
    
    class Meta:
        model = ExpensesModel
        exclude = ['id', 'supplier', 'user']

class GetExpenseSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(error_messages = {
        'required': 'The expense is required.',
        'blank': 'The expense cannot be blank.',
        'null': 'The expense cannot be blank.',
        'invalid': 'The expense is invalid.',
    })
    
    class Meta:
        model = ExpensesModel
        fields = ['id']

#Expense details
class ExpenseDetailsSerializer(serializers.ModelSerializer):
    expense = ExpensesSerializer(read_only = True)
    product = ProductsSerializer(read_only = True)
    user = UserExcludeSerializer(read_only = True)

    class Meta:
        model = ExpenseDetailsModel
        fields = '__all__'

class AddEditExpenseDetailsSerializer(serializers.ModelSerializer):
    cost = serializers.FloatField(error_messages = {
        'required': 'The quantity is required.',
        'blank': 'The quantity cannot be blank.',
        'null': 'The quantity cannot be blank.',
        'invalid': 'The quantity is invalid.',
    })

    quantity = serializers.FloatField(error_messages = {
        'required': 'The quantity is required.',
        'blank': 'The quantity cannot be blank.',
        'null': 'The quantity cannot be blank.',
        'invalid': 'The quantity is invalid.',
    })    

    product_id = serializers.UUIDField(error_messages = {
        'required': 'The product is required.',
        'blank': 'The product cannot be blank.',
        'null': 'The product cannot be blank.',
        'invalid': 'The product is invalid.',
    })

    expense_id = serializers.UUIDField(error_messages = {
        'required': 'The expense is required.',
        'blank': 'The expense cannot be blank.',
        'null': 'The expense cannot be blank.',
        'invalid': 'The expense is invalid.',
    })

    user_id = serializers.IntegerField(error_messages = {
        'required': 'The user is required.',
        'blank': 'The user cannot be blank.',
        'null': 'The user cannot be blank.',
        'invalid': 'The user is invalid.',
    })
    
    class Meta:
        model = ExpenseDetailsModel
        exclude = ['id', 'product', 'expense', 'user']

class GetExpenseDetailsSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(error_messages = {
        'required': 'The expense detail is required.',
        'blank': 'The expense detail cannot be blank.',
        'null': 'The expense detail cannot be blank.',
        'invalid': 'The expense detail is invalid.',
    })
    
    class Meta:
        model = ExpenseDetailsModel
        fields = ['id']

#Banks
class BanksSerializer(serializers.ModelSerializer):
    class Meta:
        model = BanksModel
        fields = '__all__'

class AddEditBankSerializer(serializers.ModelSerializer):
    name = serializers.CharField(error_messages = {
        'required': 'The name is required.',
        'blank': 'The name cannot be blank.',
        'null': 'The name cannot be blank.',
        'max_length': 'The name cannot exceed 254 characters.',
    })
    
    class Meta:
        model = BanksModel
        exclude = ['id']

class GetBankSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(error_messages = {
        'required': 'The bank is required.',
        'blank': 'The bank cannot be blank.',
        'null': 'The bank cannot be blank.',
        'invalid': 'The bank is invalid.',
    })
    
    class Meta:
        model = BanksModel
        fields = ['id']

#Expense payments
class ExpensePaymentsSerializer(serializers.ModelSerializer):
    user = UserExcludeSerializer(read_only = True)
    payment_method = PaymentMethodsSerializer(read_only = True)
    bank = BanksSerializer(read_only = True)

    class Meta:
        model = ExpensePaymentsModel
        fields = '__all__'

class AddEditExpensePaymentSerializer(serializers.ModelSerializer):
    amount = serializers.FloatField(error_messages = {
        'required': 'The amount is required.',
        'blank': 'The amount cannot be blank.',
        'null': 'The amount cannot be blank.',
        'invalid': 'The amount is invalid.',
    })

    note = serializers.CharField(error_messages = {
        'required': 'The note is required.',
        'blank': 'The note cannot be blank.',
        'null': 'The note cannot be blank.',
        'max_length': 'The note cannot exceed 100 characters.',
    }, required = False, max_length = 100, allow_blank = True, allow_null = True)

    date_reg = serializers.DateField(error_messages = {
        'required': 'The date registration is required.',
        'blank': 'The date registration cannot be blank.',
        'null': 'The date registration cannot be blank.',
        'invalid': 'The date registration is invalid.',
    })

    expense_id = serializers.UUIDField(error_messages = {
        'required': 'The expense is required.',
        'blank': 'The expense cannot be blank.',
        'null': 'The expense cannot be blank.',
        'invalid': 'The expense is invalid.',
    })
    
    payment_method_id = serializers.IntegerField(error_messages = {
        'required': 'The payment method is required.',
        'blank': 'The payment method cannot be blank.',
        'null': 'The payment method cannot be blank.',
        'invalid': 'The payment method is invalid.',
    })

    user_id = serializers.IntegerField(error_messages = {
        'required': 'The user is required.',
        'blank': 'The user cannot be blank.',
        'null': 'The user cannot be blank.',
        'invalid': 'The user is invalid.',
    })

    bank_id = serializers.IntegerField(error_messages = {
        'required': 'The bank is required.',
        'blank': 'The bank cannot be blank.',
        'null': 'The bank cannot be blank.',
        'invalid': 'The bank is invalid.',
    })
    
    class Meta:
        model = ExpensePaymentsModel
        exclude = ['id', 'expense', 'user', 'payment_method', 'bank']

class GetExpensePaymentSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(error_messages = {
        'required': 'The expense payment is required.',
        'blank': 'The expense payment cannot be blank.',
        'null': 'The expense payment cannot be blank.',
        'invalid': 'The expense payment is invalid.',
    })
    
    class Meta:
        model = ExpensePaymentsModel
        fields = ['id']

#Guarantees
class GuaranteesSerializer(serializers.ModelSerializer):
    sale = SalesSerializer(read_only = True)
    expense_detail = ExpenseDetailsSerializer(read_only = True)

    class Meta:
        model = GuaranteesModel
        fields = '__all__'

class AddEditWarrantySerializer(serializers.ModelSerializer):
    note = serializers.CharField(error_messages = {
        'required': 'The note is required.',
        'blank': 'The note cannot be blank.',
        'null': 'The note cannot be blank.',
        'max_length': 'The note cannot exceed 254 characters.',
    }, required = False, max_length = 254, allow_blank = True, allow_null = True)
    
    sale_id = serializers.IntegerField(error_messages = {
        'required': 'The sale is required.',
        'blank': 'The sale cannot be blank.',
        'null': 'The sale cannot be blank.',
        'invalid': 'The sale is invalid.',
    })

    expense_detail_id = serializers.IntegerField(error_messages = {
        'required': 'The expense detail is required.',
        'blank': 'The expense detail cannot be blank.',
        'null': 'The expense detail cannot be blank.',
        'invalid': 'The expense detail is invalid.',
    })
    
    class Meta:
        model = GuaranteesModel
        exclude = ['id', 'sale', 'expense_detail']

class GetWarrantySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(error_messages = {
        'required': 'The warranty is required.',
        'blank': 'The warranty cannot be blank.',
        'null': 'The warranty cannot be blank.',
        'invalid': 'The warranty is invalid.',
    })
    
    class Meta:
        model = GuaranteesModel
        fields = ['id']