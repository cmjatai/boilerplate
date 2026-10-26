from .apps import CoreConfig
from . import views
from django.urls import path

app_name = CoreConfig.name

urlpatterns = [
    path('', views.index, name='index'),
]