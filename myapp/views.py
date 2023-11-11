from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import DataModel
from .utils import insert_data_from_json
from django.shortcuts import render
from django.utils.html import escapejs

from datetime import datetime
from django.core.serializers.json import DjangoJSONEncoder
import json

@api_view(['GET', 'POST'])
def data_api(request):
    if request.method == 'GET':
        queryset = DataModel.objects.all()
        
        data_list = list(queryset.values())
        return Response({'message': 'Data retrieved successfully', 'data':data_list})

    elif request.method == 'POST':
        json_file_path = './jsondata.json'
        insert_data_from_json(json_file_path)
        return Response({'message': 'Data inserted successfully'})

@api_view(['GET', 'POST'])
def home(request):
    if request.method == 'GET':
        data_from_views = DataModel.objects.all()
        data_list = list(data_from_views.values())

        # Serialize data using the default JSON encoder and escape for use in script tag
        # serialized_data = json.dumps(data_list, cls=DateTimeEncoder)
        # escaped_data = escapejs(serialized_data)

        return render(request, 'home.html', {'data_list': data_list})
        
class DateTimeEncoder(DjangoJSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)