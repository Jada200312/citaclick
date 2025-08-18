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

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data
        password = data.get('password')
        current_password = data.get('current_password')

        if 'password' not in data:
            # Si no se pasa la contraseña, actualizamos el resto de los campos
            for attr, value in data.items():
                if attr != 'password' and attr != 'current_password':
                    setattr(instance, attr, value)

        if current_password and password:
            if not instance.check_password(current_password):
                return Response(
                    {"current_password": "La contraseña actual es incorrecta"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            instance.set_password(password)

        instance.save()
        return Response(self.get_serializer(instance).data)

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
