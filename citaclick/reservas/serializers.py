from rest_framework import serializers
from .models import Reserva
from negocios.models import Negocio, Recurso
from servicios.models import Servicio


class NegocioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Negocio
        fields = ['id', 'nombre']


class RecursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recurso
        fields = ['id', 'nombre']


class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = ['id', 'nombre']


class ReservaSerializer(serializers.ModelSerializer):
    # Lectura
    negocio = NegocioSerializer(read_only=True)
    recurso = RecursoSerializer(read_only=True)
    servicio = ServicioSerializer(read_only=True)

    # Escritura
    negocio_id = serializers.PrimaryKeyRelatedField(
        queryset=Negocio.objects.all(),
        source='negocio',
        write_only=True
    )

    recurso_id = serializers.PrimaryKeyRelatedField(
        queryset=Recurso.objects.all(),
        source='recurso',
        write_only=True
    )

    servicio_id = serializers.PrimaryKeyRelatedField(
        queryset=Servicio.objects.all(),
        source='servicio',
        write_only=True,
        required=False,
        allow_null=True   # 👈 la clave
    )

    class Meta:
        model = Reserva
        fields = '__all__'
