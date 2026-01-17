from django.db import models
from usuarios.models import Usuario


class Plan(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    limite_reservas = models.IntegerField()
    comision = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return self.nombre


# Horario general del negocio
class HorarioNegocio(models.Model):
    horaInicio = models.TimeField()
    horaFin = models.TimeField()
    intervalo_tiempo = models.IntegerField()

    def __str__(self):
        return f"{self.horaInicio} - {self.horaFin}"


# Horario individual de cada recurso
class HorarioRecurso(models.Model):
    horaInicio = models.TimeField()
    horaFin = models.TimeField()
    intervalo_tiempo = models.IntegerField()

    def __str__(self):
        return f"{self.horaInicio} - {self.horaFin}"


class TipoNegocio(models.Model):
    nombre = models.CharField(max_length=100)
    recurso_nombre = models.CharField(max_length=100)
    # Ej: ("Restaurante","Mesa"), ("Peluquería","Silla")

    def __str__(self):
        return self.nombre


class Negocio(models.Model):
    propietario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    tipo = models.ForeignKey(TipoNegocio, on_delete=models.PROTECT)

    nombre = models.CharField(max_length=150)
    direccion = models.CharField(max_length=255)
    ciudad = models.CharField(max_length=100)

    horario_general = models.ForeignKey(HorarioNegocio, on_delete=models.SET_NULL, null=True)

    fecha_registro = models.DateField(auto_now_add=True)
    plan = models.ForeignKey(Plan, on_delete=models.SET_NULL, null=True, default=1)
    fecha_vencimiento = models.DateField(null=True, blank=True)

    estado = models.BooleanField(default=True)
    imagen = models.ImageField(upload_to='negocios/', null=True, blank=True)

    def __str__(self):
        return self.nombre


class Recurso(models.Model):
    negocio = models.ForeignKey(Negocio, on_delete=models.CASCADE, related_name='recursos')
    nombre = models.CharField(max_length=100)
    horario = models.ForeignKey(HorarioRecurso, on_delete=models.SET_NULL, null=True, blank=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.negocio.nombre} - {self.nombre}"


class Calificacion(models.Model):
    negocio = models.ForeignKey(Negocio, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='cali_usu')
    calificacion = models.IntegerField()
    comentario = models.TextField()
    fecha = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.negocio.nombre} - {self.calificacion}"


class HistorialPago(models.Model):
    negocio = models.ForeignKey(Negocio, on_delete=models.CASCADE)
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE)
    fecha_pago = models.DateField()
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    metodo_pago = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.negocio.nombre} - {self.monto}"


class DiaNoDisponible(models.Model):
    negocio = models.ForeignKey(Negocio, on_delete=models.CASCADE, related_name='dias_no_disponibles')
    fecha = models.DateField()
    motivo = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        unique_together = ('negocio', 'fecha')
        ordering = ['fecha']

    def __str__(self):
        return f"{self.negocio.nombre} - {self.fecha}"
