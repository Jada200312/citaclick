from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Ganancia
from .serializers import GananciaSerializer

class GananciasView(APIView):
    def get(self, request):
        ganancias = Ganancia.objects.all().order_by('fecha')
        serializer = GananciaSerializer(ganancias, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
