from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.core.files.storage import default_storage
import uuid, os

def upload_to_identifications(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'
    return os.path.join('identifications', filename)

def upload_to_profiles(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'
    return os.path.join('profiles', filename)

def upload_to_products(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'
    return os.path.join('products', filename)

def upload_to_signatures(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'
    return os.path.join('signatures', filename)


class LocationsModel(models.Model):
    id = models.AutoField(primary_key = True)
    name = models.CharField(max_length = 50, null = False, blank = False)
    status = models.BooleanField(default = True, null = False, blank = False)
    
    class Meta: 
        db_table = 'locations'

class ProfilesModel(models.Model):
    user = models.OneToOneField(User, related_name = 'profile', primary_key = True, on_delete = models.RESTRICT)
    phone = models.CharField(max_length = 50, null = True, blank = False)
    commission = models.FloatField(default = 0)
    location = models.ForeignKey(LocationsModel, null = True, blank = False, on_delete = models.RESTRICT)
    
    class Meta: 
        db_table = 'profiles'

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
    id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
    identification_id = models.CharField(max_length = 100, null = False, blank = False)
    profile_image = models.ImageField(upload_to = upload_to_profiles, null = True, blank = False)
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
        if self.profile_image:
            if os.path.isfile(self.profile_image.path):
                os.remove(self.profile_image.path)

        for identification_image in self.identification_images.all():
            if identification_image.image:
                if os.path.isfile(identification_image.image.path):
                    os.remove(identification_image.image.path)
            identification_image.delete()

        super().delete(*args, **kwargs)

    class Meta: 
        db_table = 'persons'

class AddressesModel(models.Model):
    id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
    street = models.CharField(max_length = 100, null = False, blank = False)
    area = models.CharField(max_length = 50, null = True, blank = False)
    city = models.ForeignKey(CitiesModel, null = False, blank = False, on_delete = models.RESTRICT)
    person = models.ForeignKey(PersonsModel, related_name='addresses', null = False, blank = False, on_delete = models.CASCADE)

    class Meta:
        db_table = 'addresses'

class IdentificationImagesModel(models.Model):
    person = models.ForeignKey(PersonsModel, related_name = 'identification_images', on_delete = models.CASCADE)
    image = models.ImageField(upload_to = upload_to_identifications, null = True, blank = False)

    class Meta: 
        db_table = 'identification_images'

class ClientTypesModel(models.Model):
    id = models.AutoField(primary_key = True)
    name = models.CharField(max_length = 50, null = False, blank = False)
    
    class Meta: 
        db_table = 'client_types'

class ClientsModel(models.Model):
    id = models.AutoField(primary_key = True)
    email = models.EmailField(null = True, blank = False)
    allow_credit = models.BooleanField(default = True, null = False, blank = False)
    marital_status = models.CharField(max_length = 100, null = True, blank = False)
    nationality = models.CharField(max_length = 100, null = True, blank = False)
    income_amount = models.FloatField(default = 0, null = False, blank = False)
    current_job = models.CharField(max_length = 100, null = True, blank = False)
    time_job = models.CharField(max_length = 100, null = True, blank = False)
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
    id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
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
    name = models.CharField(max_length = 100, null = False, blank = False)
    status = models.BooleanField(default = True, null = False, blank = False)
    
    class Meta: 
        db_table = 'product_brands'

class ProductCategoriesModel(models.Model):
    id = models.AutoField(primary_key = True)
    name = models.CharField(max_length = 100, null = False, blank = False)
    page_number = models.IntegerField(default = 1, null = False, blank = False)
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
    id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
    barcode = models.CharField(max_length = 50, null = True, blank = False)
    name = models.CharField(null = False, blank = False)
    model = models.CharField(max_length = 50, null = True, blank = False)
    note = models.CharField(max_length = 100, null = True, blank = False)
    cost_price = models.FloatField(default = 0, null = False, blank = False)
    cash_profit = models.FloatField(default = 0, null = False, blank = False)
    cash_price = models.FloatField(default = 0, null = False, blank = False)
    credit_profit = models.FloatField(default = 0, null = False, blank = False)
    credit_price = models.FloatField(default = 0, null = False, blank = False)
    min_stock = models.IntegerField(default = 0, null = False, blank = False)
    date_reg = models.DateTimeField(null = False, blank = False, default = timezone.now)
    category = models.ForeignKey(ProductCategoriesModel, null = True, blank = False, on_delete = models.RESTRICT)
    brand = models.ForeignKey(ProductBrandsModel, null = True, blank = False, on_delete = models.RESTRICT)
    supplier = models.ForeignKey(SuppliersModel, null = True, blank = False, on_delete = models.RESTRICT) 
    tax = models.ForeignKey(TaxesModel, null = True, blank = False, on_delete = models.RESTRICT)
    status = models.BooleanField(default = True, null = False, blank = False)
    
    def delete(self, *args, **kwargs):
        for image in self.product_images.all():
            if image.image:
                if os.path.isfile(image.image.path):
                    os.remove(image.image.path)
            image.delete()

        super().delete(*args, **kwargs)
        
    class Meta: 
        db_table = 'products'

class ProductImagesModel(models.Model):
    product = models.ForeignKey(ProductsModel, related_name = 'product_images', on_delete = models.RESTRICT)
    image = models.ImageField(upload_to = upload_to_products, null = True, blank = False)

    class Meta: 
        db_table = 'product_images'

class PaymentMethodsModel(models.Model):
    id = models.AutoField(primary_key = True)
    name = models.CharField(null = False, blank = False)
    value = models.FloatField(default = 0, null = False, blank = False)
    status = models.BooleanField(default = True, null = False, blank = False)
    allow_discount = models.BooleanField(default = True, null = False, blank = False)
    allow_note = models.BooleanField(default = True, null = False, blank = False)
    
    class Meta: 
        db_table = 'payment_methods'

class SaleStatusModel(models.Model):
    id = models.AutoField(primary_key = True)
    name = models.CharField(max_length = 100, null = False, blank = False)
    calculate = models.BooleanField(default = True, null = False, blank = False)  

    class Meta: 
        db_table = 'sale_status'

class SalesModel(models.Model):
    id = models.IntegerField(primary_key = True)
    discount_per = models.FloatField(default = 0, null = False, blank = False)
    discount = models.FloatField(default = 0, null = False, blank = False)
    total = models.FloatField(default = 0, null = False, blank = False)
    type = models.IntegerField(default = 1, null = False, blank = False)
    quantity_of_payments = models.IntegerField(default = 1, null = False, blank = False)
    payment_days = models.IntegerField(null = True, blank = False)
    note = models.CharField(max_length = 100, null = True, blank = False)
    date_reg = models.DateField(null = False, blank = False, default = timezone.now)
    client = models.ForeignKey(ClientsModel, null = False, blank = False, on_delete = models.RESTRICT)
    location = models.ForeignKey(LocationsModel, null = False, blank = False, on_delete = models.RESTRICT)
    user = models.ForeignKey(User, null = False, blank = False, on_delete = models.RESTRICT)
    status = models.ForeignKey(SaleStatusModel, null = False, blank = False, on_delete = models.RESTRICT)

    class Meta: 
        db_table = 'sales'

class SalePaymentsModel(models.Model):
    id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
    no = models.IntegerField(unique = True, null = True, blank = False)
    subtotal = models.FloatField(default = 0, null = False, blank = False)
    commission = models.FloatField(default = 0, null = False, blank = False)
    surcharge = models.FloatField(default = 0, null = False, blank = False)
    discount_per = models.FloatField(default = 0, null = False, blank = False)
    discount = models.FloatField(default = 0, null = False, blank = False)
    total = models.FloatField(default = 0, null = False, blank = False)
    total_paid = models.FloatField(default = 0, null = False, blank = False)
    total_remaining = models.FloatField(default = 0, null = False, blank = False)
    pay = models.FloatField(default = 0, null = False, blank = False)
    change = models.FloatField(default = 0, null = False, blank = False)
    note = models.CharField(max_length = 100, null = True, blank = False)
    date_reg = models.DateTimeField(null = True, blank = False)
    date_limit = models.DateTimeField(null = True, blank = False)
    user = models.ForeignKey(User, null = True, blank = False, related_name='sale_payments_user', on_delete = models.RESTRICT)
    location = models.ForeignKey(LocationsModel, null = True, blank = False, related_name='sale_payments_location', on_delete = models.RESTRICT)
    payment_method = models.ForeignKey(PaymentMethodsModel, null = True, blank = False, related_name='sale_payments_payment_method', on_delete = models.RESTRICT)
    sale = models.ForeignKey(SalesModel, null = False, blank = False, related_name='sale_payments_sale', on_delete = models.RESTRICT)
    
    class Meta: 
        db_table = 'sales_payments'

class SaleReceiptModel(models.Model):
    id = models.AutoField(primary_key = True, editable = False)
    prompter = models.CharField(max_length = 50, unique = True, null = False, blank = False)
    description = models.CharField(null = False, blank = False)
    
    class Meta: 
        db_table = 'sale_receipt'

class InventoryTypesModel(models.Model):
    id = models.AutoField(primary_key = True)
    name = models.CharField(max_length = 100, null = False, blank = False)
    type = models.IntegerField(null = False, blank = False)  

    class Meta: 
        db_table = 'inventory_types'

class InventoryModel(models.Model):
    id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
    price = models.FloatField(default = 0, null = False, blank = False)
    cost = models.FloatField(default = 0, null = False, blank = False)
    quantity = models.FloatField(default = 0, null = False, blank = False)
    note = models.CharField(max_length = 100, null = True, blank = False)
    type_inventory = models.IntegerField(null = False, blank = False)
    date_reg = models.DateTimeField(null = False, blank = False, default = timezone.now)
    type = models.ForeignKey(InventoryTypesModel, on_delete = models.RESTRICT)
    product = models.ForeignKey(ProductsModel, on_delete = models.RESTRICT)
    location = models.ForeignKey(LocationsModel, on_delete = models.RESTRICT)
    user = models.ForeignKey(User, on_delete = models.RESTRICT)
    location_transfer = models.ForeignKey(LocationsModel, null = True, blank = False, related_name='inventory_location_transfer', on_delete = models.RESTRICT)
    user_transfer = models.ForeignKey(User, null = True, blank = False, related_name='inventory_user_transfer', on_delete = models.RESTRICT)
    user_transfer_receives = models.ForeignKey(User, null = True, blank = False, related_name='inventory_user_transfer_receives', on_delete = models.RESTRICT)
    sale = models.ForeignKey(SalesModel, null = True, blank = False, related_name='inventory_sale', on_delete = models.RESTRICT)
    
    class Meta: 
        db_table = 'inventory'

class CashRegisterModel(models.Model):
    id = models.AutoField(primary_key = True)
    no = models.CharField(max_length = 100, null = False, blank = False)   
    amount = models.FloatField(default = 0, null = False, blank = False)
    supplier = models.CharField(max_length = 100, null = False, blank = False)   
    description = models.CharField(null = False, blank = False)   
    date_reg = models.DateTimeField(null = False, blank = False, default = timezone.now)
    location = models.ForeignKey(LocationsModel, on_delete = models.RESTRICT)
    user = models.ForeignKey(User, on_delete = models.RESTRICT)
    
    class Meta: 
        db_table = 'cash_register'

class ExpensesModel(models.Model):
    id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
    no = models.CharField(unique = True, null = False, blank = False)
    transaction_number = models.CharField(null = False, blank = False)
    total = models.FloatField(default = 0, null = False, blank = False)
    date_limit = models.DateField(null = True, blank = False)
    date_reg = models.DateField(null = False, blank = False, default = timezone.now)
    supplier = models.ForeignKey(SuppliersModel, null = False, blank = False, on_delete = models.RESTRICT) 
    user = models.ForeignKey(User, null = False, blank = False, on_delete = models.RESTRICT)
    isactive = models.BooleanField(default = True, null = False, blank = False)
    
    class Meta: 
        db_table = 'expenses'

class ExpenseDetailsModel(models.Model):
    id = models.AutoField(primary_key = True)
    serial_number = models.CharField(unique = True, null = False, blank = False)
    cost = models.FloatField(default = 0, null = False, blank = False)
    quantity = models.FloatField(default = 0, null = False, blank = False)
    date_limit = models.DateField(null = True, blank = False)
    product = models.ForeignKey(ProductsModel, on_delete = models.RESTRICT)
    expense = models.ForeignKey(ExpensesModel, on_delete = models.RESTRICT)
    user = models.ForeignKey(User, null = False, blank = False, on_delete = models.RESTRICT)
    
    class Meta: 
        db_table = 'expense_details'

class BanksModel(models.Model):
    id = models.AutoField(primary_key = True)
    name = models.CharField(null = False, blank = False)
    status = models.BooleanField(default = True, null = False, blank = False)
    
    class Meta: 
        db_table = 'banks'

class ExpensePaymentsModel(models.Model):
    id = models.AutoField(primary_key = True)
    amount = models.FloatField(default = 0, null = False, blank = False)
    note = models.CharField(max_length = 100, null = True, blank = False)
    date_reg = models.DateField(null = False, blank = False, default = timezone.now)
    expense = models.ForeignKey(ExpensesModel, on_delete = models.RESTRICT)
    user = models.ForeignKey(User, null = False, blank = False, on_delete = models.RESTRICT)
    payment_method = models.ForeignKey(PaymentMethodsModel, null = False, blank = False, on_delete = models.RESTRICT)
    bank = models.ForeignKey(BanksModel, null = False, blank = False, on_delete = models.RESTRICT)
    
    class Meta: 
        db_table = 'expense_payments'

class SignatureImagesModel(models.Model):
    sale = models.ForeignKey(SalesModel, related_name = 'signature_images', on_delete = models.CASCADE)
    type = models.IntegerField(null = False, blank = False)  
    signature = models.ImageField(null = True, blank = False)

    class Meta: 
        db_table = 'signature_images'
        constraints = [
            models.UniqueConstraint(fields=['sale', 'type'], name='unique_sale_type')
        ]

    def save(self, *args, **kwargs):
        if self.signature and not self.pk:
            ext = self.signature.name.split('.')[-1] 
            new_name = f'signatures/{uuid.uuid4()}.{ext}' 
            self.signature.name = new_name

        try:
            super().save(*args, **kwargs)
        except Exception as e:
            if self.signature and default_storage.exists(self.signature.name):
                default_storage.delete(self.signature.name)
            raise e

class GuaranteesModel(models.Model):
    id = models.AutoField(primary_key = True)
    note = models.CharField(null = False, blank = False)
    date_reg = models.DateField(null = False, blank = False, default = timezone.now)
    sale = models.ForeignKey(SalesModel, null = False, blank = False, on_delete = models.RESTRICT)   
    expense_detail = models.ForeignKey(ExpenseDetailsModel, null = False, blank = False, on_delete = models.RESTRICT)     
    
    class Meta: 
        db_table = 'guarantees'
