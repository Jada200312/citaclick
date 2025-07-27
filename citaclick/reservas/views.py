from rest_framework import generics, permissions
from rest_framework.permissions import AllowAny
from .models import *
from .serializers import *
from django_filters.rest_framework import DjangoFilterBackend


class ReservaListCreate(generics.ListCreateAPIView):
    serializer_class = ReservaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Reserva.objects.filter(usuario=self.request.user)

class ReservaRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer
    permission_classes = [permissions.IsAuthenticated]

class ReservaListByPeluqueriaFecha(generics.ListAPIView):
    serializer_class = ReservaSerializer
    permission_classes = [AllowAny]  # Cambia si quieres autenticación
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['peluqueria', 'fechaReserva']

    def get_queryset(self):
        queryset = Reserva.objects.all()
        peluqueria_id = self.request.query_params.get('peluqueria')
        fecha = self.request.query_params.get('fechaReserva')

        if peluqueria_id:
            queryset = queryset.filter(peluqueria__id=peluqueria_id)
        if fecha:
            queryset = queryset.filter(fechaReserva=fecha)

        return queryset
