# yourapp/utils.py

import json
from .models import DataModel

def insert_data_from_json(json_file_path):
    with open(json_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)

    for item in data:
        DataModel.objects.create(
            end_year=item['end_year'],
            intensity=item['intensity'],
            sector=item['sector'],
            topic=item['topic'],
            insight=item['insight'],
            url=item['url'],
            region=item['region'],
            start_year=item['start_year'],
            impact=item['impact'],
            added=item['added'],
            published=item['published'],
            country=item['country'],
            relevance=item['relevance'],
            pestle=item['pestle'],
            source=item['source'],
            title=item['title'],
            likelihood=item['likelihood'],
        )
