from django.urls import path
from .views import UsuarioCreateView, UsuarioRetrieveUpdateDestroy, VerificarTipoUsuarioView

urlpatterns = [
    path('registrar/', UsuarioCreateView.as_view()),
    path('usuario/<int:pk>/', UsuarioRetrieveUpdateDestroy.as_view()),
    path('verificar-tipo-usuario/', VerificarTipoUsuarioView.as_view()),
]
