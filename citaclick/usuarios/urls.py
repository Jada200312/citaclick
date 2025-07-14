from django.urls import path
from .views import *

urlpatterns = [
    path('registrar/', UsuarioCreateView.as_view()),
    path('usuario/<int:pk>/', UsuarioRetrieveUpdateDestroy.as_view()),
    path('verificar-tipo-usuario/', VerificarTipoUsuarioView.as_view()),
    path('tipo-usuario-logueado/', obtener_usuario_logueado),
]

