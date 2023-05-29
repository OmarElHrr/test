import React, {useEffect} from 'react';
import { View, Text, StyleSheet, Image,  BackHandler,TouchableHighlight, FlatList } from 'react-native';
import { PieChart } from "react-native-gifted-charts";
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BASE_URL from './config.js';

const StatistiqueScreen = ({ route }) => {
  const navigation = useNavigation();
  const { nom_classe,etudiant_nom ,etudiant_prenom, etudiant_stat_abs_data, etudiants_filier, professor, class_id } = route.params;
  
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

  const renderPieChart = ({ item }) => {
    return (
      <View style={styles.barContainer}>
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 1  , marginLeft : 20}}>
            {item.module_nom}
          </Text>
          <Text style={{ fontSize: 16,  marginBottom: 15 , marginLeft : 60}}>
           Dr. {item.prof_nom} {item.prof_prenom}
          </Text>
          <View style={styles.containre_map} >
            <View style={styles.row}>
                 <Icon name="circle" style={styles.circleIcon_pre} /> 
                 <Text style={[styles.label_map, { color: '#009FFF' }]}>{item.presence} Présences</Text>
            </View>
            <View style={styles.row}>
                <Icon name="circle" style={styles.circleIcon_abs} /> 
                <Text style={[styles.label_map, { color: '#FFA5BA' }]}>{item.absence} Absences</Text>
            </View>
          </View>
          <PieChart
            data={[
              { value: item.presence, color: '#009FFF', gradientCenterColor: '#006DFF' },
              { value: item.absence, color: '#FFA5BA', gradientCenterColor: '#FF7F97' },
            ]}
            donut
            showGradient
            sectionAutoFocus
            radius={60}
            innerRadius={40}
            innerCircleColor={'#D7DAF2'}
            centerLabelComponent={() => {
              return (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>
                    {item.sciences}
                  </Text>
                  <Text style={{ fontSize: 13, color: 'black' }}>Sciences</Text>
                </View>
              );
            }}
          />
          <View>
          </View>
        </View>
      </View>
    );
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
      <Text style={styles.title}> {etudiant_nom} {etudiant_prenom}</Text>
        <FlatList
          data={etudiant_stat_abs_data}
          renderItem={renderPieChart}
          keyExtractor={(item, index) => index.toString()}
        />
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
    borderBottomEndRadius: 40
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
  containre_map : {
    position: 'absolute',
    marginLeft : 140,
    marginTop : 90,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  circleIcon_pre: {
    position : 'relative',
    fontSize: 18,
    color: '#009FFF',
  },
  circleIcon_abs: {
    position : 'relative',
    fontSize: 18,
    color: '#FFA5BA',
  },
  label_map: {
    fontSize: 14,
    marginLeft: 5,
    marginTop : -4,
    fontWeight: 'bold',
  },

  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
    backgroundColor: 'rgba(1, 132, 249, 0.5)', // blue color with 50% opacity
    width: 200,
    borderRadius: 50,
    padding: 10,
  },
  nombre: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    marginTop: 57,
    marginLeft: 250,
    backgroundColor: 'rgba(1, 132, 249, 0.5)', // blue color with 50% opacity
    width: 150,
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

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop : 1,
    color: 'black',
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
  barContainer: {
    height: 200,
    width : 350,
    backgroundColor: '#C5EDF4',
    marginBottom : 10,
    paddingTop : 10,
    paddingLeft : 20,
    borderRadius : 40,
  },
});

export default StatistiqueScreen;
