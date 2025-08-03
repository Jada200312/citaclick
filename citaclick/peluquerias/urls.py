from django.urls import path
from . import views
from .views import *

urlpatterns = [
    path('', PeluqueriaListCreate.as_view()),
    path('<int:pk>/calificar/', views.calificar_peluqueria, name='calificar-peluqueria'),
    path('<int:pk>/', PeluqueriaRetrieveUpdateDestroy.as_view()),
    path('calificaciones/', CalificacionListCreate.as_view()),
    path('calificaciones/<int:pk>/', CalificacionRetrieveUpdateDestroy.as_view()),
    path('horarios/', HorarioListCreate.as_view(), name='horario-list-create'),
    path('horarios/<int:pk>/', HorarioRetrieveUpdateDestroy.as_view(), name='horario-detail'),
    path('dias-no-disponibles/', DiaNoDisponibleListCreate.as_view(), name='dia-no-disponible-list-create'),
    path('dias-no-disponibles/<int:pk>/', DiaNoDisponibleRetrieveUpdateDestroy.as_view(), name='dia-no-disponible-detail'),
    path('horarios-disponibles/', HorariosDisponiblesView.as_view(), name='horarios-disponibles'),
    path('ganancias/', GananciasListView.as_view(), name='ganancias'),
    path('planes/', views.lista_planes, name='lista_planes'),
    path('calificaciones/promedio/<int:peluqueria_id>/', PromedioCalificacionesView.as_view(), name='promedio-calificaciones'),
]
