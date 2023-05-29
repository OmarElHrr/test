import React, {useEffect} from 'react';
import { View, Text, Image, StyleSheet , BackHandler ,TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import BASE_URL from './config.js';
const ProfileScreen = ({ route }) => {
    const { user, role ,cls ,role_af,etudiants_data_abs, isprof, classes, enseignements, modules  } = route.params;
    const navigation = useNavigation();
    const handleButtonPress = () => {
        // Action à effectuer lorsque le bouton est pressé
        console.log('Bouton pressé');
      };
      const InfoComponent = ({ isProf, cls }) => {
        console.log(isProf)
        if (isProf) {
          return null; // Ne rien afficher si isProf est true
        }
      
        return (
          <View>
            <View style={styles.infoCnr}>
              <Ionicons name="school-outline" size={24} color="#000" />
              <Text style={styles.infoText}>Class: {cls}</Text>
            </View>
            <View style={styles.line} />
          </View>
        );
      };

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

  return (
    <View style={styles.globalContainer}>
    <View style={styles.imageContainer_glo}>
      <View style={styles.imageContainer}>
        <Image
          source={require('./assets/etudiant.png')}
          style={styles.image}
        />
      </View>
        <Text style={styles.text}>{user.nom} {user.prenom}</Text>
        <Text style={styles.role}> {role_af} </Text>
      </View>
      <View style = {styles.infoContainer_glob1}>

      <View style = {styles.infoContainer_glob} >

      <View style={styles.infoContainer}>
      <View style={styles.textContainer}>
      <View>
  <InfoComponent isProf={isprof} cls={cls} />
    </View>
    
        <View style={styles.infoCnr}>
          <Ionicons name="business-outline" size={24} color="#000" />
          <Text style={styles.infoText}>School: ENSA KHOURIBGA</Text>
        </View>
        <View style={styles.line} />  
        <View style={styles.infoCnr}>
          <Ionicons name="call-outline" size={24} color="#000" />
          <Text style={styles.infoText}>{user.numero_telephone}</Text>
        </View>
        <View style={styles.line} />
        <View style={styles.infoCnr}>
          <Ionicons name="mail-outline" size={24} color="#000" />
          <Text style={styles.infoText}>{user.email}</Text>
        </View>
        <View style={styles.line} /> 

      </View>
      <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
          <Text style={styles.buttonText}>Changer le mot de passe </Text>
        </TouchableOpacity>
      </View>
      </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageContainer_glo:{
    marginTop : 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor : "white",
    width: '100%',
    height: 200,
  },
  imageContainer: {
    backgroundColor : 'rgba(1, 132, 249, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    width : 180,
    height : 180,
    borderRadius : 100,
  },
  button : {
    marginBottom : 70,
  },
  buttonText:{
    color : 'black',  
    fontSize : 18,
    fontWeight : 'bold',
    textAlign : 'center',
  },

  image: {
      width: 150,
      height: 150,
      borderRadius : 75,
    },
    infoContainer_glob1:{
        flex: 1,
        marginTop : 20,
    backgroundColor: 'rgba(1, 132, 249, 0.3)',
    height : 500,
    borderTopRightRadius : 380,
},
infoContainer_glob:
{
    flex: 1,
    marginTop : 20,
    backgroundColor: 'rgba(1, 132, 249, 0.5)',
    height : 500,
    borderTopRightRadius : 380,
    
},
line: {
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    marginVertical: 1,
    marginHorizontal : 110,
    marginLeft : 35,
    marginTop : -1,
  },
infoContainer:
  {
    flex: 1,
    marginTop : 20,
    backgroundColor: 'rgba(1, 132, 249, 0.7)',
    height : 500,
    borderTopRightRadius : 380,

  },
  infoCnr: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    height : 45,
    width : 330,
  },
  infoText: {
    marginLeft: 20,
    fontSize: 18,
    color: '#fff',
  },
  textContainer: {
    flex: 1,
    paddingTop : 150,
    paddingLeft : 33,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color : "#000",
  },
  role :{
    fontSize: 18,
    fontWeight: '500',
    color : "#000",
  }
});

export default ProfileScreen;
