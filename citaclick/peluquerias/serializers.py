from rest_framework import serializers
from .models import Peluqueria, Plan, Horario, Calificacion, HistorialPago, DiaNoDisponible
from usuarios.models import Usuario

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = '__all__'

class HorarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Horario
        fields = '__all__'

class PeluqueriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Peluqueria
        fields = '__all__'
        extra_kwargs = {
            'usuario': {'read_only': True},  # <- Esto evita que sea requerido
        }

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['usuario'] = instance.usuario.id
        return rep


class CalificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calificacion
        fields = '__all__'

class HistorialPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistorialPago
        fields = '__all__'

class DiaNoDisponibleSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiaNoDisponible
        fields = '__all__'