from django.db import models


# Create your models here.
class Professeur( models.Model):
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    mote_pass = models.CharField(max_length=100, default='default_value')
    role = models.CharField(max_length=100)
    email = models.EmailField()
    numero_telephone = models.CharField(max_length=15)
    def __str__(self):
        return self.nom



class Fillier(models.Model):
    nom = models.CharField(max_length=100)
    nom_comlaite = models.CharField(max_length=100)
    chef =  models.ForeignKey(Professeur, on_delete=models.CASCADE,related_name='chef')
    def __str__(self):
        return self.nom


class Classe(models.Model):
    nom = models.CharField(max_length=100)
    fillier = models.ForeignKey(Fillier, on_delete=models.CASCADE,related_name='fillier')
    def __str__(self):
        return self.nom

class Etudiant(models.Model):
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    classe = models.ForeignKey(Classe, on_delete=models.CASCADE, related_name='etudiants')
    mote_pass = models.CharField(max_length=100, default='default_value')
    email = models.EmailField()
    numero_telephone = models.CharField(max_length=15)
    image = models.ImageField(upload_to='images',blank=True)
    def __str__(self):
        return self.nom



class Module(models.Model):
    nom = models.CharField(max_length=100)
    description = models.TextField()
    
    def __str__(self):
        return self.nom


class Enseignement(models.Model):
    professeur = models.ForeignKey(Professeur, on_delete=models.CASCADE,related_name='Professeur')
    classe = models.ForeignKey(Classe, on_delete=models.CASCADE,related_name='Classe')
    module = models.ForeignKey(Module, on_delete=models.CASCADE,related_name='Module')

class Seance(models.Model):
    date = models.DateField()
    enseignement = models.ForeignKey(Enseignement, on_delete=models.CASCADE,related_name='Professeur')
    
    

class Abssence(models.Model):
    etudiant = models.ForeignKey(Etudiant, on_delete=models.CASCADE,related_name='etudiant')
    seance = models.ForeignKey(Seance, on_delete=models.CASCADE,related_name='Seance')
    valeur = models.CharField(max_length=1, choices=(("P", "Présent"), ("A", "Absent")))