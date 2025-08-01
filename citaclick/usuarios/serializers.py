from rest_framework import serializers
from .models import Usuario
from peluquerias.models import Peluqueria

class UsuarioSerializer(serializers.ModelSerializer):
    peluqueria_id = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = [
            'id',
            'username',
            'password',
            'email',
            'first_name',
            'last_name',
            'es_peluqueria',
            'celular',
            'cedula',
            'imagen',
            'peluqueria_id',  # 👈 Agregado
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def get_peluqueria_id(self, obj):
        try:
            return Peluqueria.objects.get(usuario=obj).id
        except Peluqueria.DoesNotExist:
            return None

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = Usuario(**validated_data)
        user.set_password(password) 
        user.save()
        return user
