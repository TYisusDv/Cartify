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

class AddressesModel(models.Model):
    id = models.AutoField(primary_key = True)
    street = models.CharField(max_length = 100, null = False, blank = False)
    area = models.CharField(max_length = 50, null = True, blank = False)
    city = models.ForeignKey(CitiesModel, null = False, blank = False, on_delete = models.RESTRICT)

    class Meta: 
        db_table = 'addresses'

class PersonsModel(models.Model):
    id = models.AutoField(primary_key = True)
    identification_id = models.CharField(max_length = 100, null = False, blank = False)
    identification_picture = models.ImageField( upload_to = upload_to_identifications, null = True, blank = False)
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
    addresses = models.ManyToManyField(AddressesModel, through='PersonsAddresses')

    def delete(self, *args, **kwargs):
        if self.profile_picture:
            if os.path.isfile(self.profile_picture.path):
                os.remove(self.profile_picture.path)
        if self.identification_picture:
            if os.path.isfile(self.identification_picture.path):
                os.remove(self.identification_picture.path)
        super().delete(*args, **kwargs)

    class Meta: 
        db_table = 'persons'

class PersonsAddresses(models.Model):
    person = models.ForeignKey(PersonsModel, on_delete = models.CASCADE)
    address = models.ForeignKey(AddressesModel, on_delete = models.CASCADE)

    class Meta: 
        db_table = 'persons_addresses'

class TypesClientsModel(models.Model):
    id = models.AutoField(primary_key = True)
    name = models.CharField(max_length = 50, null = False, blank = False)
    
    class Meta: 
        db_table = 'types_clients'

class ClientsModel(models.Model):
    id = models.AutoField(primary_key = True)
    email = models.EmailField(null = True, blank = False)
    allow_credit = models.BooleanField(default = True, null = False, blank = False)
    note = models.CharField(max_length = 100, null = True, blank = False)
    date_reg = models.DateTimeField(null = False, blank = False, default = timezone.now)
    location = models.ForeignKey(LocationsModel, null = False, blank = False, on_delete = models.RESTRICT)
    type = models.ForeignKey(TypesClientsModel, null = True, blank = False, on_delete = models.RESTRICT)
    person = models.OneToOneField(PersonsModel, on_delete = models.CASCADE)

    class Meta: 
        db_table = 'clients'