import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const getDistance = (c1, c2) => {
  const R = 6371e3; 
  const dLat = ((c2.latitude - c1.latitude) * Math.PI) / 180;
  const dLon = ((c2.longitude - c1.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((c1.latitude * Math.PI) / 180) *
      Math.cos((c2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

export default function App() {

  const [location, setLocation] = useState(null);
  const [savedLocation, setSavedLocation] = useState(null);
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);

  const [accelData, setAccelData] = useState({ x: 0, y: 0, z: 0 });
  const [steps, setSteps] = useState(0);
  const lastAccelMagnitude = useRef(0);

  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    let locationSubscription = null;
    let accelSubscription = null;

    const initApp = async () => {
      try {
        const stored = await AsyncStorage.getItem('lastLocation');
        if (stored) {
          setSavedLocation(JSON.parse(stored));
        }

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso denegado', 'Se requiere permiso de ubicación para usar el rastreador.');
          return;
        }

        let initialLoc = await Location.getCurrentPositionAsync({});
        const initialCoords = initialLoc.coords;
        setLocation(initialCoords);

        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 3000,
            distanceInterval: 5,
          },
          async (newLoc) => {
            const newCoords = newLoc.coords;
            setLocation((prevLoc) => {
              if (prevLoc) {
                const distIncrement = getDistance(prevLoc, newCoords);
                if (distIncrement > 2) {
                  setDistance((prevDist) => prevDist + distIncrement);
                }
              }
              return newCoords;
            });

            if (newCoords.speed !== null && newCoords.speed >= 0) {
              setSpeed((newCoords.speed * 3.6).toFixed(1));
            }

            await AsyncStorage.setItem('lastLocation', JSON.stringify(newCoords));
          }
        );

        Accelerometer.setUpdateInterval(500);
        accelSubscription = Accelerometer.addListener((accel) => {
          setAccelData(accel);
          const magnitude = Math.sqrt(accel.x ** 2 + accel.y ** 2 + accel.z ** 2);
          const threshold = 1.25;
          if (magnitude > threshold && lastAccelMagnitude.current <= threshold) {
            setSteps((s) => s + 1);
          }
          lastAccelMagnitude.current = magnitude;
        });

      } catch (error) {
        console.error('Error al inicializar la app:', error);
      }
    };

    initApp();

    return () => {
      if (locationSubscription) locationSubscription.remove();
      if (accelSubscription) accelSubscription.remove();
    };
  }, []);

  const handleReset = () => {
    setDistance(0);
    setSteps(0);
    setSpeed(0);
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permiso requerido", "Se necesita acceso a la cámara para tomar fotos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>FitnessTracker UTP (Modo Web)</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{(distance / 1000).toFixed(2)}</Text>
          <Text style={styles.statLabel}>Distancia (km)</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{steps}</Text>
          <Text style={styles.statLabel}>Pasos</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{speed}</Text>
          <Text style={styles.statLabel}>Velocidad (km/h)</Text>
        </View>
      </View>

      <View style={styles.mapContainer}>
        <Text style={styles.mapTitle}>Simulación de Mapa (No disponible en Web)</Text>
        {location ? (
          <View style={styles.coordBox}>
            <Text style={styles.text}>Latitud: {location.latitude.toFixed(6)}</Text>
            <Text style={styles.text}>Longitud: {location.longitude.toFixed(6)}</Text>
          </View>
        ) : (
          <Text style={styles.loadingText}>Obteniendo señal GPS...</Text>
        )}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Datos del Acelerómetro</Text>
        <Text style={styles.text}>X: {accelData.x.toFixed(2)} | Y: {accelData.y.toFixed(2)} | Z: {accelData.z.toFixed(2)}</Text>
        
        {savedLocation && (
          <Text style={styles.savedText}>
            Última posición cargada de AsyncStorage: ({savedLocation.latitude.toFixed(4)}, {savedLocation.longitude.toFixed(4)})
          </Text>
        )}
      </View>

      <View style={styles.photoSection}>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>{imageUri ? "Volver a tomar foto" : "Tomar foto de ruta"}</Text>
        </TouchableOpacity>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}
      </View>

      <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
        <Text style={styles.buttonText}>Reiniciar Recorrido</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f4e1e6', 
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#5a3d5c', 
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d2a8d6', 
  },
  statLabel: {
    fontSize: 12,
    color: '#8c7390', 
    marginTop: 4,
  },
  mapContainer: {
    height: 180,
    backgroundColor: '#f6c6d7', 
    borderRadius: 12,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  mapTitle: {
    fontWeight: 'bold',
    color: '#5a3d5c',
    marginBottom: 10,
    textAlign: 'center',
  },
  coordBox: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  loadingText: {
    color: '#5a3d5c',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#5a3d5c',
  },
  text: {
    fontSize: 14,
    color: '#6e5573',
  },
  savedText: {
    fontSize: 12,
    color: '#82b366', 
    marginTop: 8,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#f7a1b2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  resetButton: {
    backgroundColor: '#e3c8e4',
    marginBottom: 30,
  },
  buttonText: {
    color: '#5a3d5c',
    fontWeight: 'bold',
    fontSize: 16,
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginTop: 10,
  },
});