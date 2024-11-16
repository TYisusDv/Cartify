from django import template
from datetime import datetime, date
from ..utils import *

register = template.Library()

@register.filter
def subtract(value, arg):
    return value - arg

@register.filter
def add(value, arg):
    return value + arg

@register.filter
def divide(value, arg):
    return value / arg

@register.filter
def format_number(value):
    try:
        return "{:,.2f}".format(float(value))
    except (ValueError, TypeError):
        return value
        
@register.filter
def years_since(value):
    try:
        if isinstance(value, datetime):
            value = value.date() 
        
        now = datetime.now().date()
        delta = now - value
        return delta.days // 365
    except Exception as e:
        return value

@register.filter
def filter_format_datetime_local(value):
    try:
        if isinstance(value, (date, datetime)):
            return value.strftime("%d/%m/%Y")
        
        if isinstance(value, str):
            value = datetime.strptime(value, "%b. %d, %Y")
            return value.strftime("%d/%m/%Y")
        
        return value
    except Exception as e:
        return value
    
@register.filter
def format_date_spanish(value):
    try:
        if isinstance(value, (date, datetime)):
            meses = {
                1: "enero", 2: "febrero", 3: "marzo", 4: "abril", 5: "mayo", 
                6: "junio", 7: "julio", 8: "agosto", 9: "septiembre", 
                10: "octubre", 11: "noviembre", 12: "diciembre"
            }
            
            dia = value.day
            mes = meses[value.month]
            anio = value.year
            
            return f"{dia} de {mes} del {anio}"
        
        return value
    except Exception:
        return value
    
@register.filter
def extract_day(value):
    try:
        if isinstance(value, (date, datetime)):
            return value.day 
        
        if isinstance(value, str):
            value = datetime.strptime(value, "%b. %d, %Y")
            return value.day
        
        return 'N/A'
    except Exception:
        return 'N/A'