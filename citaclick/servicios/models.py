from django.db import models
from negocios.models import Negocio


class Categoria(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre


class Servicio(models.Model):
    nombre = models.CharField(max_length=100)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    imagen = models.ImageField(upload_to='servicios/', null=True, blank=True)

    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    negocio = models.ForeignKey(Negocio, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.nombre} - {self.negocio.nombre}"
