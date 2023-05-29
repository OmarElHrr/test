import React, { useRef, useState ,useEffect } from 'react';
import { View, Text, StyleSheet, PanResponder,FlatList, BackHandler, Image,TouchableHighlight , TextInput} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BASE_URL from './config.js';


const VoirScreen = ({ route }) => {
  const navigation = useNavigation();
  const { etudiants, nom_module, nom_classe, professor } = route.params;
  const firstEtudiant = etudiants[0]; //récupération du premier étudiant
  const nombre_scince = firstEtudiant.nombre_scince;
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredEtudiants = etudiants.filter(
    (etudiant) =>
      etudiant.etudiant_nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      etudiant.etudiant_prenom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={{ marginVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
      <Image source={require('./assets/etudiant.png')} style={{ width: 50, height: 50, marginRight: 10, borderRadius: 50 }} />
      <View style={{ marginVertical: 10 }}>
        <Text style={styles.title}>
          {item.etudiant_nom} {item.etudiant_prenom}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.present}>
            <Text style={{ color: 'white' }}>Présences: {item.nombre_presence}</Text>
          </View>
          <View style={styles.absence}>
            <Text style={{ color: 'white' }}>Absences: {item.nombre_absence}</Text>
          </View>
        </View>
      </View>
    </View>
  );
  const Separator = () => {
    return <View style={styles.separator} />;
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
       <Text style ={styles.modul}>{nom_module}</Text>
        <View style={styles.searchContainer}>
       <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={(query) => setSearchQuery(query)}
          placeholder="Chercher un étudiant"
          placeholderTextColor="#000"
        />
    </View>
        <FlatList data={filteredEtudiants} renderItem={renderItem} keyExtractor={(item) => item.etudiant_id.toString()}
        ItemSeparatorComponent={Separator} />
      </View>
      <View></View>
      <View style={styles.container_nombre_scince}>
      <Text style={styles.text_nombre_scince} >{nombre_scince} Séances</Text>
    </View>
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
  container_nombre_scince: {
    backgroundColor: 'rgba(1, 132, 249, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 700 , 
    left: '23%', 
    height : 60,
    width: 220,
    borderRadius: 50,
    
  },
  text_nombre_scince:{
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  modul: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',

  },
  absence : {
     backgroundColor: 'rgba(255, 0, 0, 0.7)', 
     padding: 5, 
     borderRadius: 10 ,
     marginLeft : 15,

  },
  present : {
    backgroundColor: 'rgba(0, 128, 0, 0.8)', 
    padding: 5, 
    borderRadius: 10 
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
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 20,
    margin: 2,
    padding: 10,
    width : "80%",
    height: 60,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    width : '100%',
    borderRadius: 15,
    backgroundColor: '#f2f2f2',
    fontSize: 14,
    color: '#000',
  },
  boxContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height :0 ,
    width : 120,
  },
  containe: { 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: 130,
    height: 20,
    paddingTop: 20,
  },
  box: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 50,
    width: 130,
    height: 40,
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});

export default VoirScreen;
