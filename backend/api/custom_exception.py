from rest_framework.views import exception_handler
from rest_framework.response import Response
from django.db.models.deletion import RestrictedError
from django.db import IntegrityError
from django.http import Http404
import traceback, logging

logger = logging.getLogger(__name__)

def custom_exception(exc, context):
    response = exception_handler(exc, context)

    try:
        if isinstance(exc, RestrictedError):
            return Response({'success': False, 'resp': 'Cannot delete this item because it is referenced by other records.'}, status = 400)

        elif isinstance(exc, IntegrityError):
            return Response({'success': False, 'resp': 'A field was not found! Please check your field.'}, status = 400)
        
        elif isinstance(exc, Http404):
            return Response({'success': False, 'resp': 'Page not found.'}, status = 404)     
        
        elif response is not None:
            tb = traceback.extract_tb(exc.__traceback__)
            line_number = tb[-1].lineno if tb else 'Unknown'
            detail = response.data.get('detail', 'An unknown error occurred') 
            
            return Response({'success': False, 'resp': f'{detail} [E{line_number}]'}, status = response.status_code)

    except Exception as e:
        logger.error(f"Error in custom_exception: {e}")
    
    return response