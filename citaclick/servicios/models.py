from django.contrib.auth.models import AbstractUser
from django.db import models
from peluquerias.models import Peluqueria

class Categoria(models.Model):
    nombre = models.CharField(max_length=100)

class Servicio(models.Model):
    nombre = models.CharField(max_length=100)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    imagen = models.ImageField(upload_to='servicios/', null=True, blank=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    peluqueria = models.ForeignKey(Peluqueria, on_delete=models.CASCADE)
