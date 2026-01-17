from django.urls import path
from .views import (
    ServicioListCreate,
    ServicioRetrieveUpdateDestroy,
    CategoriaListAPIView,
    ServiciosPorNegocioView,
)

urlpatterns = [
    path('', ServicioListCreate.as_view()),
    path('<int:pk>/', ServicioRetrieveUpdateDestroy.as_view()),
    path('categorias/', CategoriaListAPIView.as_view()),
    path('por-negocio/<int:negocio_id>/', ServiciosPorNegocioView.as_view(), name='servicios-por-negocio'),
]
