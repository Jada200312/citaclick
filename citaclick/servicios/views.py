from rest_framework import generics, permissions
from .models import *
from .serializers import *

class ServicioListCreate(generics.ListCreateAPIView):
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer
   # permission_classes = [permissions.IsAuthenticated]
    permission_classes = []

class ServicioRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer
    #permission_classes = [permissions.IsAuthenticated]
    permission_classes = []

class CategoriaListAPIView(generics.ListAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = []