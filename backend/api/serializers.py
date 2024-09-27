from rest_framework import serializers
from django.core.files.base import ContentFile
from django.contrib.auth.models import User
from django.core.validators import FileExtensionValidator
from .models import *
import json, base64

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

#User
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class UserExcludeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ['password', 'last_login', 'is_superuser', 'is_staff', 'is_active', 'date_joined', 'groups', 'user_permissions']

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
    
    class Meta:
        model = AddressesModel
        fields = ['street', 'area', 'city_id', 'person_id']

#Identification images
class IdentificationImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = IdentificationImages
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

    profile_image = serializers.ImageField(
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
        child = serializers.ImageField(
            error_messages={
                'invalid': 'One or more identification images are invalid.',
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
        identification_images = validated_data.pop('identification_images', [])
        person_instance = super().create(validated_data)

        for image in identification_images:
            IdentificationImages.objects.create(person = person_instance, image = image)

        return person_instance
    
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == 'profile_image':
                if value:
                    if instance.profile_image:
                        instance.profile_image.delete(save = False)

                    setattr(instance, attr, value)
            elif attr == 'identification_images':
                if value:  
                    #existing_images = IdentificationImages.objects.filter(person=instance)
                    #for image in existing_images:
                    #    image.image.delete(save=False)
                    
                    #existing_images.delete()

                    for image in value:
                        IdentificationImages.objects.create(person = instance, image = image)
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

#Inventory
class InventorySerializer(serializers.ModelSerializer):
    product = ProductsSerializer(read_only = True)
    location = LocationsSerializer(read_only = True)
    user = UserExcludeSerializer(read_only = True)
    location_transfer = LocationsSerializer(read_only = True)
    user_transfer = UserExcludeSerializer(read_only = True)

    class Meta:
        model = InventoryModel
        fields = '__all__'

class AddEditInventorySerializer(serializers.ModelSerializer):
    type = serializers.IntegerField(error_messages = {
        'required': 'The inventory type is required.',
        'blank': 'The inventory type cannot be blank.',
        'null': 'The inventory type cannot be blank.',
        'invalid': 'The inventory type is invalid.',
    }, required = True)

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

    location_transfer_id = serializers.IntegerField(error_messages = {
        'required': 'The location is required.',
        'blank': 'The location cannot be blank.',
        'null': 'The location cannot be blank.',
        'invalid': 'The location is invalid.',
    }, required = False, allow_null = True)

    user_transfer_id = serializers.IntegerField(error_messages = {
        'required': 'The user is required.',
        'blank': 'The user cannot be blank.',
        'null': 'The user cannot be blank.',
        'invalid': 'The user is invalid.',
    }, required = False, allow_null = True)

    def to_internal_value(self, data):
        if 'product' in data and isinstance(data['product'], dict) and 'id' in data['product']:
            data['product_id'] = data['product']['id']
        
        if 'location' in data and isinstance(data['location'], dict) and 'id' in data['location']:
            data['location_id'] = data['location']['id']
        
        if 'location_transfer' in data and isinstance(data['location_transfer'], dict) and 'id' in data['location_transfer']:
            data['location_transfer_id'] = data['location_transfer']['id']
        
        if 'user_transfer' in data and isinstance(data['user_transfer'], dict) and 'id' in data['user_transfer']:
            data['user_transfer_id'] = data['user_transfer']['id']
        
        if data.get('product_id') in [0, '0']:
            data['product_id'] = None
        
        if data.get('location_id') in [0, '0']:
            data['location_id'] = None
        
        if data.get('location_transfer_id') in [0, '0']:
            data['location_transfer_id'] = None
        
        if data.get('user_transfer_id') in [0, '0']:
            data['user_transfer_id'] = None

        return super().to_internal_value(data)

    class Meta:
        model = InventoryModel
        exclude = ['id', 'product', 'location', 'user', 'location_transfer', 'user_transfer']
    
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