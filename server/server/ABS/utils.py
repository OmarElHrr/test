

class module_classe:
    def __init__(self, classe,classe_id,  module, module_id):
        self.classe = classe
        self.classe_id = classe_id  
        self.module = module
        self.module_id = module_id

    def to_dict(self):
        return {'nom_classe': self.classe, 'classe_id': self.classe_id, 'nom_module': self.module, 'module_id' : self.module_id}


class Absence_value:
    def __init__(self, etudiant_id, etudiant_nom, etudiant_prenom, nombre_S , nombre_P, nombre_A):
        self.etudiant_id = etudiant_id
        self.etudiant_nom = etudiant_nom
        self.etudiant_prenom = etudiant_prenom
        self.nombre_scince = nombre_S
        self.nombre_presence = nombre_P
        self.nombre_absence = nombre_A

    def to_dict(self):
        return{
            'etudiant_id':self.etudiant_id,
            'etudiant_nom':self.etudiant_nom,
            'etudiant_prenom':self.etudiant_prenom,
            'nombre_scince':self.nombre_scince,
            'nombre_presence':self.nombre_presence,
            'nombre_absence':self.nombre_absence
        }



class Absence_etudiant:
    def __init__(self,  module_nom, prof_nom, prof_prenom, nombre_S , nombre_P, nombre_A):
        self.module_nom = module_nom
        self.prof_nom = prof_nom
        self.prof_prenom = prof_prenom
        self.nombre_scince = nombre_S
        self.nombre_presence = nombre_P
        self.nombre_absence = nombre_A

    def to_dict(self):
        return{
            'module_nom':self.module_nom,
            'prof_nom':self.prof_nom,
            'prof_prenom':self.prof_prenom,
            'nombre_scince':self.nombre_scince,
            'nombre_presence':self.nombre_presence,
            'nombre_absence':self.nombre_absence
        }



class state_classe:
    def __init__(self, classe,classe_id,  nombre_etudiant,etudiant_max_absence_id, etudiant_max_absence_nom , max_absence ,etudiant_min_absence_id, etudiant_min_absence_inom ,min_absence  ):
        self.classe = classe
        self.classe_id = classe_id  
        self.nombre_etudiant = nombre_etudiant
        self.etudiant_max_absence_id = etudiant_max_absence_id
        self.etudiant_max_absence_nom = etudiant_max_absence_nom
        self.max_absence = max_absence
        self.etudiant_min_absence_id =etudiant_min_absence_id
        self.etudiant_min_absence_nom = etudiant_min_absence_inom
        self.min_absence =min_absence

    def to_dict(self):
        return {'nom_classe': self.classe, 'classe_id': self.classe_id, 'nombre_etudiant': self.nombre_etudiant, 'etudiant_max_absence_id' : self.etudiant_max_absence_id,
        'etudiant_max_absence_nom' : self.etudiant_max_absence_nom,'max_absence' : self.max_absence, 'etudiant_min_absence_id' : self.etudiant_min_absence_id,
        'etudiant_min_absence_nom' : self.etudiant_min_absence_nom,'min_absence' : self.min_absence}


class etudiant_filier:
    def __init__(self, etudiant_id, etudiant_nom, etudiant_prenom, etudiant_mail):
        self.etudiant_id = etudiant_id
        self.etudiant_nom = etudiant_nom  
        self.etudiant_prenom = etudiant_prenom
        self.etudiant_mail = etudiant_mail
       
    def to_dict(self):
        return {'etudiant_id': self.etudiant_id, 'etudiant_nom': self.etudiant_nom,
         'etudiant_prenom': self.etudiant_prenom, 'etudiant_mail' : self.etudiant_mail}

class etudiant_stat:
    def __init__(self, module_nom, prof_nom, prof_prenom, presence, absence, sciences):
        self.module_nom = module_nom
        self.prof_nom = prof_nom
        self.prof_prenom = prof_prenom
        self.presence = presence
        self.absence = absence
        self.sciences = sciences

    def to_dict(self):
        return {'module_nom': self.module_nom, 'prof_nom': self.prof_nom,
         'prof_prenom': self.prof_prenom, 'presence' : self.presence,
         'absence' : self.absence,'sciences' : self.sciences }
