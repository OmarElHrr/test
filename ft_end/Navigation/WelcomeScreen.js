import React, { useRef, useState } from 'react';
import { View, Text, PanResponder, Animated , StyleSheet, ImageBackground ,FlatList, TouchableOpacity , Image,TouchableHighlight } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BarChart ,LineChart } from 'react-native-gifted-charts';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BASE_URL from './config.js';



const WelcomeScreen = ({ route }) => {
  const { user, cls , chef, filier_info_data , filier_data,role ,etudiants_data_abs, isprof, classes, enseignements, modules  } = route.params;
  const navigation = useNavigation();
  const [selectedModule, setSelectedModule] = useState(null);
  const professor = user;
  const [isModalVisible, setModalVisible] = useState(false);

  const SingleBarChartComponent = ({ filier_info_data }) => {
    const chartData = filier_info_data.map(classe => ({
      value: classe.nombre_etudiant,
      label: classe.nom_classe,
      spacing: 1  ,
      labelWidth: 45,
      labelTextStyle: {color: 'black', fontSize : 16 , marginLeft : 14},
      frontColor: '#D7DAF2',
    }));
    

    const barData = filier_info_data.map(classe => ({
      value: classe.max_absence,
      frontColor: '#F5D6E5',
      spacing: 1
    }));
    
    const lineData = filier_info_data.map(classe => ({
      value: classe.min_absence,
      frontColor: '#DBFAE0',
      spacing: 35
    }));

    const mergedData = [];

for (let i = 0; i < filier_info_data.length; i++) {
  mergedData.push(chartData[i], barData[i],  lineData[i]);
}

  
    return (
      <View>
     
     <BarChart
          data={mergedData}
          width={250}
          height={190}
          yAxisLabel=""
          barWidth={15}
          initialSpacing={20}
          barBorderRadius={14}
          xAxisType={'dashed'}
          xAxisColor={'lightgray'}
          XAxisTextStyle={{fontSize : 45}}
          yAxisTextStyle={{fontSize : 15}}
          chartConfig={{
            backgroundGradientFrom: 'white',
            backgroundGradientTo: 'white',
            decimalPlaces: 0,
           
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 50,
            }
          }}
        />
      </View>
    );
  };
  
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const togleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const renderClassList = () => {
    return filier_info_data.map((item, index) => (
      <React.Fragment key={item.classe_id}>
        <TouchableOpacity onPress={() => handleClassPress(item.classe_id , item.nom_classe)}>
          <View style={styles.classItemContainer_filier}>
            <Icon name="school" size={25}  style={styles.classIcon_filier} />
            <Text style={styles.classItem_filier}>{item.nom_classe}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator_filier} />
      </React.Fragment>
    ));
  };

  const handleClassPress = (class_id , nom_classe) => {
    fetch(BASE_URL +'filier_statistique/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class_id : class_id,
      }),
    })
    .then(response => response.json())
    .then(data => {
      const etudiants_filier = JSON.parse(data.etudiants_data_filier)
      const vide =  JSON.parse(data.vide)
      if (!vide){
        navigation.navigate('ClasseScreen', { 
          nom_classe: nom_classe,
          class_id : class_id,
          etudiants_filier : etudiants_filier,
          professor : professor,
        });
      }
      else {
        togleModal()
      }
    })
    .catch(error => {
      console.error("Error while sending data to server: ", error);
    });
  };
 
  
  
  const handlePressA = (module) => {
    
    // Envoi des données au serveur Django
    fetch(BASE_URL + 'noter/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        professor : user,
        nom_module: module.nom_module,
        nom_classe: module.nom_classe,
        classe_id: module.classe_id,
        module_id: module.module_id,
      }),
    })
    .then(response => response.json())
    .then(data => {
      const etudiants = JSON.parse(data.etudiants)
      console.log(etudiants)
      navigation.navigate('NoterScreen', { 
        professor: user,
        classes : classes,
        modules : modules,
        enseignements : enseignements,
        nom_module: module.nom_module,
        nom_classe: module.nom_classe,
        classe_id: module.classe_id,
        module_id: module.module_id,
        etudiants : etudiants
      });
    })
    .catch(error => {
      console.error("Error while sending data to server: ", error);
    });
  };

  

  const handlePressB = (module) => {
   

      fetch(BASE_URL +'voire/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          professor : professor,
          nom_module: module.nom_module,
          nom_classe: module.nom_classe,
          classe_id: module.classe_id,
          module_id: module.module_id,
        }),
      })
      .then(response => response.json())
      .then(data => {
        const etudiants = JSON.parse(data.etudiants_data)
        // Navigation vers la page NoterScreen
        navigation.navigate('VoirScreen', { 
          professor: professor,
          // classes : classes,
          // modules : modules,
          // enseignements : enseignements,
          nom_module: module.nom_module,
          nom_classe: module.nom_classe,
          // classe_id: module.classe_id,
          // module_id: module.module_id,
           etudiants : etudiants
        });
      })
      .catch(error => {
        console.error("Error while sending data to server: ", error);
      });



  }


  const renderModuleItem = ({ item }) => {
    return (
      <View style={styles.moduleContainer}>
        <Text style={styles.moduleClass}>{item.nom_classe}</Text>
        <TouchableOpacity
          onPress={() => setSelectedModule(item)}
          style={styles.moduleDetails}
        >
          <Text style={styles.moduleName}>{item.nom_module}</Text>
        </TouchableOpacity>
        {selectedModule && selectedModule.nom_module === item.nom_module && (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={() => handlePressA(item)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Notez</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handlePressB(item)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Voir</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };
  
  function MyComponent({ modules, professor, navigation }) {
    const [selectedModule, setSelectedModule] = useState(null);
  
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
          </View>
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>Bienvenue sur RGA</Text>
          <FlatList
            data={modules}
            renderItem={renderModuleItem}
            keyExtractor={(item) => item.nom_module}
          />
        </View>
        <View></View>
        {chef ? (
      <View>
     <View style={styles.container_filier}>
  
     <TouchableOpacity onPress={toggleModal}>
    <Text style={styles.label}>{filier_data.nom_comlaite}</Text>
    </TouchableOpacity>
    <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContainer_filier}>
          <Text style={styles.title_filier}>Quelle classe souhaitez-vous consulter ?</Text>
          {renderClassList()}
        </View>
      </Modal>

    <View style={styles.containre_map} >
    <View style={styles.row}>
  <Icon name="circle" style={styles.circleIcon_nombre} /> 
  <Text style={styles.label_map}>nombres des etudiants</Text>
</View>
<View style={styles.row}>
  <Icon name="circle" style={styles.circleIcon_max} /> 
  <Text style={styles.label_map}>max des absences</Text>
</View>
<View style={styles.row}>
  <Icon name="circle" style={styles.circleIcon_min} />
  <Text style={styles.label_map}>min des absences</Text>
</View>
    </View>
    <View style={styles.filier_bar} >
      
    <SingleBarChartComponent filier_info_data={filier_info_data} />
    </View>
    </View>
      </View>
    ) : null}
      </View>
    );
  }

  const renderItem = ({ item }) => {
    return (
      <View style={styles.container_student}>
        <Text style={styles.moduleName_1}>{item.module_nom}</Text>
        <Text style={[styles.profName_1, { textTransform: 'uppercase' }]}> P. {item.prof_nom}  {item.prof_prenom}</Text>
        <View style={styles.container_science}>
        <Text  style={styles.text_value}>{item.nombre_scince} sciences</Text>
        </View>
        <View style={styles.container_pres}  >
        <Text  style={styles.text_value}>{item.nombre_presence} présences</Text>
        </View>
        <View style={styles.container_abs}>
        <Text style={styles.text_value}>{item.nombre_absence} absences</Text>
        </View>
      </View>
    );
  };

  const renderFlatList = () => {
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
              <Text style={styles.profileName}>  Classe {cls}  </Text>
            </>
          </TouchableHighlight>
        </View>
      </View>
      <View style={styles.globalContainer_etudiant}>
        <FlatList
          data={etudiants_data_abs}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      </View>
    );
  };

  
  
  
  if (isprof) {
    return <MyComponent modules={modules} professor={user} navigation={navigation} />;
  } else {
    return renderFlatList();}
};

const styles = StyleSheet.create({
globalContainer_etudiant:{
  backgroundColor: "rgba(103, 223, 226, 0.15)"  ,//'rgba(1, 132, 249, 0.3)',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius : 30,
  marginTop : 60,
  height : "60%",
  width : "95%",
  },
  container_student:{
     padding: 10, 
     backgroundColor: 'white',
     marginTop : 10, 
     marginLeft : 10,
     marginBottom: 10, 
     borderWidth: 1, 
     borderRadius : 30,
     borderColor: 'black', 
     width :350,
     height : 140,
    },
    bar: {
      width: 30,
      backgroundColor: 'blue',
      marginRight: 10,
    },
  globalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  containre_map : {
    position: 'absolute',
    marginLeft : 200,
    marginTop : 50,

  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  circleIcon_nombre: {
    position : 'relative',
    fontSize: 14,
    color: '#D7DAF2',
  },
  circleIcon_max: {
    position : 'relative',
    fontSize: 14,
    color: '#F5D6E5',
  },
  circleIcon_min: {
    position : 'relative',
    fontSize: 14,
    color: '#DBFAE0',
  },
  modalContainer_filier: {
    backgroundColor: 'rgba(255, 255, 249, 0.9)',
    borderRadius: 8,
    padding: 16,
    width: '86%',
    height: 250,
    marginLeft : '8%',
  },
  classItem_filier: {
    fontSize: 20,
    marginBottom: 1,
    color : 'blue',
  },
  separator_filier: {
    borderBottomColor: 'black',
    borderBottomWidth: 0.5,
    marginVertical: 8,
    marginLeft : 47,
  },
  title_filier : {
    fontSize: 15,
    color: '#0D0D0D',
    fontWeight: 'bold',
    marginBottom : 5,
  },
  classItemContainer_filier: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  classIcon_filier: {
    marginRight: 15,
    color: 'black',
    marginLeft : 10,
  },
  label_map: {
    fontSize: 10,
    color: 'black',
    marginLeft: 5,
    marginTop : -5,
  },
  container_filier: {
    position: 'relative',
    backgroundColor : 'rgba(1, 132, 249, 0.5)',
    height: 320 ,
    width: 350,
    marginTop: 10,
    marginLeft: 0,
    borderRadius: 30,
  },
  filier_bar: {
    marginTop : 30,
    paddingLeft : 10,
  },

  container_science : {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
      width : 97,
      height : 40,
      backgroundColor: "#67DFE2",
      marginTop : 70,
      marginLeft : 20,
      paddingLeft : 3,
      borderRadius : 20,
      borderBottomWidth: 2.5,
      borderBottomColor: 'gray',
  },
  container_pres:{
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    width : 100,
    height : 40,
      backgroundColor: "#BBF6CA",
      marginTop : 70,
      marginLeft : 130,
      paddingLeft : 3,
      borderRadius : 20,
      borderBottomWidth: 2.5,
      borderBottomColor: 'gray',
  },
  container_abs:{
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    width : 97,
      height : 40,
      backgroundColor: "#F4C9C4",
      marginTop : 70,
      marginLeft : 240,
      paddingLeft : 3,  
      borderRadius : 20,
      borderBottomWidth: 2.5,
      borderBottomColor: 'gray',
  },
  text_value : {
    color : "black",
    fontSize : 14,
    paddingLeft : 3,
  

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
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
    backgroundColor: 'rgba(1, 132, 249, 0.5)',// blue color with 50% opacity
    width: 200,
    borderRadius: 50,
    padding: 10,
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
    flex: 0.7,
    position: 'relative', 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    width: '90%',
    marginTop: 100,
    paddingTop: 0,
  },
  label : {
    fontSize: 17,
    fontStyle: 'italic',
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop : 10,
    marginLeft : 40,
    color: 'red',
  },
  title: {
    fontSize: 24,
    fontStyle: 'italic',
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop : 10,
    color: 'red',
  },
  moduleContainer: {
    backgroundColor: 'rgba(1, 132, 249, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 10,
    borderRadius: 20,
  },
  moduleDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  moduleName: {
    fontSize: 15,
  },
  moduleName_1: {
    marginTop : 5,
    marginLeft : 20,
    fontSize: 16,
    fontWeight: 'bold',
    color : 'black',
  },
  profName_1 : {
    marginTop : 3,
   marginLeft : 60,
   fontSize: 16,
   color : 'rgba(0, 0, 0, 0.8)',
  },
  moduleClass: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#00bfff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  }
  
});

export default WelcomeScreen;
