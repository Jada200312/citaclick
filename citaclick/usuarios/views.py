from rest_framework import generics, permissions
from .models import Usuario
from .serializers import UsuarioSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_usuario_logueado(request):
    serializer = UsuarioSerializer(request.user)
    return Response(serializer.data)


class UsuarioCreateView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class UsuarioRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]

class VerificarTipoUsuarioView(APIView):
    def post(self, request):
        cedula = request.data.get("cedula")
        if not cedula:
            return Response({"error": "Debe proporcionar una cédula"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            usuario = Usuario.objects.get(cedula=cedula)
        except Usuario.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        if usuario.es_peluqueria:
            return Response({"tipo": "peluqueria"}, status=status.HTTP_200_OK)
        else:
            return Response({"tipo": "cliente"}, status=status.HTTP_200_OK)
