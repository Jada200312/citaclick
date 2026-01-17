from django.urls import path
from . import views
from .views import *

urlpatterns = [
    path('', NegocioListCreate.as_view()),
    path('<int:pk>/calificar/', views.calificar_negocio, name='calificar-negocio'),
    path('<int:pk>/', NegocioRetrieveUpdateDestroy.as_view()),

    path('calificaciones/', CalificacionListCreate.as_view()),
    path('calificaciones/<int:pk>/', CalificacionRetrieveUpdateDestroy.as_view()),

    path('horarios-negocio/', HorarioNegocioListCreate.as_view(), name='horario-negocio-list-create'),
    path('horarios-negocio/<int:pk>/', HorarioNegocioRetrieveUpdateDestroy.as_view(), name='horario-negocio-detail'),

    path('horarios-recurso/', HorarioRecursoListCreate.as_view(), name='horario-recurso-list-create'),
    path('horarios-recurso/<int:pk>/', HorarioRecursoRetrieveUpdateDestroy.as_view(), name='horario-recurso-detail'),

    path('dias-no-disponibles/', DiaNoDisponibleListCreate.as_view(), name='dia-no-disponible-list-create'),
    path('dias-no-disponibles/<int:pk>/', DiaNoDisponibleRetrieveUpdateDestroy.as_view(), name='dia-no-disponible-detail'),

    path('horarios-disponibles/', HorariosDisponiblesView.as_view(), name='horarios-disponibles'),

    path('ganancias/', GananciasListView.as_view(), name='ganancias'),
    path('planes/', views.lista_planes, name='lista_planes'),

    path('calificaciones/promedio/<int:negocio_id>/', PromedioCalificacionesView.as_view(), name='promedio-calificaciones'),

    path('buscar-disponibles/', BuscarNegociosDisponibles.as_view(), name='buscar-negocios-disponibles'),

    path('tipos-negocio/', TipoNegocioListView.as_view(), name='tipos-negocio'),

    path('recursos/crear-masivo/', CrearRecursosMasivos.as_view(), name='crear-recursos-masivo'),
]
