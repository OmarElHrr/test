import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomDrawer from '../CustomDrawer';
import ProfStack from '../ProfStack';

const Drawer = createDrawerNavigator();

function DrawerProfScreen({ route }) {
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} route={route} /> }   
    screenOptions = {{
      headerShown : false ,
      drawerLabelStyle  :{ 
        marginLeft : -20 ,
        fontSize : 15
      },
      drawerActiveBackgroundColor : ' rgba(1, 132, 249, 0.8)',
      drawerActiveTintColor : "#fff",
      drawerInactiveTintColor : "#333"
      }}>
     
     <Drawer.Screen name="Accueil" component={ProfStack}  initialParams={route.params} options ={{
        drawerIcon : ({color})=> <Ionicons name='home-outline' size={22} color ={color} />  }} /> 

     </Drawer.Navigator>

  )
}

export default DrawerProfScreen