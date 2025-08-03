from rest_framework import serializers
from .models import Peluqueria, Plan, Horario, Calificacion, HistorialPago, DiaNoDisponible
from usuarios.models import Usuario
from django.db.models import Avg, Count

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = '__all__'

class HorarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Horario
        fields = '__all__'

class PeluqueriaSerializer(serializers.ModelSerializer):
    promedio_calificaciones = serializers.SerializerMethodField()
    total_calificaciones = serializers.SerializerMethodField()

    class Meta:
        model = Peluqueria
        fields = '__all__'


    def get_promedio_calificaciones(self, obj):
        promedio = obj.calificacion_set.aggregate(prom=Avg('calificacion'))['prom']
        return promedio or 0

    def get_total_calificaciones(self, obj):
        return obj.calificacion_set.aggregate(total=Count('id'))['total'] or 0


class CalificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calificacion
        fields = '__all__'
        extra_kwargs = {
            'usuario': {'read_only': True}  # No se envía desde el cliente
        }

class HistorialPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistorialPago
        fields = '__all__'

class DiaNoDisponibleSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiaNoDisponible
        fields = '__all__'