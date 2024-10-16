import json

def parse_json(request, key, default):
    try:
        return json.loads(request.POST.get(key, default))
    except json.JSONDecodeError:
        raise ValueError(f'Invalid JSON format for {key}.')

def round_if_close_to_zero(value, threshold = 0.5):
    return 0 if abs(value) <= threshold else value