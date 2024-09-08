from django.db import models
from django.utils import timezone

class LocationsModel(models.Model):
    id = models.AutoField(primary_key = True)
    name = models.CharField(max_length = 50, null = False)
    status = models.BooleanField(default = True, null = False)
    
    class Meta: 
        db_table = 'locations'

class TypesOfIdsModel(models.Model):
    id = models.AutoField(primary_key = True)
    name = models.CharField(max_length = 50, null = False)
    status = models.BooleanField(default = True, null = False)
    
    class Meta: 
        db_table = 'types_of_ids'

class CountriesModel(models.Model):
    id = models.AutoField(primary_key = True)
    name = models.CharField(max_length = 50, null = False)
    
    class Meta: 
        db_table = 'countries'

class StatesModel(models.Model):
    id = models.AutoField(primary_key = True)
    name = models.CharField(max_length = 50, null = False)
    country = models.ForeignKey(CountriesModel, null = False, on_delete = models.RESTRICT)

    class Meta: 
        db_table = 'states'

class CitiesModel(models.Model):
    id = models.AutoField(primary_key = True)
    name = models.CharField(max_length = 50, null = False)
    state = models.ForeignKey(StatesModel, null = False, on_delete = models.RESTRICT)
    
    class Meta: 
        db_table = 'cities'

class AddressesModel(models.Model):
    id = models.AutoField(primary_key = True)
    street = models.CharField(max_length = 100, null = False)
    area = models.CharField(max_length = 50, null = True)
    city = models.ForeignKey(CitiesModel, null = False, on_delete = models.RESTRICT)

    class Meta: 
        db_table = 'addresses'

class PersonsModel(models.Model):
    id = models.AutoField(primary_key = True)
    identification_id = models.CharField(max_length = 100, null = False)
    alias = models.CharField(max_length = 50, null = True)
    firstname = models.CharField(max_length = 50, null = False)
    middlename = models.CharField(max_length = 50, null = True)
    lastname = models.CharField(max_length = 50, null = False)
    second_lastname = models.CharField(max_length = 50, null = True)
    mobile = models.CharField(max_length = 20, null = True)
    phone = models.CharField(max_length = 20, null = True)
    birthdate = models.DateField(null = True)
    type_of_ids = models.ForeignKey(TypesOfIdsModel, null = False, on_delete = models.RESTRICT)
    addresses = models.ManyToManyField(AddressesModel, through='PersonsAddresses')

    class Meta: 
        db_table = 'persons'

class PersonsAddresses(models.Model):
    person = models.ForeignKey(PersonsModel, on_delete = models.CASCADE)
    address = models.ForeignKey(AddressesModel, on_delete = models.CASCADE)

    class Meta: 
        db_table = 'persons_addresses'

class ClientsModel(models.Model):
    id = models.AutoField(primary_key = True)
    email = models.EmailField(null = True)
    client_class = models.CharField(max_length = 100, null = True, db_column = 'class')
    allow_credit = models.BooleanField(default = True, null = False)
    note = models.CharField(max_length = 100, null = True)
    date_reg = models.DateTimeField(null = False, default = timezone.now)
    location = models.ForeignKey(LocationsModel, null = False, on_delete = models.RESTRICT)
    person = models.OneToOneField(PersonsModel, on_delete = models.CASCADE)

    class Meta: 
        db_table = 'clients'