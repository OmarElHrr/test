import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './Navigation/LoginScreen';
import DrawerProfScreen from './Navigation/DrawerScreen/DrawerProfScreen';

const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="LoginScreen" component={LoginScreen}
          options={{
            headerShown: false // Masquer l'en-tête de navigation
          }} />

        <Stack.Screen name="DrawerProfScreen" component={DrawerProfScreen}
          options={{
            headerShown: false // Masquer l'en-tête de navigation
          }} />

  
      </Stack.Navigator>


    </NavigationContainer>

  );
};

export default App