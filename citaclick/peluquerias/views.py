from rest_framework import generics, permissions
from .models import *
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from datetime import datetime, timedelta
from .models import Peluqueria, DiaNoDisponible
from reservas.models import Reserva
from django.utils.dateparse import parse_date
from rest_framework.permissions import AllowAny
from django.http import JsonResponse
from django.db.models import Avg
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Peluqueria, Calificacion
from datetime import date

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def calificar_peluqueria(request, pk):
    print("📦 Datos recibidos:", request.data)

    try:
        peluqueria = Peluqueria.objects.get(pk=pk)
    except Peluqueria.DoesNotExist:
        return Response({"error": "Peluquería no encontrada"}, status=status.HTTP_404_NOT_FOUND)

    calificacion_valor = request.data.get("calificacion")
    comentario = request.data.get("comentario", "")

    if not calificacion_valor:
        return Response({"error": "Debe enviar una calificación"}, status=status.HTTP_400_BAD_REQUEST)

    # 📌 Verificar si ya calificó este mes
    hoy = date.today()
    ya_califico = Calificacion.objects.filter(
        peluqueria=peluqueria,
        usuario=request.user,
        fecha__year=hoy.year,
        fecha__month=hoy.month
    ).exists()

    if ya_califico:
        return Response(
            {"error": "Ya calificaste esta peluquería este mes"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # 📌 Crear calificación
    calificacion = Calificacion.objects.create(
        peluqueria=peluqueria,
        usuario=request.user,
        calificacion=calificacion_valor,
        comentario=comentario,
        fecha=hoy  # asegurar que se guarda la fecha actual
    )

    serializer = CalificacionSerializer(calificacion)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


class PromedioCalificacionesView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, peluqueria_id):
        promedio = Calificacion.objects.filter(peluqueria_id=peluqueria_id).aggregate(promedio=Avg('puntuacion'))['promedio']
        return Response({
            "peluqueria_id": peluqueria_id,
            "promedio": round(promedio, 2) if promedio else None
        })



class HorariosDisponiblesView(APIView):
    permission_classes = [permissions.AllowAny]  # Cambia según lo necesites

    def get(self, request, *args, **kwargs):
        fecha_str = request.GET.get("fecha")
        peluqueria_id = request.GET.get("peluqueria_id")

        if not fecha_str or not peluqueria_id:
            return Response({"error": "Parámetros 'fecha' y 'peluqueria_id' son requeridos."}, status=400)

        fecha = parse_date(fecha_str)
        try:
            peluqueria = Peluqueria.objects.get(id=peluqueria_id)
        except Peluqueria.DoesNotExist:
            return Response({"error": "Peluquería no encontrada."}, status=404)

        # Verificar si es un día no disponible
        if DiaNoDisponible.objects.filter(peluqueria=peluqueria, fecha=fecha).exists():
            return Response({"mensaje": "La peluquería no trabaja en esa fecha."}, status=200)

        horario = peluqueria.horario
        if not horario:
            return Response({"error": "No hay horario configurado para esta peluquería."}, status=400)

        hora_inicio = datetime.combine(fecha, horario.horaInicio)
        hora_fin = datetime.combine(fecha, horario.horaFin)
        intervalo = timedelta(minutes=horario.intervalo_tiempo)

        # Obtener las horas ya reservadas
        reservas = Reserva.objects.filter(peluqueria=peluqueria, fechaReserva=fecha)
        horas_reservadas = set(reserva.horaReserva.strftime('%H:%M') for reserva in reservas)

        # Generar bloques disponibles excluyendo los reservados
        bloques = []
        actual = hora_inicio
        while actual + intervalo <= hora_fin:
            hora_str = actual.time().strftime('%H:%M')
            disponible = hora_str not in horas_reservadas
            bloques.append({"hora": hora_str, "disponible": disponible})
            actual += intervalo

        return Response({
            "fecha": fecha_str,
            "peluqueria": peluqueria.nombre,
            "horarios_disponibles": bloques
        })

class PeluqueriaListCreate(generics.ListCreateAPIView):
    queryset = Peluqueria.objects.all()
    serializer_class = PeluqueriaSerializer
    permission_classes = [permissions.IsAuthenticated]
    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class PeluqueriaRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Peluqueria.objects.all()
    serializer_class = PeluqueriaSerializer
    permission_classes = [permissions.IsAuthenticated]

class CalificacionListCreate(generics.ListCreateAPIView):
    queryset = Calificacion.objects.all()
    serializer_class = CalificacionSerializer

    def perform_create(self, serializer):
        serializer.save()

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        peluqueria_id = request.data.get("peluqueria")

        if peluqueria_id:
            try:
                peluqueria = Peluqueria.objects.get(id=peluqueria_id)
                peluqueria_serializer = PeluqueriaSerializer(peluqueria)
                return Response(peluqueria_serializer.data, status=status.HTTP_201_CREATED)
            except Peluqueria.DoesNotExist:
                pass

        return response


class CalificacionRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Calificacion.objects.all()
    serializer_class = CalificacionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
class HorarioListCreate(generics.ListCreateAPIView):
    queryset = Horario.objects.all()
    serializer_class = HorarioSerializer
    #permission_classes = [permissions.IsAuthenticated]

class HorarioRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Horario.objects.all()
    serializer_class = HorarioSerializer
    permission_classes = [permissions.IsAuthenticated]

class DiaNoDisponibleListCreate(generics.ListCreateAPIView):
    queryset = DiaNoDisponible.objects.all()
    serializer_class = DiaNoDisponibleSerializer
    permission_classes = [permissions.IsAuthenticated]

class DiaNoDisponibleRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = DiaNoDisponible.objects.all()
    serializer_class = DiaNoDisponibleSerializer
    permission_classes = [permissions.IsAuthenticated]

class GananciasListView(APIView):
    permission_classes = [AllowAny]  # o [AllowAny] si no hay login

    def get(self, request):
        pagos = HistorialPago.objects.all().order_by('fecha_pago')
        data = [
            {
                "fecha": pago.fecha_pago,
                "monto": pago.monto
            }
            for pago in pagos
        ]
        return Response(data)
    
def lista_planes(request):
    planes = Plan.objects.all()
    data = [
        {
            'id': plan.id,
            'nombre': plan.nombre,
            'descripcion': plan.descripcion,
            'precio': str(plan.precio),
            'limite_reservas': plan.limite_reservas,
            'comision': str(plan.comision),
        }
        for plan in planes
    ]
    return JsonResponse(data, safe=False)