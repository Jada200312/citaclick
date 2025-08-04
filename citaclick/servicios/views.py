from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Servicio, Categoria
from .serializers import ServicioSerializer, CategoriaSerializer


class ServiciosPorPeluqueriaView(APIView):
    permission_classes = []

    def get(self, request, peluqueria_id):
        servicios = Servicio.objects.filter(peluqueria_id=peluqueria_id)
        serializer = ServicioSerializer(servicios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ServicioListCreate(generics.ListCreateAPIView):
    serializer_class = ServicioSerializer
    permission_classes = []

    def get_queryset(self):
        peluqueria_id = self.request.query_params.get('peluqueria_id')
        if peluqueria_id:
            return Servicio.objects.filter(peluqueria_id=peluqueria_id)
        return Servicio.objects.none()  # O Servicio.objects.all() si quieres mostrar todos cuando no se filtre


class ServicioRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer
    permission_classes = []


class CategoriaListAPIView(generics.ListAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = []
