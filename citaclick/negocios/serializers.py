from rest_framework import serializers
from .models import *
from reservas.models import ReservaHotel
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
        fields = ['id', 'horaInicio', 'horaFin', 'intervalo_tiempo']


class NegocioSerializer(serializers.ModelSerializer):
    promedio_calificaciones = serializers.SerializerMethodField()
    total_calificaciones = serializers.SerializerMethodField()

    class Meta:
        model = Negocio
        fields = '__all__'
        read_only_fields = ['propietario', 'fecha_registro', 'plan', 'estado']

    def create(self, validated_data):
        negocio = self.context["negocio"]
        recurso_id = validated_data["recurso"]
        fecha = validated_data["fecha"]
        bloques = validated_data["bloques"]

        for hora in bloques:
            BloqueHorarioNoDisponible.objects.get_or_create(
                negocio=negocio,
                recurso_id=recurso_id,
                fecha=fecha,
                hora=hora
            )

        # devolvemos algo simbólico
        return {"status": "ok"}

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

class BloqueHorarioNoDisponibleSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloqueHorarioNoDisponible
        fields = '__all__'


class BloqueHorarioNoDisponibleCreateSerializer(serializers.Serializer):
    fecha = serializers.DateField()
    recurso = serializers.IntegerField()
    bloques = serializers.ListField(
        child=serializers.TimeField()
    )

    def create(self, validated_data):
        negocio = self.context["negocio"]
        recurso_id = validated_data["recurso"]
        fecha = validated_data["fecha"]
        bloques = validated_data["bloques"]

        objetos = []
        for hora in bloques:
            obj, created = BloqueHorarioNoDisponible.objects.get_or_create(
                negocio=negocio,
                recurso_id=recurso_id,
                fecha=fecha,
                hora=hora
            )
            objetos.append(obj)

        return objetos



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


class RecursoSerializer(serializers.ModelSerializer):
    horario = HorarioRecursoSerializer(read_only=True)
    
    horario_id = serializers.PrimaryKeyRelatedField(
        source='horario',
        queryset=HorarioRecurso.objects.all(),
        write_only=True,
        required=False,
    )

    tipo_negocio_id = serializers.IntegerField(source='negocio.tipo.id', read_only=True)
    tipo_negocio_nombre = serializers.CharField(source='negocio.tipo.nombre', read_only=True)

    class Meta:
        model = Recurso
        fields = ['id', 'nombre', 'activo', 'horario', 'horario_id', 'negocio', 'tipo_negocio_id', 'tipo_negocio_nombre']


class ReservaHotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReservaHotel
        fields = '__all__'
        read_only_fields = ['usuario', 'fecha_creacion']
