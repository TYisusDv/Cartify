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
            detail = response.data.get('detail', 'Cannot delete this item because it is referenced by other records.') if response else 'Cannot delete this item because it is referenced by other records.'
            return Response({'success': False, 'resp': detail}, status = 400)

        elif isinstance(exc, IntegrityError):
            detail = response.data.get('detail', 'A field was not found! Please check your field.') if response else 'A field was not found! Please check your field.'
            return Response({'success': False, 'resp': detail}, status = 400)
        
        elif isinstance(exc, Http404):
            detail = response.data.get('detail', 'Page not found.') if response else 'Page not found.'
            return Response({'success': False, 'resp': detail }, status = 404)     
        
        elif response is not None:
            tb = traceback.extract_tb(exc.__traceback__)
            line_number = tb[-1].lineno if tb else 'Unknown'
            detail = response.data.get('detail', 'An unknown error occurred') 
            
            logger.error(f'Error line: {line_number}')
            return Response({'success': False, 'resp': detail}, status = response.status_code)

    except Exception as e:
        logger.error(f'Error in custom_exception: {e}')
    
    return response