from rest_framework import serializers
from .models import Peluqueria, Plan, Horario, Calificacion, HistorialPago
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
    cedula_usuario = serializers.CharField(write_only=True)

    class Meta:
        model = Peluqueria
        fields = '__all__'
        extra_fields = ['cedula_usuario']  # este campo extra no está en el modelo, pero se incluye

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['usuario'] = instance.usuario.id  # para mantener compatibilidad
        return rep

    def create(self, validated_data):
        cedula = validated_data.pop('cedula_usuario')
        try:
            usuario = Usuario.objects.get(cedula=cedula)
        except Usuario.DoesNotExist:
            raise serializers.ValidationError({'cedula_usuario': 'Usuario con esta cédula no existe.'})
        return Peluqueria.objects.create(usuario=usuario, **validated_data)


class CalificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calificacion
        fields = '__all__'

class HistorialPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistorialPago
        fields = '__all__'
