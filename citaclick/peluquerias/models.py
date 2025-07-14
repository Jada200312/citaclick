from django.contrib.auth.models import AbstractUser
from django.db import models
from usuarios.models import Usuario

class Plan(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    limite_reservas = models.IntegerField()
    comision = models.DecimalField(max_digits=5, decimal_places=2)

class Horario(models.Model):
    horaInicio = models.TimeField()
    horaFin = models.TimeField()
    intervalo_tiempo = models.IntegerField()

class Peluqueria(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)
    direccion = models.CharField(max_length=255)
    ciudad = models.CharField(max_length=100)
    horario = models.ForeignKey(Horario, on_delete=models.SET_NULL, null=True)
    fecha_registro = models.DateField(auto_now_add=True)
    plan = models.ForeignKey(Plan, on_delete=models.SET_NULL, null=True, default=1)
    fecha_vencimiento = models.DateField(null=True, blank=True)
    estado = models.BooleanField(default=True)
    imagen = models.ImageField(upload_to='peluquerias/', null=True, blank=True)

class Calificacion(models.Model):
    peluqueria = models.ForeignKey(Peluqueria, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    calificacion = models.IntegerField()
    comentario = models.TextField()
    fecha = models.DateField(auto_now_add=True)

class HistorialPago(models.Model):
    peluqueria = models.ForeignKey(Peluqueria, on_delete=models.CASCADE)
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE)
    fecha_pago = models.DateField()
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    metodo_pago = models.CharField(max_length=100)
