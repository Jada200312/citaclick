from django.db import models

class Ganancia(models.Model):
    fecha = models.DateField()
    monto = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'peluquerias_historialpago'
