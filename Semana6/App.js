import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TextInput, View, Text, Button, Alert } from 'react-native';
import React, { useState, useEffect } from "react";

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  
  const [loggedUser, setLoggedUser] = useState("");

  const handleLogin = () => {
    if (username.trim() === "") {
      Alert.alert("Error", "Por favor ingresa un usuario");
      return;
    }
    setLoggedUser(username);
    Alert.alert("Bienvenido " + username);
    setSubmitted(true);
  };

  useEffect(() => {
    if (submitted) {
      setUsername("");
      setPassword("");
      setSubmitted(false);
    }
  }, [submitted]);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Text style={styles.title}>Inicia Sesión</Text>
      {loggedUser !== "" && (
        <Text style={styles.welcomeText}>¡Bienvenido, {loggedUser}!</Text>
      )}

      <TextInput
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <Button title="Iniciar sesión" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    padding: 20,
    backgroundColor: "#d8d7fc70",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1b38b6b2",
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "780",
    color: "#5161f0",
    marginBottom: 15,
  },
  input: {
    borderWidth: 2, 
    borderColor: "#2417e048",
    backgroundColor: "#6d7af01a",
    marginBottom: 15, 
    padding: 12, 
    width: "80%",
    borderRadius: 8,
  },
});