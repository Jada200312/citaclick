from django.urls import path
from .views import ReservaListCreate, ReservaRetrieveUpdateDestroy
from .views import ReservaListByPeluqueriaFecha

urlpatterns = [
    path('', ReservaListCreate.as_view()),
    path('<int:pk>/', ReservaRetrieveUpdateDestroy.as_view()),
    path('reservas/', ReservaListByPeluqueriaFecha.as_view(), name='reservas-list'),
]
