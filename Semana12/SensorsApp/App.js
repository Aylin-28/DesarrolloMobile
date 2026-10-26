import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Vibration } from 'react-native';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  
  const [shakeAlert, setShakeAlert] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => {
    let locationSubscription = null;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso denegado para acceder al GPS');
        return;
      }

      let current = await Location.getCurrentPositionAsync({});
      setLocation(current.coords);
      actualizarTimestamp();

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000, 
          distanceInterval: 1, 
        },
        (newLocation) => {
          setLocation(newLocation.coords);
          actualizarTimestamp();
        }
      );
    })();

    const accelSubscription = Accelerometer.addListener(accelerometerData => {
      setData(accelerometerData);
      
      const { x, y } = accelerometerData;
      if (Math.abs(x) > 1.5 || Math.abs(y) > 1.5) {
        setShakeAlert(true);
      } else {
        setShakeAlert(false);
      }
    });

    Accelerometer.setUpdateInterval(500);

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
      accelSubscription && accelSubscription.remove();
    };
  }, []);

  const actualizarTimestamp = () => {
    const now = new Date();
    setLastUpdate(now.toLocaleTimeString());
  };

  const velocidadMs = location && location.speed !== null && location.speed >= 0 
    ? location.speed.toFixed(2) 
    : '0.00';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensores del Dispositivo</Text>

      {shakeAlert && (
        <View style={styles.alertBox}>
          <Text style={styles.alertText}> ¡MOVIMIENTO BRUSCO DETECTADO! </Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Posición GPS</Text>
        {errorMsg ? (
          <Text style={styles.error}>{errorMsg}</Text>
        ) : location ? (
          <>
            <Text style={styles.text}>Latitud: {location.latitude.toFixed(4)}</Text>
            <Text style={styles.text}>Longitud: {location.longitude.toFixed(4)}</Text>
            <Text style={styles.text}>Velocidad: {velocidadMs} m/s</Text>
          </>
        ) : (
          <Text style={styles.text}>Obteniendo ubicación...</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acelerómetro</Text>
        <Text style={styles.text}>
          X: {data.x.toFixed(2)} | Y: {data.y.toFixed(2)} | Z: {data.z.toFixed(2)}
        </Text>
      </View>
      <Text style={styles.timestamp}>Última lectura: {lastUpdate || 'Cargando...'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },

  section: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#007AFF',
  },

  text: {
    fontSize: 15,
    marginVertical: 3,
    color: '#444',
  },

  alertBox: {
    backgroundColor: '#ff3b30',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },

  alertText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  error: {
    color: 'red',
    marginTop: 5,
  },

  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 10,
  },
  
});