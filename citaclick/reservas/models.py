from django.contrib.auth.models import AbstractUser
from django.db import models
from usuarios.models import Usuario
from peluquerias.models import Peluqueria
from servicios.models import Servicio

class Reserva(models.Model):
    fechaReserva = models.DateField()
    horaReserva = models.TimeField()
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    peluqueria = models.ForeignKey(Peluqueria, on_delete=models.CASCADE)
    servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE)
