from rest_framework import serializers
from .models import Reserva, Peluqueria, Servicio

class PeluqueriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Peluqueria
        fields = ['id', 'nombre']

class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = ['id', 'nombre']

class ReservaSerializer(serializers.ModelSerializer):
    # Campos para lectura
    peluqueria = PeluqueriaSerializer(read_only=True)
    servicio = ServicioSerializer(read_only=True)

    # Campos para escritura (IDs)
    peluqueria_id = serializers.PrimaryKeyRelatedField(
        queryset=Peluqueria.objects.all(), source='peluqueria', write_only=True
    )
    servicio_id = serializers.PrimaryKeyRelatedField(
        queryset=Servicio.objects.all(), source='servicio', write_only=True
    )

    class Meta:
        model = Reserva
        fields = '__all__'
