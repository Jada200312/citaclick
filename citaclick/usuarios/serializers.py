from rest_framework import serializers
from .models import Usuario, Rol
from peluquerias.models import Peluqueria

class UsuarioSerializer(serializers.ModelSerializer):
    # Nombre del rol como string
    rol = serializers.CharField(source='rol.nombre', read_only=True)
    # ID del rol para leer y escribir
    rol_id = serializers.PrimaryKeyRelatedField(
    queryset=Rol.objects.all(),
    source='rol',
    write_only=True
)

    
    # ID de la peluquería relacionada (si existe)
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
            'rol',        # nombre del rol
            'rol_id',     # id del rol
            'celular',
            'cedula',
            'imagen',
            'peluqueria_id'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    # Método para devolver peluqueria_id
    def get_peluqueria_id(self, obj):
        try:
            return Peluqueria.objects.get(usuario=obj).id
        except Peluqueria.DoesNotExist:
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
