from django.urls import path
from .views import *

urlpatterns = [
    path('', PeluqueriaListCreate.as_view()),
    path('<int:pk>/', PeluqueriaRetrieveUpdateDestroy.as_view()),
    path('calificaciones/', CalificacionListCreate.as_view()),
    path('calificaciones/<int:pk>/', CalificacionRetrieveUpdateDestroy.as_view()),
    path('horarios/', HorarioListCreate.as_view(), name='horario-list-create'),
    path('horarios/<int:pk>/', HorarioRetrieveUpdateDestroy.as_view(), name='horario-detail'),
]
