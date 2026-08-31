import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

export default function App() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState(''); 

  const manejarRegistro = () => {
    if (nombre.trim() === '' || correo.trim() === '') {
      setMensaje('Por favor, complete todos los campos.');
      setTipoMensaje('error');
      return;
    }

    if (!correo.includes('@')) {
      setMensaje('Por favor, ingrese un correo válido.');
      setTipoMensaje('error');
      return;
    }

    setMensaje(`¡Registro exitoso, ${nombre}! Te enviaremos información a ${correo}.`);
    setTipoMensaje('exito');
    
    setNombre('');
    setCorreo('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>

          <Text style={styles.titulo}>Portal de Registro</Text>
          <Text style={styles.subtitulo}>Laboratorio - Semana 04 - eventos y estados</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Sophia Luciana Perez Rodriguez"
              placeholderTextColor="#999"
              value={nombre}
              onChangeText={setNombre}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. sophia@correo.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={correo}
              onChangeText={setCorreo}
            />
          </View>

          <View style={styles.buttonWrapper}>
            <Button 
              title="Registrarse" 
              onPress={manejarRegistro} 
              color="#4D4DFF" 
            />
          </View>

          <TouchableOpacity 
            style={styles.botonSecundario} 
            onPress={() => {
              setMensaje('Acción cancelada. Formulario reiniciado.');
              setTipoMensaje('info');
              setNombre('');
              setCorreo('');
            }}
          >
            <Text style={styles.textoBotonSecundario}>Limpiar Formulario</Text>
          </TouchableOpacity>

          {mensaje !== '' && (
            <View style={[
              styles.resultadoBox, 
              tipoMensaje === 'error' ? styles.errorBox : 
              tipoMensaje === 'exito' ? styles.exitoBox : styles.infoBox
            ]}>
              <Text style={styles.resultadoTexto}>{mensaje}</Text>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '##E6E6FF',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0000A3',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#0000A3',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  buttonWrapper: {
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  botonSecundario: {
    marginTop: 12,
    backgroundColor: '#B8B8FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotonSecundario: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  resultadoBox: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  exitoBox: {
    backgroundColor: '#DEF7EC',
    borderColor: '#31C48D',
    borderWidth: 1,
  },
  errorBox: {
    backgroundColor: '#FDE8E8',
    borderColor: '#F8B4B4',
    borderWidth: 1,
  },
  infoBox: {
    backgroundColor: '#E1EFFE',
    borderColor: '#BBE5FB',
    borderWidth: 1,
  },
  resultadoTexto: {
    fontSize: 15,
    textAlign: 'center',
    color: '#1F2937',
    fontWeight: '500',
  },
});