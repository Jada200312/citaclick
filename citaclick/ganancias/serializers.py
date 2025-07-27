from rest_framework import serializers
from .models import Ganancia

class GananciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ganancia
        fields = ['fecha_pago', 'monto']
