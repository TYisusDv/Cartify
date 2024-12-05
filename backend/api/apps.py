from django.apps import AppConfig
from django.core.management import call_command
from django.db.utils import OperationalError

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        from api.models import BreakStatusModel, SaleStatusModel, SaleReceiptModel, InventoryTypesModel
        
        try:
            break_status_data = [
                {"id": 1, "name": "Pendiente"},
                {"id": 2, "name": "Aprovado"},
                {"id": 3, "name": "Denegado"},
            ]
            for data in break_status_data:
                BreakStatusModel.objects.get_or_create(**data)

            print("Break status model initial data inserted or already exists.")
            
            sale_status_model_data = [
                {"id": 1, "name": "Completada", "calculate": True},
                {"id": 2, "name": "Activa", "calculate": True},
                {"id": 3, "name": "Cancelada", "calculate": False},
                {"id": 4, "name": "Cancelada x otra razon", "calculate": True},
            ]
            for data in sale_status_model_data:
                SaleStatusModel.objects.get_or_create(**data)

            print("Sale status initial data inserted or already exists.")

            sale_receipt_data = [
                {"id": 1, "prompt": "Address", "description": "Av 1"},
                {"id": 2, "prompt": "Tel", "description": "1234"},
                {"id": 3, "prompt": "NIT", "description": "1234"},
                {"id": 4, "prompt": "Title", "description": "Cartify"},
                {"id": 5, "prompt": "Type", "description": "GRUPO CARTIFY"},
            ]
            for data in sale_receipt_data:
                SaleReceiptModel.objects.get_or_create(**data)

            print("SaleReceipt initial data inserted or already exists.")

            inventory_type_data = [
                {"id": 1, "name": "Entrada", "type": 1},
                {"id": 2, "name": "Salida", "type": 2},
                {"id": 3, "name": "Salida x venta", "type": 2},
                {"id": 4, "name": "Traslado", "type": 3},
            ]
            for data in inventory_type_data:
                InventoryTypesModel.objects.get_or_create(**data)

            print("InventoryType initial data inserted or already exists.")
        except Exception as e:
            print(f"Error inserting initial data: {e}")