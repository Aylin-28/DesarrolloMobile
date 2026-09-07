import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import HomeTab from './HomeTab';

function LoginScreen({ navigation }) {
  return (
    <View style={styles.loginContainer}>
      <View style={styles.loginCard}>
        <Ionicons name="lock-closed-outline" size={60} color="#8A2BE2" style={{ marginBottom: 15 }} />
        <Text style={styles.loginTitle}>Bienvenido</Text>
        <Text style={styles.loginSubtitle}>Inicia sesión para continuar</Text>
        
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={() => navigation.replace('Home')}
        >
          <Text style={styles.primaryButtonText}>Ingresar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Pantalla Perfil con botón funcional de cerrar sesión
function PerfilScreen({ navigation }) {
  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres salir?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Salir", 
          style: "destructive",
          onPress: () => {
            navigation.replace('Login'); // Vuelve al login limpiando el stack
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.screenContainer}>
      <Ionicons name="person-circle-outline" size={80} color="#8A2BE2" style={{ marginBottom: 15 }} />
      <Text style={styles.title}>Perfil de Usuario</Text>
      <Text style={styles.subtitle}>usuario@correo.com</Text>

      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.primaryButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

function ConfiguracionScreen() {
  return (
    <View style={styles.screenContainer}>
      <Ionicons name="settings-outline" size={80} color="#9370DB" style={{ marginBottom: 15 }} />
      <Text style={styles.title}>Configuración</Text>
    </View>
  );
}

const Drawer = createDrawerNavigator();

function DrawerMenu() {
  return (
    <Drawer.Navigator screenOptions={{ headerStyle: { backgroundColor: '#8A2BE2' }, headerTintColor: '#fff' }}>
      <Drawer.Screen name="Inicio" component={HomeTab} options={{ headerShown: false }} />
      <Drawer.Screen name="Perfil" component={PerfilScreen} />
      <Drawer.Screen name="Configuración" component={ConfiguracionScreen} />
    </Drawer.Navigator>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={DrawerMenu} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3e8ff',
  },
  loginCard: {
    width: '85%',
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
  },
  loginTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 5,
  },
  loginSubtitle: {
    fontSize: 14,
    color: '#7b68ee',
    marginBottom: 25,
  },
  primaryButton: {
    backgroundColor: '#8A2BE2',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#d9534f',
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 3,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f5ff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#7b68ee',
    marginBottom: 15,
  },
});