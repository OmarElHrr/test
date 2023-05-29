from django.urls import path 
from . import views

urlpatterns = [
    path('noter_camera/',views.noter_camera),
    path('log/',views.login_view),
    path('noter/',views.Noter_view),
    path('noter_abs/',views.Noter_abs),
    path('voire/',views.Voire_abs),
    path('log_prof/',views.log_prof),
    path('log_student/',views.log_student),
    path('reset_message/',views.reset_message),
    path('filier_statistique/',views.filier_state),
    path('etudiant_statistique/',views.etudiant_statistique),

]