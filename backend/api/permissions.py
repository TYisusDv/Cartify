from rest_framework.permissions import BasePermission

class ManageUsersPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.method == 'GET':
            return request.user.has_perm('auth.view_user')
        elif request.method == 'POST':
            return request.user.has_perm('auth.add_user')
        elif request.method == 'PUT':
            return request.user.has_perm('auth.change_user')    
        elif request.method == 'DELETE':
            return request.user.has_perm('auth.delete_user')
        
        return False

class ManageLocationsPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.method == 'GET':
            return request.user.has_perm('api.view_locationsmodel')
        elif request.method == 'POST':
            return request.user.has_perm('api.add_locationsmodel')
        elif request.method == 'PUT':
            return request.user.has_perm('api.change_locationsmodel')    
        elif request.method == 'DELETE':
            return request.user.has_perm('api.delete_locationsmodel')
        
        return False

class ManageTypesIdsPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.method == 'GET':
            return request.user.has_perm('api.view_typesidsmodel')
        elif request.method == 'POST':
            return request.user.has_perm('api.add_typesidsmodel')
        elif request.method == 'PUT':
            return request.user.has_perm('api.change_typesidsmodel')    
        elif request.method == 'DELETE':
            return request.user.has_perm('api.delete_typesidsmodel')
        
        return False

class ManageClientTypesPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.method == 'GET':
            return request.user.has_perm('api.view_clienttypesmodel')
        elif request.method == 'POST':
            return request.user.has_perm('api.add_clienttypesmodel')
        elif request.method == 'PUT':
            return request.user.has_perm('api.change_clienttypesmodel')    
        elif request.method == 'DELETE':
            return request.user.has_perm('api.delete_clienttypesmodel')
        
        return False

class ManageClientsPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.method == 'GET':
            return request.user.has_perm('api.view_clientsmodel')
        elif request.method == 'POST':
            return request.user.has_perm('api.add_clientsmodel')
        elif request.method == 'PUT':
            return request.user.has_perm('api.change_clientsmodel')    
        elif request.method == 'DELETE':
            return request.user.has_perm('api.delete_clientsmodel')
        
        return False

class ManageSuppliersPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.method == 'GET':
            return request.user.has_perm('api.view_suppliersmodel')
        elif request.method == 'POST':
            return request.user.has_perm('api.add_suppliersmodel')
        elif request.method == 'PUT':
            return request.user.has_perm('api.change_suppliersmodel')    
        elif request.method == 'DELETE':
            return request.user.has_perm('api.delete_suppliersmodel')
        
        return False

class ManageTaxesPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.method == 'GET':
            return request.user.has_perm('api.view_taxesmodel')
        elif request.method == 'POST':
            return request.user.has_perm('api.add_taxesmodel')
        elif request.method == 'PUT':
            return request.user.has_perm('api.change_taxesmodel')    
        elif request.method == 'DELETE':
            return request.user.has_perm('api.delete_taxesmodel')
        
        return False
    
class ManageProductBrandsPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.method == 'GET':
            return request.user.has_perm('api.view_productbrandsmodel')
        elif request.method == 'POST':
            return request.user.has_perm('api.add_productbrandsmodel')
        elif request.method == 'PUT':
            return request.user.has_perm('api.change_productbrandsmodel')    
        elif request.method == 'DELETE':
            return request.user.has_perm('api.delete_productbrandsmodel')
        
        return False

class ManageProductCategoriesPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.method == 'GET':
            return request.user.has_perm('api.view_productcategoriesmodel')
        elif request.method == 'POST':
            return request.user.has_perm('api.add_productcategoriesmodel')
        elif request.method == 'PUT':
            return request.user.has_perm('api.change_productcategoriesmodel')    
        elif request.method == 'DELETE':
            return request.user.has_perm('api.delete_productcategoriesmodel')
        
        return False

class ManageProductsPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.method == 'GET':
            return request.user.has_perm('api.view_productsmodel')
        elif request.method == 'POST':
            return request.user.has_perm('api.add_productsmodel')
        elif request.method == 'PUT':
            return request.user.has_perm('api.change_productsmodel')    
        elif request.method == 'DELETE':
            return request.user.has_perm('api.delete_productsmodel')
        
        return False
    
class ManageInventoryTypesPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.method == 'GET':
            return request.user.has_perm('api.view_inventorytypesmodel')
        elif request.method == 'POST':
            return request.user.has_perm('api.add_inventorytypesmodel')
        elif request.method == 'PUT':
            return request.user.has_perm('api.change_inventorytypesmodel')    
        elif request.method == 'DELETE':
            return request.user.has_perm('api.delete_inventorytypesmodel')
        
        return False

class AppInventoryPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.method == 'GET':
            return request.user.has_perm('api.view_inventorymodel')
        elif request.method == 'POST':
            return request.user.has_perm('api.add_inventorymodel')
        elif request.method == 'PUT':
            return request.user.has_perm('api.change_inventorymodel')    
        elif request.method == 'DELETE':
            return request.user.has_perm('api.delete_inventorymodel')
        
        return False

class ManagePaymentMethodsPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.method == 'GET':
            return request.user.has_perm('api.view_paymentmethodsmodel')
        elif request.method == 'POST':
            return request.user.has_perm('api.add_paymentmethodsmodel')
        elif request.method == 'PUT':
            return request.user.has_perm('api.change_paymentmethodsmodel')    
        elif request.method == 'DELETE':
            return request.user.has_perm('api.delete_paymentmethodsmodel')
        
        return False

class ManageSalePaymentsPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.method == 'GET':
            return request.user.has_perm('api.view_salepaymentsmodel')
        elif request.method == 'POST':
            return request.user.has_perm('api.add_salepaymentsmodel')
        elif request.method == 'PUT':
            return request.user.has_perm('api.change_salepaymentsmodel')    
        elif request.method == 'DELETE':
            return request.user.has_perm('api.delete_salepaymentsmodel')
        
        return False

class ManageSalesPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.method == 'GET':
            return request.user.has_perm('api.view_salesmodel')
        elif request.method == 'POST':
            return request.user.has_perm('api.add_salesmodel')
        elif request.method == 'PUT':
            return request.user.has_perm('api.change_salesmodel')    
        elif request.method == 'DELETE':
            return request.user.has_perm('api.delete_salesmodel')
        
        return False

class ManageSaleReceiptPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.method == 'GET':
            return request.user.has_perm('api.view_salereceiptmodel')
        elif request.method == 'POST':
            return request.user.has_perm('api.add_salereceiptmodel')
        elif request.method == 'PUT':
            return request.user.has_perm('api.change_salereceiptmodel')    
        elif request.method == 'DELETE':
            return request.user.has_perm('api.delete_salereceiptmodel')
        
        return False

class ManageSaleStatusPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.method == 'GET':
            return request.user.has_perm('api.view_salestatusmodel')
        elif request.method == 'POST':
            return request.user.has_perm('api.add_salestatusmodel')
        elif request.method == 'PUT':
            return request.user.has_perm('api.change_salestatusmodel')    
        elif request.method == 'DELETE':
            return request.user.has_perm('api.delete_salestatusmodel')
        
        return False
    
class ManageCashRegisterPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.method == 'GET':
            return request.user.has_perm('api.view_cashregistermodel')
        elif request.method == 'POST':
            return request.user.has_perm('api.add_cashregistermodel')
        elif request.method == 'PUT':
            return request.user.has_perm('api.change_cashregistermodel')    
        elif request.method == 'DELETE':
            return request.user.has_perm('api.delete_cashregistermodel')
        
        return False

class ManageExpensesPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.method == 'GET':
            return request.user.has_perm('api.view_expensesmodel')
        elif request.method == 'POST':
            return request.user.has_perm('api.add_expensesmodel')
        elif request.method == 'PUT':
            return request.user.has_perm('api.change_expensesmodel')    
        elif request.method == 'DELETE':
            return request.user.has_perm('api.delete_expensesmodel')
        
        return False

class ManageExpenseDetailsPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.method == 'GET':
            return request.user.has_perm('api.view_expensedetailsmodel')
        elif request.method == 'POST':
            return request.user.has_perm('api.add_expensedetailsmodel')
        elif request.method == 'PUT':
            return request.user.has_perm('api.change_expensedetailsmodel')    
        elif request.method == 'DELETE':
            return request.user.has_perm('api.delete_expensedetailsmodel')
        
        return False

class ManageExpensePaymentsPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.method == 'GET':
            return request.user.has_perm('api.view_expensepaymentsmodel')
        elif request.method == 'POST':
            return request.user.has_perm('api.add_expensepaymentsmodel')
        elif request.method == 'PUT':
            return request.user.has_perm('api.change_expensepaymentsmodel')    
        elif request.method == 'DELETE':
            return request.user.has_perm('api.delete_expensepaymentsmodel')
        
        return False

class ManageBanksPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.method == 'GET':
            return request.user.has_perm('api.view_banksmodel')
        elif request.method == 'POST':
            return request.user.has_perm('api.add_banksmodel')
        elif request.method == 'PUT':
            return request.user.has_perm('api.change_banksmodel')    
        elif request.method == 'DELETE':
            return request.user.has_perm('api.delete_banksmodel')
        
        return False

class ManageSignaturesPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.method == 'GET':
            return request.user.has_perm('api.view_signatureimagesmodel')
        elif request.method == 'POST':
            return request.user.has_perm('api.add_signatureimagesmodel')
        elif request.method == 'PUT':
            return request.user.has_perm('api.change_signatureimagesmodel')    
        elif request.method == 'DELETE':
            return request.user.has_perm('api.delete_signatureimagesmodel')
        
        return False

class ManageGuaranteesPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.method == 'GET':
            return request.user.has_perm('api.view_guaranteesmodel')
        elif request.method == 'POST':
            return request.user.has_perm('api.add_guaranteesmodel')
        elif request.method == 'PUT':
            return request.user.has_perm('api.change_guaranteesmodel')    
        elif request.method == 'DELETE':
            return request.user.has_perm('api.delete_guaranteesmodel')
        
        return False

class ManageAbsencesPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.method == 'GET':
            return request.user.has_perm('api.view_absencesmodel')
        elif request.method == 'POST':
            return request.user.has_perm('api.add_absencesmodel')
        elif request.method == 'PUT':
            return request.user.has_perm('api.change_absencesmodel')    
        elif request.method == 'DELETE':
            return request.user.has_perm('api.delete_absencesmodel')
        
        return False

class ManageBreaksPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.method == 'GET':
            return request.user.has_perm('api.view_breaksmodel')
        elif request.method == 'POST':
            return request.user.has_perm('api.add_breaksmodel')
        elif request.method == 'PUT':
            return request.user.has_perm('api.change_breaksmodel')    
        elif request.method == 'DELETE':
            return request.user.has_perm('api.delete_breaksmodel')
        
        return False