from rest_framework import serializers
from .models import *
from django.db.models import Avg, Count


class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = '__all__'


class HorarioNegocioSerializer(serializers.ModelSerializer):
    class Meta:
        model = HorarioNegocio
        fields = '__all__'


class HorarioRecursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HorarioRecurso
        fields = '__all__'


class NegocioSerializer(serializers.ModelSerializer):
    promedio_calificaciones = serializers.SerializerMethodField()
    total_calificaciones = serializers.SerializerMethodField()

    class Meta:
        model = Negocio
        fields = '__all__'
        read_only_fields = ['propietario', 'fecha_registro', 'plan', 'estado']

    def create(self, validated_data):
        request = self.context['request']
        validated_data['propietario'] = request.user
        return super().create(validated_data)

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
            'usuario': {'read_only': True}
        }


class HistorialPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistorialPago
        fields = '__all__'


class DiaNoDisponibleSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiaNoDisponible
        fields = '__all__'

class TipoNegocioSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoNegocio
        fields = '__all__'


class RecursoMasivoSerializer(serializers.Serializer):
    negocio = serializers.PrimaryKeyRelatedField(queryset=Negocio.objects.all())
    cantidad = serializers.IntegerField(min_value=1, max_value=500)
    horario = serializers.PrimaryKeyRelatedField(
        queryset=HorarioRecurso.objects.all(),
        required=False,
        allow_null=True
    )

    def create(self, validated_data):
        negocio = validated_data["negocio"]
        cantidad = validated_data["cantidad"]
        horario = validated_data.get("horario")

        # Nombre base según tipo de negocio
        nombre_base = negocio.tipo.recurso_nombre  # ej: "Mesa", "Cancha", "Silla"

        recursos_creados = []
        for i in range(1, cantidad + 1):
            recurso = Recurso.objects.create(
                negocio=negocio,
                nombre=f"{nombre_base} {i}",
                horario=horario
            )
            recursos_creados.append(recurso)

        return recursos_creados
