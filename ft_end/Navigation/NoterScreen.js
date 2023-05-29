import React, { useState, useRef ,useEffect } from 'react';
import { View,ActivityIndicator, Text, StyleSheet, FlatList, TouchableOpacity,BackHandler, Animated, Image , TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import BASE_URL from './config.js';

const NoterScreen = ({ route, navigation }) => {
  const { professor, modules, classes,module_id,classe_id, nom_module, nom_classe, enseignements, classe, module, etudiants } = route.params;

  var [studentsList, setStudentsList] = useState(etudiants);
  const [ramoList, setRamoList] = useState([]);
  const alertAnimation = useRef(new Animated.Value(0)).current;
  const [isLoading, setIsLoading] = useState(false);
  const [showPresenceAlert, setShowPresenceAlert] = useState(false);
  const [nombreEtudiants, setNombreEtudiants] = useState(0);
  useEffect(() => {
    const backAction = () => {
    navigation.goBack()
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const handleAbsentButtonPress = (index) => {
    const updatedStudentsList = [...studentsList];
    const student = updatedStudentsList[index];
    student.status = 'A';
    updatedStudentsList.splice(index, 1);
    setStudentsList(updatedStudentsList);
    setRamoList([...ramoList, student]);
  };

  const handlePresentButtonPress = (index) => {
    const updatedStudentsList = [...studentsList];
    const student = updatedStudentsList[index];
    student.status = 'P';
    updatedStudentsList.splice(index, 1);
    setStudentsList(updatedStudentsList);
    setRamoList([...ramoList, student]);
    console.log(ramoList)
  };

  const renderItem = ({ item, index }) => (
    <View style={{ marginVertical: 5, flexDirection: 'row', alignItems: 'center' ,width : 300, height : 60, flex : 1 } }>
      <Image source={require('./assets/etudiant.png')} style={{ width: 50, height: 50, marginRight: 10, borderRadius: 50 }} />
      <View style={{ marginVertical: 10 }}>
        <Text style={styles.nom}>
        {item.fields.nom} {item.fields.prenom}
        </Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.absentButton}
          onPress={() => handleAbsentButtonPress(index)}
        >
          <Text>Absent</Text>
        </TouchableOpacity>
        <TouchableOpacity
         style={styles.presentButton}
          onPress={() => handlePresentButtonPress(index)}
        >
          <Text>Présent</Text>
        </TouchableOpacity>
        
      </View>
    </View>
    </View>
  );

  const handleValiderButtonPress = () => {
    fadeOutAlert();
    navigation.navigate('WelcomeScreen', { 
      professor: professor,
      enseignements: enseignements,
      classes: classes,
      modules : modules
    });
    console.log("hhhh button pressed");
    fetch(BASE_URL +'noter_abs/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ramoList: ramoList,
        professor: professor,
        classe : classe,
        module : module,
        module_id :module_id,
        classe_id :classe_id
        
        
      })
    })
    .catch(error => console.error(error));
  };

  const handleResetButtonPress = () => {
    fadeOutAlert();
    setStudentsList(etudiants);
    setRamoList([]);
  };

  const noterparcamera = () => {
    setIsLoading(true);

    fetch(BASE_URL + 'noter_camera/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        classe_id: classe_id,
        professor: professor,
        module_id: module_id,
      }),
    })
      .then(response => response.json())
      .then(data => {
        const noter = JSON.parse(data.noter);
        setIsLoading(false);
        setNombreEtudiants(noter);
        setShowPresenceAlert(true);
      })
      .catch(error => {
        console.error("Error while sending data to server: ", error);
        setIsLoading(false);
      });
  };

  const hidePresenceAlert = () => {
    setShowPresenceAlert(false);
  };

  const Separator = () => {
    return <View style={styles.separator} />;
  };

  const fadeInAlert = () => {
    Animated.timing(alertAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const fadeOutAlert = () => {
    Animated.timing(alertAnimation, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };


  return (
    <View style={styles.globalContainer}>
    <View style={styles.header}>
      <View style={styles.blackBox}>
        <Image source={require('./assets/x.png')} style={styles.blackBoxImage} />
        <TouchableHighlight
          style={styles.profileContainer}
          underlayColor="transparent"
          onPress={() => navigation.openDrawer()}
        >
          <>
            <Image source={require('./assets/avatar.jpg')} style={styles.profileImage} />
            <Text style={styles.profileName}>{professor.nom}</Text>
          </>
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.nombre}
          underlayColor="transparent"
          onPress={() => navigation.openDrawer()}
        >
          <>
            <Text style={styles.profileName}>  Classe {nom_classe}  </Text>
          </>
        </TouchableHighlight>
      </View>
    </View>
    <View style={styles.container}>
    <Text style={styles.title}>Liste des étudiants </Text>
    {studentsList.length > 0 ? (
      <FlatList
        data={studentsList}
        renderItem={renderItem}
        keyExtractor={(item) => item.pk.toString()}
      ItemSeparatorComponent={Separator} />
    ) : (
      <>
        {fadeInAlert()}
        <Animated.View style={[styles.alert, { opacity: alertAnimation }]}>
            <Text style={styles.alertText}>Alert! </Text>
        <Image source={require('./assets/alert.png')} style={styles.alert_img} />
            <View style={styles.alertButtonsContainer}>
              <TouchableOpacity style={styles.alertButton_valider} onPress={handleValiderButtonPress}>
                <Text style={styles.alertButtonText_valide}>OUI</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.alertButton_reset} onPress={handleResetButtonPress}>
                  <Text style={styles.alertButtonText}>NON</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
      </>
    )}
  </View>
  <View style={styles.reset}>
  <TouchableOpacity  onPress={handleResetButtonPress}>
  <Icon name="refresh" size={30} color="black" />
    
  </TouchableOpacity>
</View>
  <View style={styles.camera}>
  <TouchableOpacity  onPress={noterparcamera}>
  <Icon name="camera" size={30} color="black" />
  
  </TouchableOpacity>
</View>
<Modal isVisible={isLoading}>
        <View style={styles.modalContainer}>
        <ActivityIndicator size={100} color="rgba(1, 132, 249, 0.8)" />
        </View>
      </Modal>

      <Modal isVisible={showPresenceAlert}>
        <View style={styles.modalContainer}>
          <Text style={styles.alertText_camer}>{nombreEtudiants} étudiants sont présents</Text>
          <TouchableOpacity style={styles.okButton} onPress={hidePresenceAlert}>
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
  </View>
 

  );
};
const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute', 
    top: 0,
    left: 0,
    right: 0,
    height: 250,
    borderBottomEndRadius : 40
  },
  modalContainer: {
    width : 350,
    height : 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius : 30,
    marginLeft : 10, // Couleur d'arrière-plan semi-transparente
  },
  alertText_camer: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 4,
    color: 'black',
  },
  okButton: {
    backgroundColor: 'rgba(1, 132, 249, 0.8)',
    marginTop : 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  okButtonText: {
    color: 'white',
    fontSize: 16,
  },
  blackBox: {
    height: '100%',
    width: '100%',
    position: 'relative',
    bottom: 0,
  },
  blackBoxImage: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
  },
  separator: {
    position: 'relative',
    height: 1,
    width: '80%',
    marginLeft : 60,
    backgroundColor: '#ccc',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
    backgroundColor: 'rgba(1, 132, 249, 0.5)',// blue color with 50% opacity
    width: 200,
    borderRadius: 50,
    padding: 10,
  },
  nombre:{
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    marginTop: 57,
    marginLeft : 250,
    backgroundColor: 'rgba(1, 132, 249, 0.5)',// blue color with 50% opacity
    width: 150,
    borderRadius: 50,
    padding: 10,
  }, 
  modul: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
  },
  profileName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    position: 'relative',
    height: 1,
    width: '80%',
    marginLeft : 60,
    backgroundColor: '#ccc',
  },
  container: {
    flex: 0.6,
    position: 'relative', 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    width: '90%',
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    fontWeight: 'bold',
    color: 'blue',
  },
  nom: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  buttonsContainer: {
   flexDirection: 'row', 
   alignItems: 'center',
   marginTop: 10,
  },
  absentButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.7)', 
    position: 'absolute', 
    paddingLeft: 10,
    paddingTop: 4, 
    borderRadius: 10 ,
    marginLeft : 100,
    height : 30,
    width : 70,
  },
  presentButton: {
    backgroundColor: 'rgba(0, 128, 0, 0.8)', 
    borderRadius: 10,
    marginLeft : 15,
    paddingLeft: 10,
    paddingTop: 4, 
    borderRadius: 10,
    height : 30,
    width : 70,

  },
 present : {
   backgroundColor: 'rgba(0, 128, 0, 0.8)', 
   padding: 5, 
   borderRadius: 10 
},
camera:{
  backgroundColor: 'rgba(1, 132, 249, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  top: 700 , 
  left: 220, 
  height : 60,
  width: 150,
  borderRadius: 50,

},
reset: {
  backgroundColor: 'rgba(1, 132, 249, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  top: 700 , 
  left: 40, 
  height : 60,
  width: 150,
  borderRadius: 50,
  
},
alert: {
  //backgroundColor: 'rgba(1, 132, 249, 0.5)',//
  padding: 25,
  borderBottomLeftRadius: 80,
  borderTopLeftRadius: 80,
  borderTopStartRadius: 80,
  borderBottomStartRadius: 80,
  margin: 10,
  height : 200,
  width : "90%",
  borderColor : 'rgba(1, 132, 249, 0.5)',
  borderWidth : 3,
},
  text_reset:{
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  alertText: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 4,
    color: 'black',
    marginLeft : 40,
  },
  alert_img : {
    width: 90,
    height: 90,
    position : 'absolute',
    borderRadius: 50,
    marginRight: 10,
    marginTop : 50,
    marginLeft : 10,
  },
  alertButton_reset: {
    position : 'absolute',
    backgroundColor: 'rgba(255, 0, 0, 0.2)', 
    borderColor : 'red',
    borderWidth: 2,
    paddingTop: 6,
    paddingLeft : 16,
    borderRadius: 50,
    marginTop : 50,
    marginLeft : 180,
    width : 80,
    height : 45,
    
  },
  alertButton_valider: {
    position : 'absolute',
    backgroundColor: 'rgba(0, 155, 0, 0.4)', 
    borderColor : 'green',
    borderWidth: 2,
    marginTop : 50,
    paddingTop: 6,
    paddingLeft : 20,
    borderRadius: 50,
    marginTop : 50,
    marginLeft : 80,
    width : 80,
    height : 45,
  },
  alertButtonText: {
    color: "red",
  fontSize : 20,
  fontWeight: "bold"
  },
  alertButtonText_valide: {
    color: '#fff',
    fontSize: 20,
    fontWeight: "bold"

  },
});


export default NoterScreen;
