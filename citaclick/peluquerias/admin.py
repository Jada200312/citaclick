from django.contrib import admin
from .models import Plan, Horario, Peluqueria, Calificacion, HistorialPago, DiaNoDisponible

admin.site.register(Plan)
admin.site.register(Horario)
admin.site.register(Peluqueria)
admin.site.register(Calificacion)
admin.site.register(HistorialPago)
admin.site.register(DiaNoDisponible)
