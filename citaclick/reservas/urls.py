from django.urls import path
from .views import (
    ReservaListCreate,
    ReservaRetrieveUpdateDestroy,
    ReservaListByPeluqueriaFecha,
    GananciasView,
    AñosDisponiblesView,
    MesesDisponiblesView,
    DiasDisponiblesView
)
from . import views

urlpatterns = [
    # CRUD de reservas
    path('', ReservaListCreate.as_view(), name='reservas-list-create'),
    path('<int:pk>/', ReservaRetrieveUpdateDestroy.as_view(), name='reserva-detail'),
    path('por-fecha/', ReservaListByPeluqueriaFecha.as_view(), name='reservas-por-fecha'),

    # Ganancias
    path('ganancias/', GananciasView.as_view(), name='ganancias'),

    # Fechas disponibles
    path('fechas/anios/', AñosDisponiblesView.as_view(), name='anios-disponibles'),
    path('fechas/meses/', MesesDisponiblesView.as_view(), name='meses-disponibles'),
    path('fechas/dias/', DiasDisponiblesView.as_view(), name='dias-disponibles'),
    path('filtros/', views.filtros_reservas, name='filtros_reservas'),
]
