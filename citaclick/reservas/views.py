from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models.functions import ExtractYear, ExtractMonth, TruncDay, TruncMonth, TruncYear
from django.db.models import Sum
from datetime import datetime

from .models import Reserva
from .serializers import ReservaSerializer
from negocios.models import Negocio


# ------------------------------
#   FILTROS DE RESERVAS POR USUARIO
# ------------------------------
from rest_framework.decorators import api_view, permission_classes

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def filtros_reservas(request):
    usuario = request.user

    reservas = Reserva.objects.filter(usuario=usuario)

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


# ------------------------------
#   OBTENER NEGOCIO DEL PROPIETARIO
# ------------------------------
def get_negocio_or_error(user):
    """Devuelve el negocio del usuario propietario o None"""
    return getattr(user, 'negocio', None)


# ------------------------------
#   VISTAS PARA GANANCIAS
# ------------------------------
class GananciasView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        negocio = get_negocio_or_error(request.user)
        if not negocio:
            return Response({"error": "Usuario no asociado a un negocio"}, status=403)

        tipo_filtro = request.query_params.get('tipo_filtro', 'diario')
        filtro_fecha = request.query_params.get('fecha')

        reservas = Reserva.objects.filter(negocio=negocio)

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

                year = int(filtro_fecha[:4])
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
#   DISPONIBILIDAD DE FECHAS
# ------------------------------
class AñosDisponiblesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        negocio = get_negocio_or_error(request.user)
        if not negocio:
            return Response({"error": "Usuario no asociado a un negocio"}, status=403)

        anios = (Reserva.objects.filter(negocio=negocio)
                 .annotate(anio=ExtractYear('fechaReserva'))
                 .values_list('anio', flat=True)
                 .distinct()
                 .order_by('-anio'))

        return Response({"anios": list(anios)})


class MesesDisponiblesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        negocio = get_negocio_or_error(request.user)
        if not negocio:
            return Response({"error": "Usuario no asociado a un negocio"}, status=403)

        anio = request.query_params.get('anio')
        if not anio:
            return Response({"error": "Falta parámetro 'anio'"}, status=400)

        meses = (Reserva.objects.filter(negocio=negocio, fechaReserva__year=int(anio))
                 .annotate(mes=ExtractMonth('fechaReserva'))
                 .values_list('mes', flat=True)
                 .distinct()
                 .order_by('mes'))

        return Response({"meses": list(meses)})


class DiasDisponiblesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        negocio = get_negocio_or_error(request.user)
        if not negocio:
            return Response({"error": "Usuario no asociado a un negocio"}, status=403)

        anio = request.query_params.get('anio')
        mes = request.query_params.get('mes')
        if not anio or not mes:
            return Response({"error": "Faltan parámetros 'anio' o 'mes'"}, status=400)

        dias = (Reserva.objects.filter(
                    negocio=negocio,
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
        queryset = Reserva.objects.select_related('negocio', 'recurso', 'servicio')

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


class ReservaListByNegocioFecha(generics.ListAPIView):
    serializer_class = ReservaSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['negocio', 'fechaReserva']

    def get_queryset(self):
        queryset = Reserva.objects.all()
        negocio_id = self.request.query_params.get('negocio')
        fecha = self.request.query_params.get('fechaReserva')

        if negocio_id:
            queryset = queryset.filter(negocio__id=negocio_id)
        if fecha:
            queryset = queryset.filter(fechaReserva=fecha)

        return queryset
