from django.urls import path
from .views import ServicioListCreate, ServicioRetrieveUpdateDestroy

urlpatterns = [
    path('', ServicioListCreate.as_view()),
    path('<int:pk>/', ServicioRetrieveUpdateDestroy.as_view()),
]
