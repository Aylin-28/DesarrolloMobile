import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet 
} from 'react-native';
import axios from 'axios';

export default function UserScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    setError(null);
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(res => setUsers(res.data))
      .catch(() => setError('Error al cargar usuarios'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#663399" />
        <Text style={styles.loadingText}>Cargando usuarios...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.reloadButton} onPress={fetchUsers}>
          <Text style={styles.reloadButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.countText}>Mostrando {users.length} usuarios</Text>
        <TouchableOpacity style={styles.reloadButton} onPress={fetchUsers}>
          <Text style={styles.reloadButtonText}>Recargar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={users}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Posts', { userId: item.id, userName: item.name })}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.email}>📧 {item.email}</Text>
            <Text style={styles.city}>📍 {item.address.city}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E5F5',
    padding: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3E5F5',
  },
  loadingText: {
    marginTop: 10,
    color: '#663399',
    fontWeight: '600',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 16,
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  countText: {
    fontSize: 14,
    color: '#663399',
    fontWeight: 'bold',
  },
  reloadButton: {
    backgroundColor: '#663399',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  reloadButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginVertical: 6,
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#663399',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#663399',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#4A148C',
    marginBottom: 2,
  },
  city: {
    fontSize: 13,
    color: '#7B1FA2',
  },
});