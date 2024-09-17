import json

def parse_json(request, key, default):
    try:
        return json.loads(request.POST.get(key, default))
    except json.JSONDecodeError:
        raise ValueError(f'Invalid JSON format for {key}.')