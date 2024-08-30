from rest_framework.views import exception_handler

def custom_exception(exc, context):
    response = exception_handler(exc, context)    
    if response is not None:
        response.data = {'success': False, 'resp': response.data}
    
    return response