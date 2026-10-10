import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import MovementRow from '../components/MovementRow';

export default function MovementsScreen({ movements, onAddMovement, onDeleteMovement, onUndoDelete, lastDeleted, theme }) {
  const isDark = theme === 'dark';
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Alimentos');
  const [search, setSearch] = useState('');

  const handleAdd = () => {
    if (!description.trim()) {
      Alert.alert('Error', 'La descripción no puede estar vacía.');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Ingrese un monto numérico mayor a cero.');
      return;
    }

    onAddMovement({
      id: Date.now().toString(),
      type,
      description: description.trim(),
      amount: numAmount,
      category,
      createdAt: new Date().toISOString(),
    });

    setDescription('');
    setAmount('');
  };

  const confirmDelete = (id) => {
    Alert.alert('Eliminar movimiento', '¿Estás seguro de eliminar este registro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => onDeleteMovement(id) },
    ]);
  };

  const filteredMovements = movements.filter((item) => {
    return item.description.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#855064' : '#ffebf1' }]}>
      <Text style={[styles.title, { color: isDark ? '#ffb5c8' : '#ff6699' }]}>Gestión de Movimientos</Text>

      <View style={[styles.formCard, { backgroundColor: isDark ? '#7a3a4f' : '#ffffff' }]}>
        <View style={[styles.typeSelector, { borderColor: isDark ? '#a66377' : '#ffd7e3' }]}>
          <TouchableOpacity
            style={[styles.typeButton, { backgroundColor: isDark ? '#a66377' : '#ffebf1' }, type === 'income' && styles.activeIncome]}
            onPress={() => setType('income')}
          >
            <Text style={[styles.typeText, { color: isDark ? '#ffb5c8' : '#555' }, type === 'income' && styles.activeText]}>Ingreso</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, { backgroundColor: isDark ? '#a66377' : '#ffebf1' }, type === 'expense' && styles.activeExpense]}
            onPress={() => setType('expense')}
          >
            <Text style={[styles.typeText, { color: isDark ? '#ffb5c8' : '#555' }, type === 'expense' && styles.activeText]}>Gasto</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={[styles.input, { backgroundColor: isDark ? '#a66377' : '#ffebf1', borderColor: isDark ? '#d38ca0' : '#ffd7e3', color: isDark ? '#ffffff' : '#333' }]}
          placeholder="Descripción (ej. Almuerzo UTP)"
          placeholderTextColor={isDark ? '#ffb5c8' : '#888'}
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={[styles.input, { backgroundColor: isDark ? '#a66377' : '#ffebf1', borderColor: isDark ? '#d38ca0' : '#ffd7e3', color: isDark ? '#ffffff' : '#333' }]}
          placeholder="Monto ($)"
          placeholderTextColor={isDark ? '#ffb5c8' : '#888'}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <TextInput
          style={[styles.input, { backgroundColor: isDark ? '#a66377' : '#ffebf1', borderColor: isDark ? '#d38ca0' : '#ffd7e3', color: isDark ? '#ffffff' : '#333' }]}
          placeholder="Categoría (ej. Alimentos, Transporte)"
          placeholderTextColor={isDark ? '#ffb5c8' : '#888'}
          value={category}
          onChangeText={setCategory}
        />

        <TouchableOpacity style={[styles.addButton, { backgroundColor: isDark ? '#d38ca0' : '#ffaec7' }]} onPress={handleAdd}>
          <Text style={styles.addButtonText}>Registrar Operación</Text>
        </TouchableOpacity>
      </View>

      {lastDeleted && (
        <View style={styles.undoContainer}>
          <Text style={styles.undoText}>Movimiento eliminado.</Text>
          <TouchableOpacity onPress={onUndoDelete}>
            <Text style={styles.undoButtonText}>Deshacer</Text>
          </TouchableOpacity>
        </View>
      )}

      <TextInput
        style={[styles.searchInput, { backgroundColor: isDark ? '#7a3a4f' : '#ffffff', borderColor: isDark ? '#a66377' : '#ffd7e3', color: isDark ? '#ffffff' : '#333' }]}
        placeholder="Buscar por descripción..."
        placeholderTextColor={isDark ? '#ffb5c8' : '#888'}
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredMovements}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MovementRow item={item} onDelete={confirmDelete} theme={theme} />}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={[styles.empty, { color: isDark ? '#d38ca0' : '#888' }]}>No hay movimientos registrados.</Text>}
      />
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
    marginBottom: 12 
  },
  formCard: { 
    padding: 14, 
    borderRadius: 12, 
    marginBottom: 12, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 4, 
    elevation: 2 
  },
  typeSelector: { 
    flexDirection: 'row', 
    marginBottom: 10, 
    borderRadius: 8, 
    overflow: 'hidden', 
    borderWidth: 1 
  },
  typeButton: { 
    flex: 1, 
    paddingVertical: 8, 
    alignItems: 'center' 
  },
  activeIncome: { 
    backgroundColor: '#2e7d32' 
  },
  activeExpense: { 
    backgroundColor: '#c62828' 
  },
  typeText: { 
    fontSize: 14, 
    fontWeight: '600' 
  },
  activeText: { 
    color: '#ffffff' 
  },
  input: { 
    borderWidth: 1, 
    borderRadius: 8, 
    padding: 10, 
    marginBottom: 8, 
    fontSize: 14 
  },
  addButton: { 
    padding: 12, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 4 
  },
  addButtonText: { 
    color: '#ffffff', 
    fontWeight: 'bold', 
    fontSize: 14 
  },
  undoContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    backgroundColor: '#333', 
    padding: 10, 
    borderRadius: 8, 
    marginBottom: 10, 
    alignItems: 'center' 
  },
  undoText: { 
    color: '#ffffff', 
    fontSize: 13 
  },
  undoButtonText: { 
    color: '#ffebf1', 
    fontWeight: 'bold', 
    fontSize: 13 
  },
  searchInput: { 
    borderWidth: 1, 
    borderRadius: 8, 
    padding: 10, 
    marginBottom: 10, 
    fontSize: 14 
  },
  listContainer: { 
    paddingBottom: 20 
  },
  empty: { 
    textAlign: 'center', 
    fontStyle: 'italic', 
    marginTop: 20 
  },
});