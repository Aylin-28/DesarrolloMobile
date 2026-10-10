import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';

export default function SettingsScreen({ budget, onUpdateBudget, theme, onToggleTheme }) {
  const isDark = theme === 'dark';
  const [newBudget, setNewBudget] = useState(budget.toString());

  const handleSaveBudget = () => {
    const parsed = parseFloat(newBudget);
    if (isNaN(parsed) || parsed <= 0) {
      Alert.alert('Error', 'Ingrese un presupuesto válido mayor a cero.');
      return;
    }
    onUpdateBudget(parsed);
    Alert.alert('Éxito', 'Presupuesto actualizado correctamente.');
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#4d1127' : '#ffebf1' }]}>
      <Text style={[styles.title, { color: isDark ? '#ffb5c8' : '#ff6699' }]}>Configuración</Text>

      <View style={[styles.card, { backgroundColor: isDark ? '#7a3a4f98' : '#ffffff' }]}>
        <Text style={[styles.label, { color: isDark ? '#ffb5c8' : '#333' }]}>Presupuesto Mensual ($)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: isDark ? '#a66377' : '#ffebf1', borderColor: isDark ? '#d38ca0' : '#ffd7e3', color: isDark ? '#ffffff' : '#333' }]}
          keyboardType="numeric"
          value={newBudget}
          onChangeText={setNewBudget}
          placeholderTextColor={isDark ? '#ffb5c8' : '#888'}
        />
        <TouchableOpacity style={[styles.button, { backgroundColor: isDark ? '#d38ca0' : '#ffaec7' }]} onPress={handleSaveBudget}>
          <Text style={styles.buttonText}>Guardar Presupuesto</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.cardRow, { backgroundColor: isDark ? '#7a3a4f' : '#ffffff' }]}>
        <Text style={[styles.label, { color: isDark ? '#ffb5c8' : '#333' }]}>Modo Oscuro</Text>
        <Switch
          value={isDark}
          onValueChange={(val) => onToggleTheme(val ? 'dark' : 'light')}
          trackColor={{ false: '#ffd7e3', true: '#a66377' }}
          thumbColor={isDark ? '#ffb5c8' : '#f4f3f4'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 16 
  },
  card: { 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 12, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 4, 
    elevation: 2 
  },
  cardRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 12, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 4, 
    elevation: 2 
  },
  label: { 
    fontSize: 15, 
    fontWeight: '600', 
    marginBottom: 8 
  },
  input: { 
    borderWidth: 1, 
    borderRadius: 8, 
    padding: 10, 
    marginBottom: 12, 
    fontSize: 14 
  },
  button: { 
    padding: 12, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  buttonText: { 
    color: '#ffffff', 
    fontWeight: 'bold', 
    fontSize: 14 
  },
});