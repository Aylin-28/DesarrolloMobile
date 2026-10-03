import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const [limit, setLimit] = useState('20');

  useEffect(() => {
    AsyncStorage.getItem('@pokemon_limit').then((savedLimit) => {
      if (savedLimit) setLimit(savedLimit);
    });
  }, []);

  const saveSetting = async (value) => {
    setLimit(value);
    await AsyncStorage.setItem('@pokemon_limit', value);
    Alert.alert('Configuración guardada', `Límite por página actualizado a ${value}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Pokémon por página actuales:</Text>
        <Text style={styles.currentLimit}>{limit}</Text>
        
        <Text style={styles.subLabel}>Selecciona tu límite preferido:</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={[styles.btn, limit === '10' && styles.activeBtn]} onPress={() => saveSetting('10')}>
            <Text style={[styles.btnText, limit === '10' && styles.activeBtnText]}>10</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, limit === '20' && styles.activeBtn]} onPress={() => saveSetting('20')}>
            <Text style={[styles.btnText, limit === '20' && styles.activeBtnText]}>20</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, limit === '50' && styles.activeBtn]} onPress={() => saveSetting('50')}>
            <Text style={[styles.btnText, limit === '50' && styles.activeBtnText]}>50</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f5f6fa' 
  },
  card: { 
    backgroundColor: '#fff', 
    padding: 25, 
    borderRadius: 16, 
    width: '100%', 
    alignItems: 'center', 
    elevation: 4, 
    borderWidth: 2, 
    borderColor: '#030081' 
  },
  label: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#0C005B', 
    marginBottom: 5 
  },
  currentLimit: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#F1B900', 
    marginBottom: 20 
  },
  subLabel: { 
    fontSize: 14, 
    color: '#718093', 
    marginBottom: 15 
  },
  buttonGroup: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%' 
  },
  btn: { 
    backgroundColor: '#030081', 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: 10, 
    flex: 1, 
    marginHorizontal: 5, 
    alignItems: 'center' 
  },
  activeBtn: { 
    backgroundColor: '#FFD301', 
    borderWidth: 2, 
    borderColor: '#0C005B' 
  },
  btnText: { 
    color: '#FFD301', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  activeBtnText: { 
    color: '#0C005B' 
  }


});