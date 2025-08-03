from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models.functions import ExtractYear, ExtractMonth, TruncDay, TruncMonth, TruncYear
from django.db.models import Sum
from .models import Reserva
from .serializers import ReservaSerializer
from datetime import datetime
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models.functions import ExtractYear, ExtractMonth
from .models import Reserva

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def filtros_reservas(request):
    usuario = request.user  # usuario autenticado

    # Extraer año y mes de las reservas del usuario
    reservas = Reserva.objects.filter(usuario=usuario)
    
    # Agrupar por año y mes
    anios = reservas.annotate(
        anio=ExtractYear('fechaReserva')
    ).values_list('anio', flat=True).distinct().order_by('anio')

    meses_por_anio = {}
    for anio in anios:
        meses = reservas.filter(
            fechaReserva__year=anio
        ).annotate(
            mes=ExtractMonth('fechaReserva')
        ).values_list('mes', flat=True).distinct().order_by('mes')
        
        meses_por_anio[str(anio)] = list(meses)

    return Response({
        "anios": list(anios),
        "meses_por_anio": meses_por_anio
    })


def get_peluqueria_or_error(user):
    """Devuelve la peluquería del usuario o None si no tiene."""
    return getattr(user, 'peluqueria', None)


# ------------------------------
#   VISTAS PARA GANANCIAS
# ------------------------------
class GananciasView(APIView):
    """
    Obtiene las ganancias filtradas por tipo (diario, mensual o anual).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        peluqueria = get_peluqueria_or_error(request.user)
        if not peluqueria:
            return Response({"error": "Usuario no asociado a peluquería"}, status=403)

        tipo_filtro = request.query_params.get('tipo_filtro', 'diario')
        filtro_fecha = request.query_params.get('fecha')

        reservas = Reserva.objects.filter(peluqueria=peluqueria)

        try:
            if tipo_filtro == 'diario':
                if not filtro_fecha:
                    return Response({"error": "Falta parámetro 'fecha' para filtro diario"}, status=400)
                year = int(filtro_fecha[:4])
                month = int(filtro_fecha[5:7])
                reservas = reservas.filter(fechaReserva__year=year, fechaReserva__month=month)
                ganancias = reservas.annotate(dia=TruncDay('fechaReserva')).values('dia').annotate(
                    total=Sum('servicio__precio')
                ).order_by('dia')
                resultados = [{'fecha': g['dia'].strftime('%Y-%m-%d'), 'ganancia': g['total']} for g in ganancias]

            elif tipo_filtro == 'mensual':
                if not filtro_fecha:
                    return Response({"error": "Falta parámetro fecha para filtro mensual"}, status=400)

                # Extraer solo el año aunque venga con mes
                try:
                    year = int(filtro_fecha[:4])
                except ValueError:
                    return Response({"error": "Formato de fecha inválido para filtro mensual"}, status=400)

                reservas = reservas.filter(fechaReserva__year=year)

                ganancias = reservas.annotate(mes=TruncMonth('fechaReserva')) \
                                    .values('mes') \
                                    .annotate(total=Sum('servicio__precio')) \
                                    .order_by('mes')

                resultados = [{'fecha': g['mes'].strftime('%Y-%m'), 'ganancia': g['total']} for g in ganancias]


            elif tipo_filtro == 'anual':
                ganancias = reservas.annotate(anio=TruncYear('fechaReserva')).values('anio').annotate(
                    total=Sum('servicio__precio')
                ).order_by('anio')
                resultados = [{'fecha': g['anio'].strftime('%Y'), 'ganancia': g['total']} for g in ganancias]

            else:
                return Response({"error": "Tipo de filtro no válido"}, status=400)

        except ValueError:
            return Response({"error": "Formato de fecha inválido"}, status=400)

        return Response(resultados)


# ------------------------------
#   VISTAS PARA DISPONIBILIDAD DE FECHAS
# ------------------------------
class AñosDisponiblesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        peluqueria = get_peluqueria_or_error(request.user)
        if not peluqueria:
            return Response({"error": "Usuario no asociado a peluquería"}, status=403)

        anios = (Reserva.objects.filter(peluqueria=peluqueria)
                 .annotate(anio=ExtractYear('fechaReserva'))
                 .values_list('anio', flat=True)
                 .distinct()
                 .order_by('-anio'))

        return Response({"anios": list(anios)})


class MesesDisponiblesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        peluqueria = get_peluqueria_or_error(request.user)
        if not peluqueria:
            return Response({"error": "Usuario no asociado a peluquería"}, status=403)

        anio = request.query_params.get('anio')
        if not anio:
            return Response({"error": "Falta parámetro 'anio'"}, status=400)

        meses = (Reserva.objects.filter(peluqueria=peluqueria, fechaReserva__year=int(anio))
                 .annotate(mes=ExtractMonth('fechaReserva'))
                 .values_list('mes', flat=True)
                 .distinct()
                 .order_by('mes'))

        return Response({"meses": list(meses)})


class DiasDisponiblesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        peluqueria = get_peluqueria_or_error(request.user)
        if not peluqueria:
            return Response({"error": "Usuario no asociado a peluquería"}, status=403)

        anio = request.query_params.get('anio')
        mes = request.query_params.get('mes')
        if not anio or not mes:
            return Response({"error": "Faltan parámetros 'anio' o 'mes'"}, status=400)

        dias = (Reserva.objects.filter(
                    peluqueria=peluqueria,
                    fechaReserva__year=int(anio),
                    fechaReserva__month=int(mes)
                )
                .values_list('fechaReserva', flat=True)
                .distinct()
                .order_by('fechaReserva'))

        dias_list = sorted({d.day for d in dias})
        return Response({"dias": dias_list})


# ------------------------------
#   CRUD DE RESERVAS
# ------------------------------
class ReservaListCreate(generics.ListCreateAPIView):
    serializer_class = ReservaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Reserva.objects.select_related('peluqueria', 'servicio')

        if not user.is_staff:
            queryset = queryset.filter(usuario=user)

        anio = self.request.query_params.get("anio")
        mes = self.request.query_params.get("mes")

        if anio:
            queryset = queryset.filter(fechaReserva__year=anio)
        if mes:
            queryset = queryset.filter(fechaReserva__month=mes)

        return queryset.order_by("-fechaReserva")


class ReservaRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer
    permission_classes = [IsAuthenticated]


class ReservaListByPeluqueriaFecha(generics.ListAPIView):
    serializer_class = ReservaSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['peluqueria', 'fechaReserva']

    def get_queryset(self):
        queryset = Reserva.objects.all()
        peluqueria_id = self.request.query_params.get('peluqueria')
        fecha = self.request.query_params.get('fechaReserva')

        if peluqueria_id:
            queryset = queryset.filter(peluqueria__id=peluqueria_id)
        if fecha:
            queryset = queryset.filter(fechaReserva=fecha)

        return queryset
