"""from rest_framework import serializers
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
        return user"""

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


    def update(self, instance, validated_data):
        password = validated_data.get('password', None)
        current_password = validated_data.get('current_password', None)

        # Validación de la contraseña actual
        if current_password:
            if not instance.check_password(current_password):
                raise serializers.ValidationError({"current_password": "La contraseña actual es incorrecta"})

        # Actualización de la contraseña si se pasa una nueva
        if password:
            instance.set_password(password)

        # Actualizamos el resto de los campos
        for attr, value in validated_data.items():
            if attr not in ['password', 'current_password']:
                setattr(instance, attr, value)

        instance.save()
        return instance
