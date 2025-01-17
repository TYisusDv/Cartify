from PIL import Image
from reportlab.pdfgen import canvas
from io import BytesIO
from datetime import datetime
import json, imgkit, os, uuid, pytz, logging, requests

logger = logging.getLogger(__name__)

def parse_json(request, key, default):
    try:
        return json.loads(request.POST.get(key, default))
    except json.JSONDecodeError:
        raise ValueError(f'Invalid JSON format for {key}.')

def round_if_close_to_zero(value, threshold = 0.5):
    return 0 if abs(value) <= threshold else value

def format_datetime_local(payment_date_utc):
    local_timezone = pytz.timezone('America/Mexico_City')

    if isinstance(payment_date_utc, str):
        payment_date_utc = datetime.fromisoformat(payment_date_utc.replace('Z', '+00:00'))

    if isinstance(payment_date_utc, datetime):
        payment_date_local = payment_date_utc.astimezone(local_timezone)
        payment_date_formatted = payment_date_local.strftime('%d/%m/%Y %I:%M %p')
        return payment_date_formatted
    
    return None

def format_date_local(payment_date_utc):
    local_timezone = pytz.timezone('America/Mexico_City')

    if isinstance(payment_date_utc, str):
        payment_date_utc = datetime.fromisoformat(payment_date_utc.replace('Z', '+00:00'))

    if isinstance(payment_date_utc, datetime):
        payment_date_local = payment_date_utc.astimezone(local_timezone)
        payment_date_formatted = payment_date_local.strftime('%d/%m/%Y')
        return payment_date_formatted
    
    return None
    
def convert_html_to_pdf(html_content, width_mm = 88):
    output_image_path = f'{uuid.uuid4()}.png'

    try:
        config = imgkit.config(wkhtmltoimage='/usr/bin/wkhtmltoimage')
        options = {
            'width': int(width_mm * 3.779527),
            'quiet': '',
            'quality': 100,
            'disable-smart-width': '',
        }
        
        imgkit.from_string(html_content, output_image_path, config=config, options=options)
        
        image = Image.open(output_image_path)
        pdf_buffer = BytesIO()
    
        c = canvas.Canvas(pdf_buffer)
        
        width, height = image.size
        
        c.setPageSize((width, height))
        
        c.drawImage(output_image_path, 0, 0, width, height)
        
        c.showPage()
        c.save()
        
        pdf_bytes = pdf_buffer.getvalue()
        
        pdf_buffer.close()
        
        return pdf_bytes
    except Exception as e:
        logger.info(f'An error has ocurred: {e}')
        return None    
    finally:
        if os.path.exists(output_image_path):
            os.remove(output_image_path)

def send_whatsapp_message(recipient_phone, message_text):
    url = f'https://graph.facebook.com/v17.0/477014542165928/messages'
    headers = {
        'Authorization': f'Bearer EAAIQsh0ZBjoEBOZCxLJn1Cu3WV4QjG88tPvpUJwkRIqNGZBFRqHvmTecXyHSAjvKGtgTRvCrXdWB99CJ7uovZBQutXojm03ADUIXVZATXsd5unPg3OkIx1gZApsiQRZCADZAeygkeZCBB7otL6CCbMZAPhoEKQrAzTyRJTvcot0L62VZBVOsiAxt3SmcJd0IPZCMosQIVFkSgyz0WrROPUugUZCaC5Iqi1poo',
        'Content-Type': 'application/json',
    }
    data = {
        'messaging_product': 'whatsapp',
        'to': recipient_phone,
        'type': 'text',
        'text': {
            'body': message_text
        }
    }

    try:
        response = requests.post(url, headers=headers, json=data)
        if response.status_code == 200:
            return response.json()
        else:
            return {'error': response.status_code, 'message': response.text}
    except requests.exceptions.RequestException as e:
        return {'error': 'exception', 'message': str(e)}