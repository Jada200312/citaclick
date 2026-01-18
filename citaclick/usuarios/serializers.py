from rest_framework import serializers
from .models import Usuario, Rol
from negocios.models import Negocio


class UsuarioSerializer(serializers.ModelSerializer):
    # Nombre del rol como string
    rol = serializers.CharField(source='rol.nombre', read_only=True)
    # ID del rol para leer y escribir
    rol_id = serializers.PrimaryKeyRelatedField(
    queryset=Rol.objects.all(),
    source='rol',
    write_only=True
)
    negocio_id = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = [
        'id',
        'username',
        'password',
        'email',
        'first_name',
        'last_name',
        'rol',
        'rol_id',
        'celular',
        'cedula',
        'imagen',
        'negocio_id'
    ]
        extra_kwargs = {'password': {'write_only': True}}

    def get_negocio_id(self, obj):
        try:
            return obj.negocio.id
        except Negocio.DoesNotExist:
            return None

    # Método para devolver rol_id
    def get_rol_id(self, obj):
        return obj.rol.id if obj.rol else None

    # Crear usuario con contraseña hasheada
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = Usuario(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

    # Actualizar usuario y contraseña si se provee
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
