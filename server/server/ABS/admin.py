from django.contrib import admin

# Register your models here.
from .models import *


admin.site.register(Professeur)
admin.site.register(Etudiant)
admin.site.register(Module)
admin.site.register(Fillier)
admin.site.register(Classe)
admin.site.register(Enseignement)
admin.site.register(Seance)
admin.site.register(Abssence)
