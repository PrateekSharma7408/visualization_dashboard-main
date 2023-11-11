# custom_filters.py
from django import template
register = template.Library()

@register.filter(name='unique_topics')
def unique_topics(data_list, column):
    return unique_values(data_list, column)

def unique_values(data_list, column):
    unique_set = set()
    unique_data_list = []

    for data in data_list:
        try:
            value = data[column]
            if value not in unique_set and value != '':
                unique_set.add(value)
                unique_data_list.append({'value': value.title(), 'key': value})
        except Exception as e:
            print(e)

    sorted_data_list = sorted(unique_data_list, key=lambda x: x['key'])

    return sorted_data_list
