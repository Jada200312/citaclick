from django.urls import path
from .views import (
    ServicioListCreate,
    ServicioRetrieveUpdateDestroy,
    CategoriaListAPIView, 
)

urlpatterns = [
    path('', ServicioListCreate.as_view()),
    path('<int:pk>/', ServicioRetrieveUpdateDestroy.as_view()),
    path('categorias/', CategoriaListAPIView.as_view()), 
]
