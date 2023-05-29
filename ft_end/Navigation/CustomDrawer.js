import { View, Text, ImageBackground, Image, TouchableOpacity, Switch } from 'react-native'
import React, { useState } from 'react'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native';
import BASE_URL from './config.js';

const CustomDrawer = ({ route, ...props }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const { user, cls ,chef, role_af, role, filier_data, filier_info_data ,etudiants_data_abs, isprof, classes, enseignements, modules } = route.params;
  const navigation = useNavigation();
  

  return (

    <View style={{ flex: 1 , marginTop : 0}}>
      <DrawerContentScrollView  {...props} contentContainerStyle={{ backgroundColor: "#fff" }}>
        <ImageBackground source={require('./assets/back.png')} style={{ padding: 15 , marginTop : -10, marginRight : -3,}}>
          <Image source={require('./assets/avatar.jpg')} 
          style={{ height: 80, width: 80, borderRadius: 40, marginBottom: 10 }} />
          <Text style={{ fontSize: 18, color: "#fff" }}>{user.nom} {user.prenom}</Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 14, color: "#fff", marginLeft: 0 }}> {user.email}</Text>
        
          </View>
        </ImageBackground>
        <View style={{ backgroundColor: "#fff", paddingTop: 7, paddingBottom : 2 }} >
          <DrawerItemList {...props} />
        </View>

        <View>
          <View style={{ backgroundColor: ' rgba(1, 132, 249, 0.8)', width : 260, height : 47, marginBottom : 8 ,marginLeft : 10, padding : 8 ,borderRadius: 5,}}>
        <TouchableOpacity onPress={() =>   navigation.navigate('WelcomeScreen') } style={{  }}  >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name='home-outline' size={24} color="#fff" />
            <Text style={{ fontSize: 15, marginLeft: 10, color: "#fff" }}> Home   </Text>
          </View>
        </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: ' rgba(1, 132, 249, 0.8)', width : 260, height : 47,marginBottom : 10, marginLeft : 10, padding : 8 ,borderRadius: 5,}}>

        
<TouchableOpacity onPress={() =>   navigation.navigate('ProfileScreen',{
      role_af : role_af, user : user ,isprof : isprof, role: role , cls : cls}) } style={{  }}  >
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Ionicons name='person-circle-outline' size={24} color="#fff" />
    <Text style={{ fontSize: 15, marginLeft: 10, color: "#fff" }}>Profile </Text>
  </View>
</TouchableOpacity>
</View>
        <View style={{ backgroundColor: "#fff", marginTop: 10,  padding: 10 ,borderTopWidth:1 , borderColor:"#b7c1b9" }}>
        </View>
       
          
        </View>


      </DrawerContentScrollView>

      <View style={{ borderTopWidth: 1, borderTopColor: "#ccc", padding: 10 }}>
      
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} style={{ paddingVertical: 15 }}  >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name='exit-outline' size={22} color="#000" />
            <Text style={{ fontSize: 15, marginLeft: 5, fontFamily: 'Roboto-Medium', color: "#000" }}>Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CustomDrawer