from rest_framework import generics, permissions
from .models import *
from .serializers import *

class PeluqueriaListCreate(generics.ListCreateAPIView):
    queryset = Peluqueria.objects.all()
    serializer_class = PeluqueriaSerializer
    #permission_classes = [permissions.IsAuthenticated]
    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class PeluqueriaRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Peluqueria.objects.all()
    serializer_class = PeluqueriaSerializer
    permission_classes = [permissions.IsAuthenticated]

class CalificacionListCreate(generics.ListCreateAPIView):
    queryset = Calificacion.objects.all()
    serializer_class = CalificacionSerializer

class CalificacionRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Calificacion.objects.all()
    serializer_class = CalificacionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
class HorarioListCreate(generics.ListCreateAPIView):
    queryset = Horario.objects.all()
    serializer_class = HorarioSerializer
    # permission_classes = [permissions.IsAuthenticated]

class HorarioRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Horario.objects.all()
    serializer_class = HorarioSerializer
    permission_classes = [permissions.IsAuthenticated]
