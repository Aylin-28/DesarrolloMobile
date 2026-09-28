import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UserScreen from './screens/UserScreen';
import PostScreen from './screens/PostScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#663399',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Usuarios" 
          component={UserScreen} 
          options={{ title: 'Lista de Usuarios' }} 
        />
        <Stack.Screen 
          name="Posts" 
          component={PostScreen} 
          options={{ title: 'Publicaciones del Usuario' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}