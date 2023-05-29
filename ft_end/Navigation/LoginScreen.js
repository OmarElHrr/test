import React, { useState } from 'react';
import { View, Text, ImageBackground, Image, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import BASE_URL from './config.js';


const backgroundImage = require('./assets/back.png');
const logo = require('./assets/logo.png');


const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [rEmail, setInputValue] = useState('');
  const navigation = useNavigation();

  const handleForgotPassword = () => {
    setModalVisible(true);
  };


  const handleModalClose = () => {
    setModalVisible(false);
    setInputValue('');
    setErrorMessage('');
    
  };

  const handleResetPassword = () => {
    
    
    
    
    fetch(BASE_URL + 'reset_message/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: rEmail,
      }),
    })
    .then(response => response.json())
    .then(data => {
      if(data.authenticated)
      { 
        handleModalClose();
        setErrorMessage('un message envoi a votre mail');
      }
      else {
        handleModalClose();
        setErrorMessage('');
      }
    
    })
    .catch(error => {
      console.error("Error while sending data to server: ", error);
    });
  };
  
  const handleLogin = () => {
    fetch(BASE_URL + 'log/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: email,
        password: password
      })
    })  
    .then(response => response.json())
    .then(data => {
      // Vérifier si l'utilisateur est authentifié ou non
      
      if (data.authenticated) {
        
        if (data.prof) {
          const professor = JSON.parse(data.professor)[0].fields;
          const isprof = JSON.parse(data.prof)
          
          fetch(BASE_URL + 'log_prof/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              professor : professor
            })
          })
          .then(response => response.json())
          .then(data => {
            const professor = JSON.parse(data.professor)[0].fields;
            const enseignements = JSON.parse(data.enseignements)
            const classes = JSON.parse(data.classes)
            const modules = JSON.parse(data.modules) 
            filier_data = null
            filier_info_data = null

            if (professor['role'] === 'CHEF') {
              chef = true;
              role_af = 'Chef de filiere & Prof'
              filier_data = JSON.parse(data.filier_data)[0].fields;
              filier_info_data = JSON.parse(data.filier_info_data)
            } else {
              chef = false;
              role_af = 'Prof'
            }
            navigation.navigate('DrawerProfScreen', { 
              user: professor,
              chef : chef,
              filier_data: filier_data,
              filier_info_data: filier_info_data,
              role : professor['role'],
              isprof : isprof,
              role_af : role_af,
              enseignements: enseignements,
              classes: classes,
              modules : modules
            });
            
          })
          .catch(error => console.error(error));
          setErrorMessage('');
        }
        else {
          const student = JSON.parse(data.student)[0].fields;
          const isprof = false;
          const role_af  ='Etudiant';
          fetch(BASE_URL + 'log_student/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              student : student,
            })
          })
          .then(response => response.json())
          .then(data => {
            const cls = data.cls
            const etudiants_data_abs = JSON.parse(data.etudiants_data)
            navigation.navigate('DrawerProfScreen', { 
              role : 'Etudiant',
              role_af :role_af,
              user: student,
              isprof : isprof,
              cls : cls,
              etudiants_data_abs : etudiants_data_abs
            });
          
            
          })
          .catch(error => console.error(error));
          setErrorMessage('');

        }
      }
       else {
        setErrorMessage('Nom d\'utilisateur ou mot de passe incorrect');
        setPassword('');
         console.log('Nom d\'utilisateur ou mot de passe incorrect');
        }
    })
    .catch(error => console.error(error));
  };
  
 
  
  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      {errorMessage !== '' && (
        <Text style={styles.errorText}>{errorMessage}</Text>
          )}
      <View style={styles.backgroundContainer}>
        <View style={styles.container}>
          <Image source={logo} style={styles.logo} />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholderTextColor = '#000'
            
            />
          <TextInput
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor = '#000'
            />
          
          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Se connecter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
        </TouchableOpacity>
        <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Réinitialisation du mot de passe</Text>
          <TextInput
            value={rEmail}
            onChangeText={setInputValue}
            placeholder="Email"
            style={styles.input}
          />
          <TouchableOpacity style={styles.modalButton_1} onPress={handleResetPassword}>
            <Text style={styles.modalButtonText}>Réinitialiser</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={handleModalClose}>
            <Text style={styles.modalButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </Modal>  
        </View>
      </View>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    height: '100%',
  },
  modalContainer: {
    backgroundColor: "#94D5FF",
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    height : 220,
    width : 370,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  modalButton: {
    backgroundColor: '#FFBBBA',
    position: 'relative',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 15,
    marginTop : -40,
    marginLeft : 150,
    width : 140,
    height :40,
  },
  modalButton_1: {
    backgroundColor: '#FFBBBA',
    position: 'relative',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 15,
    marginTop : 16,
    marginLeft : -140,
    width : 140,
    height :40,
  },
  modalButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backgroundContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width : 350,
    height: 440,
    marginLeft : 25,
    borderRadius : 35,
  },
  container: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginTop : 180,
    width: 100,
    height: 50,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 30,
    color: 'white',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    backgroundColor: 'transparent',
    padding: 15,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'normal',
    alignItems : 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: 'gray',
    //paddingLeft : 20,
  },
  errorText:{
    color : "rgba(255, 0, 0, 1)",
    fontSize: 18,
    marginBottom: 20,    
    marginLeft : 20,
    marginRight : 30,
    fontWeight: 'bold',
  },
  placeholder: {
    color: '#000',
    fontSize: 100,
    padding : 50
  },
  button: {
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 15,
    borderRadius: 10,
    marginTop : 50,
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
  },
  forgotPassword:
  {
    marginTop : 20,

  },
  forgotPasswordText : {
    color : 'white',
    fontSize: 25,
  }
});


export default LoginScreen;
