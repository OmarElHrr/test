import React, { useRef, useState   ,useEffect} from 'react';
import { View, Text, StyleSheet, PanResponder,FlatList, BackHandler ,Image,TouchableHighlight , TouchableOpacity, TextInput} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BASE_URL from './config.js';

const ClasseScreen = ({ route }) => {
    const navigation = useNavigation();
    const { nom_classe, etudiants_filier, professor , class_id } = route.params;
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

    const filteredEtudiants = etudiants_filier.filter(
      (etudiant) =>
        etudiant.etudiant_nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        etudiant.etudiant_prenom.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemClick(item)}>
      <View style={{ marginVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
        <Image source={require('./assets/etudiant.png')} style={{ width: 50, height: 50, marginRight: 10, borderRadius: 50 }} />
        <View style={{ marginVertical: 10 }}>
          <Text style={styles.title}>
            {item.etudiant_nom} {item.etudiant_prenom}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.email}> {item.etudiant_mail}</Text>
          </View>
        </View>
      </View>
      </TouchableOpacity>
    );
    const handleItemClick = (etudiant) => {

        fetch(BASE_URL + 'etudiant_statistique/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class_id : class_id,
        etudiant_id : etudiant.etudiant_id
      }),
    })
    .then(response => response.json())
    .then(data => {
      const etudiant_stat_abs_data = JSON.parse(data.etudiant_stat_abs_data)
        navigation.navigate('StatistiqueScreen', { 
            nom_classe: nom_classe,
            etudiant_nom : etudiant.etudiant_nom,
            etudiant_prenom : etudiant.etudiant_prenom,
            etudiant_stat_abs_data : etudiant_stat_abs_data,
             professor : professor,
             etudiants_filier : etudiants_filier,
             class_id :class_id,
        });
    })
    .catch(error => {
      console.error("Error while sending data to server: ", error);
    });


        
      };
  
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
                <Text style={styles.profileName}>Classe {nom_classe}</Text>
              </>
            </TouchableHighlight>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={(query) => setSearchQuery(query)}
              placeholder="Chercher un étudiant"
              placeholderTextColor="#000"
            />
          </View>
          <FlatList
            data={filteredEtudiants}
            renderItem={renderItem}
            keyExtractor={(item) => item.etudiant_id.toString()}
            ItemSeparatorComponent={Separator}
          />
        </View>
        <View></View>
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
  email : {
    fontSize : 15,
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
    flex: 0.8,
    position: 'relative', 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    width: '90%',
    paddingTop: 20,
    marginTop: 100,
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

export default ClasseScreen;
