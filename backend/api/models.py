from django.db import models
from django.utils import timezone
import uuid, os

def upload_to_identifications(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'
    return os.path.join('identifications', filename)

def upload_to_profiles(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'
    return os.path.join('profiles', filename)

class LocationsModel(models.Model):
    id = models.AutoField(primary_key = True)
    name = models.CharField(max_length = 50, null = False, blank = False)
    status = models.BooleanField(default = True, null = False, blank = False)
    
    class Meta: 
        db_table = 'locations'

class TypesIdsModel(models.Model):
    id = models.AutoField(primary_key = True)
    name = models.CharField(max_length = 50, null = False, blank = False)
    status = models.BooleanField(default = True, null = False, blank = False)
    
    class Meta: 
        db_table = 'types_ids'

class CountriesModel(models.Model):
    id = models.AutoField(primary_key = True)
    name = models.CharField(max_length = 50, null = False, blank = False)
    
    class Meta: 
        db_table = 'countries'

class StatesModel(models.Model):
    id = models.AutoField(primary_key = True)
    name = models.CharField(max_length = 50, null = False, blank = False)
    country = models.ForeignKey(CountriesModel, null = False, blank = False, on_delete = models.RESTRICT)

    class Meta: 
        db_table = 'states'

class CitiesModel(models.Model):
    id = models.AutoField(primary_key = True)
    name = models.CharField(max_length = 50, null = False, blank = False)
    state = models.ForeignKey(StatesModel, null = False, blank = False, on_delete = models.RESTRICT)
    
    class Meta: 
        db_table = 'cities'

class PersonsModel(models.Model):
    id = models.AutoField(primary_key = True)
    identification_id = models.CharField(max_length = 100, null = False, blank = False)
    profile_picture = models.ImageField(upload_to = upload_to_profiles, null = True, blank = False)
    alias = models.CharField(max_length = 50, null = True, blank = False)
    occupation = models.CharField(max_length = 50, null = True, blank = False)
    firstname = models.CharField(max_length = 50, null = False, blank = False)
    middlename = models.CharField(max_length = 50, null = True, blank = False)
    lastname = models.CharField(max_length = 50, null = False, blank = False)
    second_lastname = models.CharField(max_length = 50, null = True, blank = False)
    mobile = models.CharField(max_length = 20, null = True, blank = False)
    phone = models.CharField(max_length = 20, null = True, blank = False)
    birthdate = models.DateField(null = True, blank = False)
    type_id = models.ForeignKey(TypesIdsModel, null = False, blank = False, on_delete = models.RESTRICT)

    def delete(self, *args, **kwargs):
        if self.profile_picture:
            if os.path.isfile(self.profile_picture.path):
                os.remove(self.profile_picture.path)

        for identification_picture in self.identification_pictures.all():
            if identification_picture.image:
                if os.path.isfile(identification_picture.image.path):
                    os.remove(identification_picture.image.path)
            identification_picture.delete()

        super().delete(*args, **kwargs)

    class Meta: 
        db_table = 'persons'

class AddressesModel(models.Model):
    id = models.AutoField(primary_key = True)
    street = models.CharField(max_length = 100, null = False, blank = False)
    area = models.CharField(max_length = 50, null = True, blank = False)
    city = models.ForeignKey(CitiesModel, null = False, blank = False, on_delete = models.RESTRICT)
    person = models.ForeignKey(PersonsModel, related_name='addresses', null = False, blank = False, on_delete = models.CASCADE)

    class Meta:
        db_table = 'addresses'

class IdentificationPictures(models.Model):
    person = models.ForeignKey(PersonsModel, related_name = 'identification_pictures', on_delete = models.CASCADE)
    image = models.ImageField(upload_to = upload_to_identifications, null = True, blank = False)

    class Meta: 
        db_table = 'identification_pictures'

class ClientTypesModel(models.Model):
    id = models.AutoField(primary_key = True)
    name = models.CharField(max_length = 50, null = False, blank = False)
    
    class Meta: 
        db_table = 'client_types'

class ClientsModel(models.Model):
    id = models.AutoField(primary_key = True)
    email = models.EmailField(null = True, blank = False)
    allow_credit = models.BooleanField(default = True, null = False, blank = False)
    note = models.CharField(max_length = 100, null = True, blank = False)
    date_reg = models.DateTimeField(null = False, blank = False, default = timezone.now)
    location = models.ForeignKey(LocationsModel, null = False, blank = False, on_delete = models.RESTRICT)
    type = models.ForeignKey(ClientTypesModel, null = True, blank = False, on_delete = models.RESTRICT)
    person = models.OneToOneField(PersonsModel, on_delete = models.CASCADE)

    class Meta: 
        db_table = 'clients'

class ContactTypesModel(models.Model):
    id = models.AutoField(primary_key = True)
    name = models.CharField(max_length = 50, null = False, blank = False)
    
    class Meta: 
        db_table = 'contact_types'

class ClientContactsModel(models.Model):
    id = models.AutoField(primary_key = True)
    relationship = models.CharField(max_length = 100, null = False, blank = False)
    fullname = models.CharField(null = False, blank = False)
    phone = models.CharField(max_length = 20, null = False, blank = False)
    address = models.CharField(null = False, blank = False)
    type = models.ForeignKey(ContactTypesModel, on_delete = models.RESTRICT)
    client = models.ForeignKey(ClientsModel, related_name = 'contacts', on_delete = models.CASCADE) 
    
    class Meta: 
        db_table = 'client_contacts'

class SuppliersModel(models.Model):
    id = models.AutoField(primary_key = True)
    company_name = models.CharField(max_length = 100, null = False, blank = False)
    company_identification = models.CharField(max_length = 50, null = True, blank = False)
    company_email = models.EmailField(null = True, blank = False)
    company_phone = models.CharField(max_length = 20, null = True, blank = False)
    company_phone_2 = models.CharField(max_length = 20, null = True, blank = False)
    company_address = models.CharField(null = True, blank = False)
    advisor_fullname = models.CharField(null = True, blank = False)
    advisor_email = models.EmailField(null = True, blank = False)
    advisor_phone = models.CharField(max_length = 20, null = True, blank = False)
    advisor_phone_2 = models.CharField(max_length = 20, null = True, blank = False)
    
    class Meta: 
        db_table = 'suppliers'

class ProductBrandsModel(models.Model):
    id = models.AutoField(primary_key = True)
    name = models.CharField(null = False, blank = False)
    status = models.BooleanField(default = True, null = False, blank = False)
    
    class Meta: 
        db_table = 'product_brands'

class ProductCategoriesModel(models.Model):
    id = models.AutoField(primary_key = True)
    name = models.CharField(null = False, blank = False)
    status = models.BooleanField(default = True, null = False, blank = False)
    
    class Meta: 
        db_table = 'product_categories'

class TaxesModel(models.Model):
    id = models.AutoField(primary_key = True)
    name = models.CharField(null = False, blank = False)
    value = models.FloatField(default = 0, null = False, blank = False)
    status = models.BooleanField(default = True, null = False, blank = False)
    
    class Meta: 
        db_table = 'taxes'

class ProductsModel(models.Model):
    id = models.AutoField(primary_key = True)
    barcode = models.CharField(max_length = 50, null = True, blank = False)
    name = models.CharField(null = False, blank = False)
    model = models.CharField(max_length = 50, null = True, blank = False)
    note = models.CharField(max_length = 100, null = True, blank = False)
    cost_price = models.FloatField(default = 0, null = False, blank = False)
    cash_profit = models.FloatField(default = 0, null = False, blank = False)
    cash_price = models.FloatField(default = 0, null = False, blank = False)
    credit_price = models.FloatField(default = 0, null = False, blank = False)
    credit_profit = models.FloatField(default = 0, null = False, blank = False)
    min_stock = models.IntegerField(default = 0, null = False, blank = False)
    category = models.ForeignKey(ProductCategoriesModel, null = True, blank = False, on_delete = models.RESTRICT)
    brand = models.ForeignKey(ProductBrandsModel, null = True, blank = False, on_delete = models.RESTRICT)
    supplier = models.ForeignKey(SuppliersModel, null = True, blank = False, on_delete = models.RESTRICT) 
    tax = models.ForeignKey(TaxesModel, null = True, on_delete = models.RESTRICT)   
    
    class Meta: 
        db_table = 'products'