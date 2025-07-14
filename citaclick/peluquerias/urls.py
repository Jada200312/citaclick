from django.urls import path
from .views import PeluqueriaListCreate, PeluqueriaRetrieveUpdateDestroy, CalificacionListCreate, CalificacionRetrieveUpdateDestroy

urlpatterns = [
    path('', PeluqueriaListCreate.as_view()),
    path('<int:pk>/', PeluqueriaRetrieveUpdateDestroy.as_view()),
    path('calificaciones/', CalificacionListCreate.as_view()),
    path('calificaciones/<int:pk>/', CalificacionRetrieveUpdateDestroy.as_view()),
]
