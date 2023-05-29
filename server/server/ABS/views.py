from django.shortcuts import render
import json
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core import serializers
from .models import *
from django.http import JsonResponse
from .utils import *
from django.utils import timezone
from django.core.mail import send_mail
import face_recognition
import cv2
import time



@api_view(['POST'])
def login_view(request):
    if request.method == 'POST':
        username = request.data.get('username')  # use request.data instead of request.POST
        password = request.data.get('password')
        
        domaine = username.split("@")[1]
        authenticated = False
        professor = None
        prof = False
        student = None
        if domaine.lower() == "usms.ma":    
            professors = Professeur.objects.all()
            for p in professors:
                if  p.email.lower() == username.lower() and p.mote_pass == password:
                    authenticated = True
                    professor = p
                    prof = True
                    break
        else :
            students = Etudiant.objects.all()
            for s in students: 
                if  s.email.lower() == username.lower() and s.mote_pass == password:
                    authenticated = True
                    student = s
                    prof = False
                    break
        if authenticated :
            if prof :
                professor_data = serializers.serialize('json', [professor])
                return JsonResponse({'authenticated': True, 'prof' : True,  'professor': professor_data }, safe=False)
            else :
                student_data = serializers.serialize('json', [student])
                return JsonResponse({'authenticated': True, 'prof' : False,  'student': student_data }, safe=False)
        else:
            return Response({'authenticated': False})
                   



@api_view(['POST'])
def Noter_view(request):
    if request.method == 'POST':
        nom_classe = request.data.get('nom_classe') 
        classe = Classe.objects.get(nom=nom_classe)
        etudiants = Etudiant.objects.filter(classe=classe.id)
        etudiants_data = serializers.serialize('json', etudiants)
        print(etudiants_data)
        return JsonResponse({ 'etudiants': etudiants_data    }, safe=False)


@api_view(['POST'])
def Noter_abs(request):
    if request.method == 'POST':
        etudiants = request.data.get('ramoList')
        module_id = request.data.get('module_id')
        module = Module.objects.get(id=module_id)
        classe_id = request.data.get('classe_id')
        classe = Classe.objects.get(id=classe_id)
        professor = request.data.get('professor')
        prof = Professeur.objects.get(nom=professor['nom'],prenom = professor['prenom'])
        enseignement = Enseignement.objects.get(professeur=prof,classe = classe, module = module)
        
        seance = Seance.objects.create(date=timezone.now().date(), enseignement=enseignement)
        seance.save()
        for etudiant in etudiants:
            etudiant_obj = Etudiant.objects.get(id=etudiant['pk'])
            abssence = Abssence.objects.create(etudiant=etudiant_obj, seance=seance, valeur=etudiant['status'])
            abssence.save()
        return JsonResponse({ 'noter': True }, safe=False)




@api_view(['POST'])
def Voire_abs(request):
    if request.method == 'POST':
        module_id = request.data.get('module_id')
        module = Module.objects.get(id=module_id)
        classe_id = request.data.get('classe_id')
        classe = Classe.objects.get(id=classe_id)
        professor = request.data.get('professor')
        prof = Professeur.objects.get(nom=professor['nom'],prenom = professor['prenom'])
        enseignement = Enseignement.objects.get(professeur=prof,classe = classe, module = module)
        seances = Seance.objects.filter(enseignement=enseignement)
        etudiants = Etudiant.objects.filter(classe=classe.id)
        etudiants_data = []
        for etudiant in etudiants:
            P = 0 
            A = 0
            S = 0
            for seance in seances:
                abssence = Abssence.objects.get(seance=seance,etudiant=etudiant)
                if abssence.valeur == 'P':
                    P += 1
                else:
                    A +=1
                S += 1
            my_instance = Absence_value(etudiant.id, etudiant.nom, etudiant.prenom, S, P,   A)
            etudiants_data.append(my_instance.to_dict())
        etudiants_data  = json.dumps(etudiants_data)
        return JsonResponse({"etudiants_data" : etudiants_data}, safe=False)


@api_view(['POST'])
def log_prof(request):
    if request.method == 'POST':
        prof = request.data.get('professor')
        professor = Professeur.objects.get(nom=prof['nom'],prenom = prof['prenom'])
        filier_info_data = None
        filier =  None
        filier_data = None
        if professor.role.lower() == 'chef':
                    filier = Fillier.objects.get(chef = professor)
                    filier_classes =Classe.objects.filter(fillier = filier)
                    filier_info=[]
                    for c in filier_classes:
                        nombre_etudiant = 0
                        etudiant_max_absence = None
                        max_absence = float('-inf')
                        etudiant_min_absence = None
                        min_absence = float('inf')
                        etudiants_filier =Etudiant.objects.filter(classe=c.id)
                        nombre_etudiant = etudiants_filier.count()
                        for e in etudiants_filier :
                            nombre_absences = Abssence.objects.filter(etudiant_id=e.id, valeur='A').count()
                            if (nombre_absences >= max_absence ):
                                max_absence = nombre_absences
                                etudiant_max_absence = e
                            if (nombre_absences < min_absence):
                                min_absence = nombre_absences
                                etudiant_min_absence = e
                        if etudiants_filier.exists():
                                my_instance = state_classe(c.nom, c.id, nombre_etudiant,etudiant_max_absence.id, etudiant_max_absence.nom , max_absence ,etudiant_min_absence.id , etudiant_min_absence.nom,min_absence  )
                        else : 
                                my_instance = state_classe(c.nom, c.id, 0,"yassine", "yassine" ,  0,"yassine" , "yassine",0  )
                        filier_info.append(my_instance.to_dict())
                    filier_data = serializers.serialize('json', [filier])
                    filier_info_data  = json.dumps(filier_info)
                            
        enseignements = Enseignement.objects.filter(professeur=professor)
        classe_ids = [e.classe.id for e in enseignements]
        classes = Classe.objects.filter(id__in=classe_ids)
        modules = []
        for c in classes:
            e = Enseignement.objects.filter(professeur=professor, classe=c)
            for m in e:
                my_instance = module_classe(c.nom, c.id, m.module.nom, m.module.id)
                modules.append(my_instance.to_dict())
        professor_data = serializers.serialize('json', [professor])
        enseignements_data = serializers.serialize('json', enseignements)
        classes_data = serializers.serialize('json', classes)
        modules_data  = json.dumps(modules)
        return JsonResponse({'authenticated': True, 'professor': professor_data, 'enseignements': enseignements_data , "classes" : classes_data,"modules" : modules_data , "filier_data" :filier_data , "filier_info_data" :filier_info_data      }, safe=False)


@api_view(['POST'])
def log_student(request):
    if request.method == 'POST':
        et = request.data.get('student')
        etudiant = Etudiant.objects.get(nom=et['nom'],prenom = et['prenom'])
        classe = Classe.objects.get(nom =etudiant.classe)
        enseignements = Enseignement.objects.filter(classe = classe)
        etudiants_data = []
        for  enseignement in enseignements:
            cls = enseignement.classe.nom
            mdl = enseignement.module.nom
            prof_nom = enseignement.professeur.nom
            prof_prenom = enseignement.professeur.prenom
            seances = Seance.objects.filter(enseignement=enseignement)
            P = 0 
            A = 0
            S = 0
            for seance in seances:
                abssence = Abssence.objects.get(seance=seance,etudiant=etudiant)
                if abssence.valeur == 'P':
                    P += 1
                else:
                    A +=1
                S += 1
            my_instance = Absence_etudiant(mdl, prof_nom, prof_prenom, S , P, A)
            etudiants_data.append(my_instance.to_dict())
        etudiants_data_abs  = json.dumps(etudiants_data)
        return  JsonResponse({'authenticated': True,'cls': cls ,'etudiants_data' : etudiants_data_abs}, safe=False)



@api_view(['POST'])
def reset_message(request):
    if request.method == 'POST':
        username = request.data.get('username') 
        domaine = username.split("@")[1]
        authenticated = False
        if domaine.lower() == "usms.ma":    
            professors = Professeur.objects.all()
            for p in professors:
                if  p.email.lower() == username.lower() :
                    authenticated = True
                    passe = p.mote_pass
                    subject = 'Message de test'
                    message = 'Votre mot de passe : ' + str(passe)
                    from_email = 'omar20star@gmail.com'
                    to_email = 'elhariri20omar@gmail.com'
                    send_mail(subject, passe, from_email, [to_email])
                    break
        else :
            students = Etudiant.objects.all()
            for s in students: 
                if  s.email.lower() == username.lower() :
                    authenticated = True
                    passe = s.mote_pass
                    subject = '[RGA] Your password was reset'
                    message = 'Votre mot de passe : ' + str(passe)
                    from_email = 'omar20star@gmail.com'
                    to_email = 'elhariri20omar@gmail.com'
                    send_mail(subject, message, from_email, [to_email])
                    break
        return  JsonResponse({'authenticated': authenticated}, safe=False)



@api_view(['POST'])
def filier_state(request):
    if request.method == 'POST':
        class_id = request.data.get('class_id')
        etudiants = Etudiant.objects.filter(classe=class_id)
        vide = True
        if etudiants : 
            vide = False
        etudiants_data = []
        for e in etudiants : 
            etudiant = etudiant_filier(e.id, e.nom, e.prenom, e.email)
            etudiants_data.append(etudiant.to_dict())
        etudiants_data_filier  = json.dumps(etudiants_data)
        return  JsonResponse({"vide" : vide  ,'etudiants_data_filier':etudiants_data_filier }, safe=False)


@api_view(['POST'])
def etudiant_statistique(request):
    if request.method == 'POST':
        class_id = request.data.get('class_id')
        etudiant_id = request.data.get('etudiant_id')
        etudiant = Etudiant.objects.get(id=etudiant_id)
        classe = Classe.objects.get(id=class_id)
        enseignements = Enseignement.objects.filter(classe = classe)
        etudiant_stat_abs = []
        for  enseignement in enseignements:
            mdl = enseignement.module.nom
            prof_nom = enseignement.professeur.nom
            prof_prenom = enseignement.professeur.prenom
            seances = Seance.objects.filter(enseignement=enseignement)
            P = 0 
            A = 0
            S = 0
            for seance in seances:
                abssence = Abssence.objects.get(seance=seance,etudiant=etudiant)
                if abssence.valeur == 'P':
                    P += 1
                else:
                    A +=1
                S += 1
            stat = etudiant_stat(mdl, prof_nom, prof_prenom, P, A, S)
            etudiant_stat_abs.append(stat.to_dict())
        etudiant_stat_abs_data = json.dumps(etudiant_stat_abs)
        return  JsonResponse({'etudiant_stat_abs_data':etudiant_stat_abs_data }, safe=False)
        





from PIL import Image
# Create your views here.
@api_view(['POST'])
def noter_camera(request):
    # Load known face images and their names
    if request.method == 'POST':
        classe_id = request.data.get('classe_id')
        module_id =   request.data.get('module_id')
        professor =  request.data.get('professor')
        prof = Professeur.objects.get(nom=professor['nom'],prenom = professor['prenom'])
        module = Module.objects.get(id=module_id)
        classe = Classe.objects.get(id=classe_id)
        
        enseignement = Enseignement.objects.get(professeur=prof,classe = classe, module = module )
        seance = Seance.objects.create(date=timezone.now().date(), enseignement=enseignement)
        seance.save()
        etudiants = Etudiant.objects.filter(classe=classe_id)

        known_face_encodings = []
        known_face_names = []

        for e in etudiants :
            if e.image.path :
                known_face_encodings.append(face_recognition.face_encodings(face_recognition.load_image_file(e.image.path))[0])
                known_face_names.append(e)

        video_capture = cv2.VideoCapture(0)
        
        present=list()
        start_time = time.time()
        while True:
    # Capture a single frame
            ret, frame = video_capture.read()
    
    # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
            rgb_frame = frame[:, :, ::-1]

    # Find all the faces and face encodings in the current frame
            face_locations = face_recognition.face_locations(rgb_frame)
            face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
        
            for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
                matches = face_recognition.compare_faces(known_face_encodings, face_encoding)

        # If a match was found, use the first one
                if True in matches:
                    first_match_index = matches.index(True)
                    if known_face_names[first_match_index] in present:
                        continue
                    present.append(known_face_names[first_match_index])
                     

            elapsed_time = time.time() - start_time
            if elapsed_time > 10:
                break

# Release the web camera and close the window
    video_capture.release()
    cv2.destroyAllWindows()
    print(present)
    for etudiant in etudiants:
        if etudiant in present:
                abssence = Abssence.objects.create(etudiant=etudiant, seance=seance, valeur='P')
                abssence.save()
        else : 
            abssence = Abssence.objects.create(etudiant=etudiant, seance=seance, valeur='A')
            abssence.save()

    return  JsonResponse({'noter':len(present) }, safe=False)



