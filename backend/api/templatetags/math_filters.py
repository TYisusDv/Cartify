from django import template
from datetime import datetime

register = template.Library()

@register.filter
def subtract(value, arg):
    return value - arg

@register.filter
def add(value, arg):
    return value + arg

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
        return str(e)