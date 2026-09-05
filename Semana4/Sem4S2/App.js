import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { validateName, validateEmail, validatePassword, getPasswordStrength, validatePhone } from './Validators';
import Validators from './Validators';

export default function App() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    
    let error = '';
    if (field === 'name') error = validateName(value);
    if (field === 'email') error = validateEmail(value);
    if (field === 'password') error = validatePassword(value);
    if (field === 'confirmPassword') {
      error = value !== form.password ? 'Las contraseñas no coinciden.' : '';
    }
    if (field === 'phone') error = validatePhone(value);

    setErrors({ ...errors, [field]: error });
  };

  const handleRegister = () => {
    const nameErr = validateName(form.name);
    const emailErr = validateEmail(form.email);
    const passErr = validatePassword(form.password);
    const confPassErr = form.password !== form.confirmPassword ? 'Las contraseñas no coinciden.' : '';
    const phoneErr = validatePhone(form.phone);

    if (nameErr || emailErr || passErr || confPassErr || phoneErr) {
      setErrors({ name: nameErr, email: emailErr, password: passErr, confirmPassword: confPassErr, phone: phoneErr });
      return;
    }

    Alert.alert('Éxito', 'Registro realizado correctamente');
  };

  const pwdInfo = getPasswordStrength(form.password);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro de Usuario</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Juana Rodriguez"
        value={form.name}
        onChangeText={(val) => handleChange('name', val)}
      />
      {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}

      <Text style={styles.label}>Correo Electrónico</Text>
      <TextInput
        style={styles.input}
        placeholder="correo@ejemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={form.email}
        onChangeText={(val) => handleChange('email', val)}
      />
      {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="La contraseña debe tener letras y números"
        secureTextEntry
        value={form.password}
        onChangeText={(val) => handleChange('password', val)}
      />
      {form.password ? 
        <Text style={{ color: pwdInfo.color, marginTop: 3, fontSize: 12, fontWeight: 'bold' }}>Fortaleza: {pwdInfo.strength}</Text> : null}
      {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

      <Text style={styles.label}>Confirmar Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Repite tu contraseña exactamente igual"
        secureTextEntry
        value={form.confirmPassword}
        onChangeText={(val) => handleChange('confirmPassword', val)}
      />
      {errors.confirmPassword ? <Text style={styles.error}>{errors.confirmPassword}</Text> : null}

      <Text style={styles.label}>Teléfono</Text>
      <TextInput
        style={styles.input}
        placeholder="987654321"
        keyboardType="numeric"
        value={form.phone}
        onChangeText={(val) => handleChange('phone', val)}
      />
      {errors.phone ? <Text style={styles.error}>{errors.phone}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    justifyContent: 'center', 
    backgroundColor: '#fff', 
    flexGrow: 1 
  },
  title: { 
    fontSize: 36, 
    fontWeight: 'bold',
    color: '#076652d2', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  label: { 
    fontWeight: '600', 
    color: '#0a8d71d2', 
    marginTop: 12, 
    marginBottom: 5 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#076652d2', 
    borderRadius: 8, 
    padding: 10, 
    fontSize: 16 
  },
  error: { 
    color: 'red', 
    fontSize: 12, 
    marginTop: 3 
  },
  button: { 
    backgroundColor: '#0ab993d2', 
    padding: 15, 
    borderRadius: 8, 
    marginTop: 25, 
    alignItems: 'center' 
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  }
});

