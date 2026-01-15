from django.db import models
from django.contrib.auth.models import AbstractUser

class Rol(models.Model):
    nombre = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.nombre


class Usuario(AbstractUser):
    cedula = models.CharField(max_length=15, unique=True)
    celular = models.CharField(max_length=15, null=True, blank=True)
    imagen = models.ImageField(upload_to='usuarios/', null=True, blank=True)
    rol = models.ForeignKey(Rol, on_delete=models.PROTECT, null=True)

    def __str__(self):
        return self.username
