import * as React from 'react';
import LoginScreen from './LoginScreen';
import NoterScreen from './NoterScreen';
import VoirScreen from './VoirScreen';
import WelcomeScreen from './WelcomeScreen';
import ProfileScreen from './ProfileScreen';
import ClasseScreen  from './ClasseScreen';
import StatistiqueScreen from './StatistiqueScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BASE_URL from './config.js';


const Stack = createNativeStackNavigator();

export default function ProfStack({route}) {
  return (
        <Stack.Navigator>
         <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} initialParams={route.params} options={{
           headerShown: true ,
           // Masquer l'en-tête de navigation
           headerTitleStyle: {
            marginLeft: 16,
          },
          headerStyle: {
            backgroundColor: '#f77f',
          },
          headerShown: false // Masquer l'en-tête de navigation
        }} />
         <Stack.Screen name="NoterScreen" component={NoterScreen}  options={{ headerShown: false }} />
         <Stack.Screen name="VoirScreen" component={VoirScreen} options={{ headerShown: false }}/>
         <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }}/>
         <Stack.Screen name="ClasseScreen" component={ClasseScreen} options={{ headerShown: false }}/>
         <Stack.Screen name="StatistiqueScreen" component={StatistiqueScreen} options={{ headerShown: false }}/>
       </Stack.Navigator>
  );
}