from django.urls import path
from .views import GananciasView

urlpatterns = [
    path('api/ganancias/', GananciasView.as_view(), name='ganancias-list'),
]
