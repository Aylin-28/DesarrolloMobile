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

export default function PostScreen({ route }) {
  const { userId, userName } = route.params;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = () => {
    setLoading(true);
    setError(null);
    axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
      .then(res => setPosts(res.data))
      .catch(() => setError('Error al cargar posts'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#663399" />
        <Text style={styles.loadingText}>Cargando publicaciones...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.reloadButton} onPress={fetchPosts}>
          <Text style={styles.reloadButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.countText}>Mostrando {posts.length} publicaciones</Text>
        <TouchableOpacity style={styles.reloadButton} onPress={fetchPosts}>
          <Text style={styles.reloadButtonText}>Recargar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
          </View>
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
    borderTopWidth: 3,
    borderTopColor: '#663399',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#4A148C',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  body: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
  },
});