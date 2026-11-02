import React, { useEffect, useState, useRef } from 'react';
import { View,  Text, TouchableOpacity, StyleSheet, Alert, Linking, ScrollView, AppState } from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [cam, setCam] = useState(null);
  const [mic, setMic] = useState(null);
  const [gps, setGps] = useState(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);
  
  const appState = useRef(AppState.currentState);

  const verificar = async () => {
    try {
      const camPerm = await Camera.getCameraPermissionsAsync();
      const micPerm = await Camera.getMicrophonePermissionsAsync();
      const gpsPerm = await Location.getForegroundPermissionsAsync();

      setCam(camPerm);
      setMic(micPerm);
      setGps(gpsPerm);

      const ahora = new Date();
      setUltimaActualizacion(ahora.toLocaleTimeString() + ' - ' + ahora.toLocaleDateString());
    } catch (e) {
      Alert.alert('Error', 'No se pudieron consultar los permisos');
    }
  };

  useEffect(() => {
    verificar();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        verificar(); 
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const pedirCamara = async () => {
    try {
      const r = await Camera.requestCameraPermissionsAsync();
      setCam(r);
      verificar();
    } catch (e) { Alert.alert('Error', 'Fallo al pedir cámara'); }
  };

  const pedirMicrofono = async () => {
    try {
      const r = await Camera.requestMicrophonePermissionsAsync();
      setMic(r);
      verificar();
    } catch (e) { Alert.alert('Error', 'Fallo al pedir micrófono'); }
  };

  const pedirUbicacion = async () => {
    try {
      const r = await Location.requestForegroundPermissionsAsync();
      setGps(r);
      verificar();
    } catch (e) { Alert.alert('Error', 'Fallo al pedir ubicación'); }
  };

  const obtenerBadgeEstado = (r) => {
    if (!r) return { 
      texto: 'No consultado', 
      color: '#64748b', 
      bg: '#f1f5f9' 
    };
    if (r.status === 'granted') return { 
      texto: 'Concedido',
      color: '#16a34a', 
      bg: '#dcfce7' 
    };
    if (r.status === 'denied') return { 
      texto: 'Denegado', 
      color: '#dc2626', 
      bg: '#fee2e2' 
    };
    return { 
      texto: 'No determinado', 
      color: '#ca8a04', 
      bg: '#fef9c3' 
    };
  };

  const totalPermisos = 3;
  const concedidosCount = [cam, mic, gps].filter(p => p?.status === 'granted').length;

  const bloqueadoGeneral = 
    (cam?.status === 'denied' && !cam.canAskAgain) ||
    (mic?.status === 'denied' && !mic.canAskAgain) ||
    (gps?.status === 'denied' && !gps.canAskAgain);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gestión de Permisos</Text>

      <View style={styles.globalIndicator}>
        <Text style={styles.globalText}>
          {concedidosCount} de {totalPermisos} permisos concedidos
        </Text>
      </View>

      {ultimaActualizacion && (
        <Text style={styles.noteText}>Última consulta: {ultimaActualizacion}</Text>
      )}

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Cámara</Text>
        <Text style={styles.explanation}>
          Necesitamos acceso a la cámara para que puedas tomar fotografías dentro de la aplicación.
        </Text>
        <View style={styles.rowStatus}>
          <Text style={styles.label}>Estado:</Text>
          <View style={[styles.badge, { backgroundColor: obtenerBadgeEstado(cam).bg }]}>
            <Text style={[styles.badgeText, { color: obtenerBadgeEstado(cam).color }]}>
              {obtenerBadgeEstado(cam).texto}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={pedirCamara}>
          <Text style={styles.buttonText}>Solicitar Cámara</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Micrófono</Text>
        <Text style={styles.explanation}>
          Utilizamos el micrófono para capturar notas de voz y audio integrado en tus videos.
        </Text>
        <View style={styles.rowStatus}>
          <Text style={styles.label}>Estado:</Text>
          <View style={[styles.badge, { backgroundColor: obtenerBadgeEstado(mic).bg }]}>
            <Text style={[styles.badgeText, { color: obtenerBadgeEstado(mic).color }]}>
              {obtenerBadgeEstado(mic).texto}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={pedirMicrofono}>
          <Text style={styles.buttonText}>Solicitar Micrófono</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Ubicación</Text>
        <Text style={styles.explanation}>
          Requerimos tu ubicación GPS para mostrarte puntos de interés cercanos a tu posición actual.
        </Text>
        <View style={styles.rowStatus}>
          <Text style={styles.label}>Estado:</Text>
          <View style={[styles.badge, { backgroundColor: obtenerBadgeEstado(gps).bg }]}>
            <Text style={[styles.badgeText, { color: obtenerBadgeEstado(gps).color }]}>
              {obtenerBadgeEstado(gps).texto}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={pedirUbicacion}>
          <Text style={styles.buttonText}>Solicitar Ubicación</Text>
        </TouchableOpacity>
      </View>

      {bloqueadoGeneral && (
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>
            Uno o más permisos han sido denegados de forma permanente. Por favor, cámbialos manualmente en los ajustes de tu dispositivo.
          </Text>
          <TouchableOpacity 
            style={[styles.button, styles.settingsButton]} 
            onPress={() => Linking.openSettings()}
          >
            <Text style={styles.buttonText}>Abrir Ajustes</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={[styles.button, styles.verifyButton]} onPress={verificar}>
        <Text style={styles.verifyButtonText}>Verificar nuevamente</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    padding: 20, 
    backgroundColor: '#f4e1e6',
    paddingTop: 50
  },
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    color: '#4a3b4c', 
    textAlign: 'center'
  },
  globalIndicator: {
    backgroundColor: '#d2a8d6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10
  },
  globalText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16
  },
  noteText: {
    textAlign: 'center',
    color: '#7a637c',
    fontSize: 13,
    marginBottom: 20
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f6c6d7'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4a3b4c',
    marginBottom: 6
  },
  explanation: {
    fontSize: 14,
    color: '#6b576e',
    marginBottom: 12,
    lineHeight: 20
  },
  rowStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  label: { 
    fontSize: 15, 
    fontWeight: '500',
    color: '#4a3b4c',
    marginRight: 10
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600'
  },
  button: {
    backgroundColor: '#f7a1b2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: '#4a3b4c', 
    fontWeight: '600',
    fontSize: 15
  },
  alertBox: {
    backgroundColor: '#fff0f3',
    borderWidth: 1,
    borderColor: '#f7a1b2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20
  },
  alertText: {
    color: '#8c3a4d',
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20
  },
  settingsButton: {
    backgroundColor: '#e3c8e4' 
  },
  verifyButton: {
    backgroundColor: '#d2a8d6',
    marginBottom: 30
  },
  verifyButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15
  }
});