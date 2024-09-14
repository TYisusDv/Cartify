from rest_framework.views import exception_handler
import traceback

def custom_exception(exc, context):
    response = exception_handler(exc, context)    
    try:
        if response is not None:
            tb = traceback.extract_tb(exc.__traceback__)
            line_number = tb[-1].lineno if tb else 'Unknown'
            
            response.data = {
                'success': False,
                'resp': response.data['detail'] if response.data.get('detail', None) else response.data + f' [E{line_number}]'
            }
    except:
        pass
    
    return response