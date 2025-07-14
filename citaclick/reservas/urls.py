from django.urls import path
from .views import ReservaListCreate, ReservaRetrieveUpdateDestroy

urlpatterns = [
    path('', ReservaListCreate.as_view()),
    path('<int:pk>/', ReservaRetrieveUpdateDestroy.as_view()),
]
