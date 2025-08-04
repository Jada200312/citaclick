from django.urls import path
from .views import (
    ServicioListCreate,
    ServicioRetrieveUpdateDestroy,
    CategoriaListAPIView, 
    ServiciosPorPeluqueriaView,
)

urlpatterns = [
    path('', ServicioListCreate.as_view()),
    path('<int:pk>/', ServicioRetrieveUpdateDestroy.as_view()),
    path('categorias/', CategoriaListAPIView.as_view()),
    path('por-peluqueria/<int:peluqueria_id>/', ServiciosPorPeluqueriaView.as_view(), name='servicios-por-peluqueria'),
]
