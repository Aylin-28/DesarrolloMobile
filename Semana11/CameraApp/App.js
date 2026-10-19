import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, FlatList, Modal, TouchableOpacity } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [history, setHistory] = useState([]);
  const [sessionCount, setSessionCount] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [tempPhoto, setTempPhoto] = useState(null);
  const [type, setType] = useState('back');
  
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');

      const savedHistory = await AsyncStorage.getItem('photoHistory');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed);
        if (parsed.length > 0) setPhoto(parsed[0]);
      }
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const data = await cameraRef.current.takePictureAsync();
      setTempPhoto(data.uri);
      setPreviewVisible(true);
    }
  };

  const savePicture = async () => {
    const updatedHistory = [tempPhoto, ...history].slice(0, 3);
    setHistory(updatedHistory);
    setPhoto(tempPhoto);
    setSessionCount(sessionCount + 1);

    await AsyncStorage.setItem('photoHistory', JSON.stringify(updatedHistory));
    setPreviewVisible(false);
    setTempPhoto(null);
  };

  const toggleCameraType = () => {
    setType(current => (current === 'back' ? 'front' : 'back'));
  };

  if (hasPermission === null) return <Text style={styles.center}>Solicitando permiso...</Text>;
  if (hasPermission === false) return <Text style={styles.center}>Permission denied</Text>;

  return (
    <View style={styles.container}>
      {!photo ? (
        <Camera style={styles.camera} type={type} ref={cameraRef}>
          <View style={styles.overlay}>
            <Text style={styles.counterText}>Fotos en sesión: {sessionCount}</Text>
          </View>
        </Camera>
      ) : (
        <Image source={{ uri: photo }} style={styles.camera} />
      )}

      <View style={styles.buttonContainer}>
        <Button title="Cambiar Cámara" onPress={toggleCameraType} />
        <Button title="Tomar Foto" onPress={takePicture} color="#28a745" />
      </View>

      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Últimas fotos:</Text>
        <FlatList
          horizontal
          data={history}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setPhoto(item)}>
              <Image source={{ uri: item }} style={styles.thumbnail} />
            </TouchableOpacity>
          )}
        />
      </View>

      <Modal visible={previewVisible} transparent={false}>
        <View style={styles.modalContainer}>
          {tempPhoto && <Image source={{ uri: tempPhoto }} style={styles.previewImage} />}
          <View style={styles.modalButtons}>
            <Button title="Descartar" color="red" onPress={() => setPreviewVisible(false)} />
            <Button title="Guardar" onPress={savePicture} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  camera: { 
    flex: 3 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  overlay: { 
    padding: 20, 
    backgroundColor: 'rgba(0,0,0,0.3)' 
  },
  counterText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  buttonContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    padding: 10, 
    backgroundColor: '#222' 
  },
  historyContainer: { 
    flex: 1, 
    padding: 10, 
    backgroundColor: '#111' 
  },
  historyTitle: { 
    color: '#fff', 
    marginBottom: 5, 
    fontWeight: 'bold' 
  },
  thumbnail: { 
    width: 60, 
    height: 60, 
    marginRight: 10, 
    borderRadius: 5 
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#000' 
  },
  previewImage: { 
    width: '90%H', 
    height: '70%', 
    resizeMode: 'contain' 
  },
  modalButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    width: '80%', 
    marginTop: 20 
  }
});