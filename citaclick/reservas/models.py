from django.db import models
from usuarios.models import Usuario
from negocios.models import Negocio, Recurso
from servicios.models import Servicio


class Reserva(models.Model):
    fechaReserva = models.DateField()
    horaReserva = models.TimeField()

    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    negocio = models.ForeignKey(Negocio, on_delete=models.CASCADE)
    recurso = models.ForeignKey(Recurso, on_delete=models.CASCADE)

    servicio = models.ForeignKey(
        Servicio,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.negocio.nombre} - {self.fechaReserva} {self.horaReserva}"
