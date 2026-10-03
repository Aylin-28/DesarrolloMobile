import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, TouchableOpacity, Text } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#1513afe3' }, 
          headerTintColor: '#FFD301', 
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={({ navigation }) => ({
            title: 'PokéDex Lite',
            headerRight: () => (
              <TouchableOpacity 
                onPress={() => navigation.navigate('Settings')}
                style={{ marginRight: 10, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#F1B900', borderRadius: 8 }}
              >
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#0C005B' }}>Config</Text>
              </TouchableOpacity>
            ),
          })} 
        />
        <Stack.Screen 
          name="DetallePokemon" 
          component={DetailScreen} 
          options={{ title: 'Detalle del Pokémon' }} 
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ title: 'Configuración' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}