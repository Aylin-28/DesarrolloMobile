import React, { useRef, useState, useEffect } from "react";
import { 
  View, Text, Button, Image, Alert, StyleSheet, 
  SafeAreaView, TextInput, ScrollView, TouchableOpacity 
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

const STORAGE_KEY = '@evidencias_fotos_utp';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [facing, setFacing] = useState('back');
  const [flash, setFlash] = useState('off');
  const [step, setStep] = useState('camera');
  const [tempPhoto, setTempPhoto] = useState(null);
  const [description, setDescription] = useState('');
  const [gallery, setGallery] = useState([]);
  const [busy, setBusy] = useState(false);


  useEffect(() => {
    loadStoredGallery();
  }, []);

  const loadStoredGallery = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setGallery(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error al cargar la galería", e);
    }
  };

  const toggleFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(current => (current === 'off' ? 'on' : 'off'));
  };

  const takePhoto = async () => {
    if (!cameraRef.current || busy) return;
    setBusy(true);
    try {
      const result = await cameraRef.current.takePictureAsync();
      if (result?.uri) {
        setTempPhoto(result.uri);
        setDescription('');
        setStep('confirm');
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo capturar la fotografía.");
    } finally {
      setBusy(false);
    }
  };

  const acceptPhoto = async () => {
    if (!tempPhoto) return;
    try {
      const filename = `evidencia_${Date.now()}.jpg`;
      const newPath = `${FileSystem.documentDirectory}${filename}`;
      const base64Data = await FileSystem.readAsStringAsync(tempPhoto, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await FileSystem.writeAsStringAsync(newPath, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const newEvidencia = {
        id: Date.now().toString(),
        uri: newPath,
        date: new Date().toLocaleString(),
        description: description.trim() || 'Sin descripción'
      };

      const updatedGallery = [newEvidencia, ...gallery];
      setGallery(updatedGallery);
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGallery));

      setTempPhoto(null);
      setDescription('');
      setStep('camera');
      Alert.alert("Éxito", "Evidencia guardada y persistida correctamente.");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudo guardar la imagen de forma permanente.");
    }
  };

  const discardPhoto = () => {
    setTempPhoto(null);
    setDescription('');
    setStep('camera');
  };

  if (!permission) {
    return (
      <View style={[styles.center, styles.container]}>
        <Text style={styles.textWhite}>Comprobando permisos...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.center, styles.container]}>
        <Text style={[styles.textWhite, styles.centerText]}>
          Se necesita permiso para utilizar la cámara en EvidenciaFoto UTP.
        </Text>
        <Button title="Conceder Permiso" onPress={requestPermission} />
      </View>
    );
  }

  if (step === 'confirm') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.confirmContainer}>
          <Text style={styles.title}>Confirmar Evidencia</Text>
          <Image source={{ uri: tempPhoto }} style={styles.confirmImage} resizeMode="contain" />
          
          <Text style={styles.label}>Descripción de la actividad:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. Inspección de entrega en almacén principal..."
            placeholderTextColor="#888"
            value={description}
            onChangeText={setDescription}
          />

          <View style={styles.rowButtons}>
            <TouchableOpacity style={[styles.btn, styles.btnDanger]} onPress={discardPhoto}>
              <Text style={styles.btnText}>Descartar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnSuccess]} onPress={acceptPhoto}>
              <Text style={styles.btnText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (step === 'gallery') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerGallery}>
          <Text style={styles.title}>Últimas Evidencias</Text>
          <Button title="Volver a Cámara" onPress={() => setStep('camera')} />
        </View>
        <ScrollView contentContainerStyle={styles.galleryContainer}>
          {gallery.length === 0 ? (
            <Text style={styles.textWhite}>No hay evidencias guardadas aún.</Text>
          ) : (
            gallery.slice(0, 3).map((item) => (
              <View key={item.id} style={styles.galleryCard}>
                <Image source={{ uri: item.uri }} style={styles.galleryImage} />
                <Text style={styles.galleryDate}>🕒 {item.date}</Text>
                <Text style={styles.galleryDesc}>📝 {item.description}</Text>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraView 
        style={styles.preview} 
        ref={cameraRef} 
        facing={facing} 
        flash={flash}
      >
        <View style={styles.topToolbar}>
          <TouchableOpacity style={styles.toolButton} onPress={toggleFlash}>
            <Text style={styles.toolButtonText}>⚡ Flash: {flash.toUpperCase()}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolButton} onPress={toggleFacing}>
            <Text style={styles.toolButtonText}>🔄 Cámara: {facing.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      <View style={styles.controls}>
        <Button 
          title={busy ? "Capturando..." : "Capturar Evidencia"} 
          onPress={takePhoto} 
          disabled={busy}
          color="#28a745"
        />
        <View style={{ marginTop: 12 }}>
          <Button 
            title={`Ver Galería (${gallery.length})`} 
            onPress={() => setStep('gallery')} 
            color="#007AFF"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#111" 
  },
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 24 
  },
  preview: { 
    flex: 1 
  },
  topToolbar: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 20, 
    marginTop: 10 
  },
  toolButton: { 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderRadius: 8 
  },
  toolButtonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 13 
  },
  controls: { 
    padding: 20, 
    backgroundColor: "#fff" 
  },
  confirmContainer: { 
    padding: 20, 
    alignItems: 'center' 
  },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginBottom: 15, 
    textAlign: 'center' 
  },
  confirmImage: { 
    width: '100%', 
    height: 320, 
    borderRadius: 10, 
    marginBottom: 15 
  },
  label: { 
    color: '#fff', 
    alignSelf: 'flex-start', 
    marginBottom: 5, 
    fontSize: 15 
  },
  input: { 
    width: '100%', 
    backgroundColor: '#222', 
    color: '#fff', 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: '#444' 
  },
  rowButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%' 
  },
  btn: { 
    flex: 1, 
    padding: 14, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginHorizontal: 5 
  },
  btnDanger: { 
    backgroundColor: '#dc3545' 
  },
  btnSuccess: { 
    backgroundColor: '#28a745' 
  },
  btnText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  headerGallery: { 
    padding: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  galleryContainer: { 
    padding: 20, 
    alignItems: 'center' 
  },
  galleryCard: { 
    backgroundColor: '#222', 
    borderRadius: 10, 
    padding: 12, 
    marginBottom: 20, 
    width: '100%', 
    borderWidth: 1, 
    borderColor: '#444' 
  },
  galleryImage: { 
    width: '100%', 
    height: 180, 
    borderRadius: 8, 
    marginBottom: 8 
  },
  galleryDate: { 
    color: '#aaa', 
    fontSize: 12, 
    marginBottom: 4 
  },
  galleryDesc: { 
    color: '#fff', 
    fontSize: 14, 
    fontWeight: '500' 
  },
  textWhite: { 
    color: "#fff", 
    fontSize: 16, 
    textAlign: "center" 
  },
  centerText: { 
    textAlign: "center", 
    marginBottom: 16 
  }
});