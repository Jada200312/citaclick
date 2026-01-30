from django.db import models
from django.core.exceptions import ValidationError
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


class ReservaHotel(models.Model):
    negocio = models.ForeignKey(Negocio, on_delete=models.CASCADE)
    recurso = models.ForeignKey(Recurso, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()

    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['fecha_inicio']

    def clean(self):
        if self.fecha_fin <= self.fecha_inicio:
            raise ValidationError({
                'fecha_fin': 'La fecha de fin debe ser posterior a la fecha de inicio.'
            })

    def save(self, *args, **kwargs):
        self.full_clean() 
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.recurso.nombre} ({self.fecha_inicio} → {self.fecha_fin})"
