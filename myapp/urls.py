from django.urls import path, include

from django.urls import path
from .views import data_api, home

urlpatterns = [
    path('', home, name='home'),
    path('data/', data_api, name='data_api'),
]
