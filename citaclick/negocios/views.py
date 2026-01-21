from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

from datetime import datetime, timedelta, date
from django.utils.dateparse import parse_date
from django.http import JsonResponse
from django.db.models import Avg, Q

from .models import *
from .serializers import *

from reservas.models import Reserva


# ==========================
# BUSCAR NEGOCIOS DISPONIBLES
# ==========================
class BuscarNegociosDisponibles(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        fecha_str = request.GET.get("fecha")
        hora_str = request.GET.get("hora")
        tipo_id = request.GET.get("tipo")

        if not fecha_str or not hora_str:
            return Response({"error": "Fecha y hora requeridas"}, status=400)

        fecha = parse_date(fecha_str)
        hora = datetime.strptime(hora_str, "%H:%M").time()

        queryset = Negocio.objects.filter(estado=True)
        if tipo_id:
            queryset = queryset.filter(tipo_id=tipo_id)

        # ==============================
        # Buscar siguiente bloque real
        # ==============================
        def buscar_siguiente():
            mejores_negocios = []
            mejor_hora = None

            for negocio in queryset:
                if DiaNoDisponible.objects.filter(
                    negocio=negocio, fecha=fecha
                ).exists():
                    continue

                recursos = negocio.recursos.filter(activo=True)

                for recurso in recursos:
                    if not recurso.horario:
                        continue

                    horario = recurso.horario
                    inicio = datetime.combine(fecha, horario.horaInicio)
                    fin = datetime.combine(fecha, horario.horaFin)
                    intervalo = timedelta(minutes=horario.intervalo_tiempo)

                    actual = inicio
                    while actual + intervalo <= fin:

                        # buscamos solo bloques >= hora solicitada
                        if actual.time() >= hora:

                            ocupado = Reserva.objects.filter(
                                recurso=recurso,
                                fechaReserva=fecha,
                                horaReserva=actual.time(),
                            ).exists()

                            if not ocupado:
                                # guardamos la hora más cercana global
                                if mejor_hora is None or actual.time() < mejor_hora:
                                    mejor_hora = actual.time()
                                    mejores_negocios = [negocio]
                                elif actual.time() == mejor_hora:
                                    mejores_negocios.append(negocio)

                                break  # ya encontramos para este recurso

                        actual += intervalo

            return mejores_negocios, mejor_hora

        negocios, hora_encontrada = buscar_siguiente()

        if negocios:
            return Response(
                {
                    "fallback": hora_encontrada.strftime("%H:%M") != hora_str,
                    "hora": hora_encontrada.strftime("%H:%M"),
                    "resultados": NegocioSerializer(
                        negocios, many=True, context={"request": request}
                    ).data,
                }
            )

        # Si no existe ningún bloque disponible
        return Response({"fallback": False, "hora": hora_str, "resultados": []})


# ==========================
# CALIFICAR NEGOCIO
# ==========================
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def calificar_negocio(request, pk):

    try:
        negocio = Negocio.objects.get(pk=pk)
    except Negocio.DoesNotExist:
        return Response(
            {"error": "Negocio no encontrado"}, status=status.HTTP_404_NOT_FOUND
        )

    calificacion_valor = request.data.get("calificacion")
    comentario = request.data.get("comentario", "")

    if not calificacion_valor:
        return Response(
            {"error": "Debe enviar una calificación"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    hoy = date.today()
    ya_califico = Calificacion.objects.filter(
        negocio=negocio,
        usuario=request.user,
        fecha__year=hoy.year,
        fecha__month=hoy.month,
    ).exists()

    if ya_califico:
        return Response(
            {"error": "Ya calificaste este negocio este mes"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    calificacion = Calificacion.objects.create(
        negocio=negocio,
        usuario=request.user,
        calificacion=calificacion_valor,
        comentario=comentario,
        fecha=hoy,
    )

    serializer = CalificacionSerializer(calificacion)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


# ==========================
# PROMEDIO CALIFICACIONES
# ==========================
class PromedioCalificacionesView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, negocio_id):
        promedio = Calificacion.objects.filter(negocio_id=negocio_id).aggregate(
            promedio=Avg("calificacion")
        )["promedio"]

        return Response(
            {
                "negocio_id": negocio_id,
                "promedio": round(promedio, 2) if promedio else None,
            }
        )


# ==========================
# HORARIOS DISPONIBLES
# ==========================
class HorariosDisponiblesView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        fecha_str = request.GET.get("fecha")
        negocio_id = request.GET.get("negocio_id")

        if not fecha_str or not negocio_id:
            return Response(
                {"error": "Parámetros 'fecha' y 'negocio_id' son requeridos."},
                status=400,
            )

        fecha = parse_date(fecha_str)

        try:
            negocio = Negocio.objects.get(id=negocio_id)
        except Negocio.DoesNotExist:
            return Response({"error": "Negocio no encontrado."}, status=404)

        if DiaNoDisponible.objects.filter(negocio=negocio, fecha=fecha).exists():
            return Response(
                {"mensaje": "El negocio no trabaja en esa fecha."}, status=200
            )

        horario = negocio.horario_general
        if not horario:
            return Response(
                {"error": "No hay horario configurado para este negocio."}, status=400
            )

        hora_inicio = datetime.combine(fecha, horario.horaInicio)
        hora_fin = datetime.combine(fecha, horario.horaFin)
        intervalo = timedelta(minutes=horario.intervalo_tiempo)

        reservas = Reserva.objects.filter(negocio=negocio, fechaReserva=fecha)
        horas_reservadas = set(r.horaReserva.strftime("%H:%M") for r in reservas)

        bloques = []
        actual = hora_inicio
        while actual + intervalo <= hora_fin:
            hora_str = actual.time().strftime("%H:%M")
            bloques.append(
                {"hora": hora_str, "disponible": hora_str not in horas_reservadas}
            )
            actual += intervalo

        return Response(
            {
                "fecha": fecha_str,
                "negocio": negocio.nombre,
                "horarios_disponibles": bloques,
            }
        )


class HorariosDisponiblesRecursoView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        fecha_str = request.GET.get("fecha")
        recurso_id = request.GET.get("recurso_id")

        if not fecha_str or not recurso_id:
            return Response(
                {"error": "Parámetros 'fecha' y 'recurso_id' son requeridos."},
                status=400,
            )

        fecha = parse_date(fecha_str)

        try:
            recurso = Recurso.objects.get(id=recurso_id)
        except Recurso.DoesNotExist:
            return Response({"error": "Recurso no encontrado."}, status=404)

        if not recurso.activo:
            return Response({"error": "Este recurso está inactivo."}, status=400)

        if not recurso.horario:
            return Response(
                {"error": "Este recurso no tiene horario asignado."}, status=400
            )

        hora_inicio = datetime.combine(fecha, recurso.horario.horaInicio)
        hora_fin = datetime.combine(fecha, recurso.horario.horaFin)
        intervalo = timedelta(minutes=recurso.horario.intervalo_tiempo)

        # Filtrar reservas existentes de este recurso en la fecha
        reservas = Reserva.objects.filter(recurso=recurso, fechaReserva=fecha)
        horas_reservadas = set(r.horaReserva.strftime("%H:%M") for r in reservas)

        bloques = []
        actual = hora_inicio
        while actual + intervalo <= hora_fin:
            hora_str = actual.time().strftime("%H:%M")
            bloques.append(
                {"hora": hora_str, "disponible": hora_str not in horas_reservadas}
            )
            actual += intervalo

        return Response(
            {
                "fecha": fecha_str,
                "recurso": recurso.nombre,
                "horarios_disponibles": bloques,
            }
        )


# ==========================
# CRUD NEGOCIOS
# ==========================
class NegocioListCreate(generics.ListCreateAPIView):
    queryset = Negocio.objects.all()
    serializer_class = NegocioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(propietario=self.request.user)


class NegocioRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Negocio.objects.all()
    serializer_class = NegocioSerializer
    permission_classes = [permissions.IsAuthenticated]


# ==========================
# CRUD CALIFICACIONES
# ==========================
class CalificacionListCreate(generics.ListCreateAPIView):
    queryset = Calificacion.objects.all()
    serializer_class = CalificacionSerializer


class CalificacionRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Calificacion.objects.all()
    serializer_class = CalificacionSerializer
    permission_classes = [permissions.IsAuthenticated]


# ==========================
# HORARIOS NEGOCIO
# ==========================
class HorarioNegocioListCreate(generics.ListCreateAPIView):
    queryset = HorarioNegocio.objects.all()
    serializer_class = HorarioNegocioSerializer


class HorarioNegocioRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = HorarioNegocio.objects.all()
    serializer_class = HorarioNegocioSerializer
    permission_classes = [permissions.IsAuthenticated]


# ==========================
# DÍAS NO DISPONIBLES
# ==========================
class DiaNoDisponibleListCreate(generics.ListCreateAPIView):
    queryset = DiaNoDisponible.objects.all()
    serializer_class = DiaNoDisponibleSerializer
    permission_classes = [permissions.IsAuthenticated]


class DiaNoDisponibleRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = DiaNoDisponible.objects.all()
    serializer_class = DiaNoDisponibleSerializer
    permission_classes = [permissions.IsAuthenticated]


# ==========================
# GANANCIAS
# ==========================
class GananciasListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        pagos = HistorialPago.objects.all().order_by("fecha_pago")
        data = [{"fecha": p.fecha_pago, "monto": p.monto} for p in pagos]
        return Response(data)


# ==========================
# PLANES
# ==========================
def lista_planes(request):
    planes = Plan.objects.all()
    data = [
        {
            "id": p.id,
            "nombre": p.nombre,
            "descripcion": p.descripcion,
            "precio": str(p.precio),
            "limite_reservas": p.limite_reservas,
            "comision": str(p.comision),
        }
        for p in planes
    ]

    return JsonResponse(data, safe=False)


# ==========================
# HORARIOS RECURSO
# ==========================
class HorarioRecursoListCreate(generics.ListCreateAPIView):
    queryset = HorarioRecurso.objects.all()
    serializer_class = HorarioRecursoSerializer


class HorarioRecursoRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = HorarioRecurso.objects.all()
    serializer_class = HorarioRecursoSerializer
    permission_classes = [permissions.IsAuthenticated]


class RecursoRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Recurso.objects.all()
    serializer_class = RecursoSerializer
    permission_classes = [IsAuthenticated]


class TipoNegocioListView(generics.ListAPIView):
    queryset = TipoNegocio.objects.all()
    serializer_class = TipoNegocioSerializer
    permission_classes = [permissions.AllowAny]


class CrearRecursosMasivos(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = RecursoMasivoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        recursos = serializer.save()

        return Response(
            {"mensaje": f"{len(recursos)} recursos creados correctamente"},
            status=status.HTTP_201_CREATED,
        )


class RecursosNegocioView(generics.ListAPIView):
    serializer_class = RecursoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        usuario = self.request.user

        # Solo propietarios (rol_id = 2)
        if usuario.rol_id != 2:
            return Recurso.objects.none()

        # Filtramos recursos cuyo negocio tiene como propietario al usuario logueado
        return Recurso.objects.filter(negocio__propietario=usuario)


class RecursosClienteView(generics.ListAPIView):
    serializer_class = RecursoSerializer
    permission_classes = [permissions.AllowAny]  # cualquier usuario puede ver

    def get_queryset(self):
        negocio_id = self.request.query_params.get("negocio_id")
        if negocio_id:
            return Recurso.objects.filter(negocio_id=negocio_id)
        return Recurso.objects.none()  # si no se pasa id, devolvemos vacío
