from django.contrib.auth.models import AbstractUser
from django.db import models

class Usuario(AbstractUser):
    cedula = models.CharField(max_length=15, unique=True)
    celular = models.CharField(max_length=15, null=True, blank=True)
    imagen = models.ImageField(upload_to='usuarios/', null=True, blank=True)
    es_peluqueria = models.BooleanField(default=False)

    def __str__(self):
        return self.username
