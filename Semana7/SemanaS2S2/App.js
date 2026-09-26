import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  StyleSheet, Text, View, FlatList, TouchableOpacity, 
  TextInput, ScrollView, RefreshControl, StatusBar 
} from 'react-native';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigation } from '@react-navigation/bottom-tabs'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function HomeScreen({ navigation }) {
  const [articles, setArticles] = useState([
    { id: '1', title: 'React Native 0.76 Lanzado', desc: 'Nuevas mejoras de rendimiento y arquitectura por defecto.', date: 'Hace 5 min' },
    { id: '2', title: 'El futuro de la IA en Móviles', desc: 'Cómo los modelos locales están cambiando las apps.', date: 'Hace 12 min' },
  ]);
  const [refreshing, setRefreshing] = useState(false);
  const [intervalTime, setIntervalTime] = useState(5000); 

  useEffect(() => {
    AsyncStorage.getItem('@update_interval').then((value) => {
      if (value) setIntervalTime(parseInt(value, 10));
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const newArticle = {
        id: Date.now().toString(),
        title: `Noticia en vivo #${Math.floor(Math.random() * 100)}`,
        desc: 'Esta noticia se ha generado automáticamente gracias al temporizador.',
        date: 'Justo ahora',
      };
      setArticles((prev) => [newArticle, ...prev]);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [intervalTime]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const removeAllArticles = () => {
    setArticles([]);
  };

  const saveFavorite = async (article) => {
    try {
      const storedFavorites = await AsyncStorage.getItem('@favorites');
      const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
      
      if (!favorites.some((fav) => fav.id === article.id)) {
        favorites.push(article);
        await AsyncStorage.setItem('@favorites', JSON.stringify(favorites));
        alert('¡Guardado en Favoritos!');
      } else {
        alert('Este artículo ya está en favoritos.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>NewsFlow</Text>
      
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>Artículos en feed: {articles.length}</Text>
      </View>

      <TouchableOpacity style={styles.dangerButton} onPress={removeAllArticles}>
        <Text style={styles.buttonText}>Limpiar Todo el Feed</Text>
      </TouchableOpacity>

      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        initialNumToRender={5}
        getItemLayout={(data, index) => ({
          length: 90,
          offset: 90 * index,
          index,
        })}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7f00b2" />}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay noticias disponibles.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.taskCard} 
            onPress={() => navigation.navigate('Detail', { article: item })}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskDesc} numberOfLines={1}>{item.desc}</Text>
              <Text style={{ fontSize: 11, color: '#7f00b2', marginTop: 4 }}>{item.date}</Text>
            </View>
            <TouchableOpacity style={styles.doneButton} onPress={() => saveFavorite(item)}>
              <Text style={styles.doneButtonText}>⭐</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function DetailScreen({ route }) {
  const { article } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.clockContainer}>
        <Text style={styles.clockLabel}>Detalle del Artículo</Text>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={{ fontSize: 12, color: '#888', marginBottom: 15 }}>Publicado: {article.date}</Text>
        <Text style={{ fontSize: 16, color: '#441d5b', lineHeight: 22 }}>{article.desc}</Text>
        <Text style={{ fontSize: 14, color: '#666', marginTop: 20 }}>
          Aquí iría todo el contenido extenso de la noticia simulada, estructurado con párrafos adicionales para ofrecer una lectura cómoda al usuario dentro de la aplicación móvil.
        </Text>
      </View>
    </ScrollView>
  );
}

function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('@favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      } else {
        setFavorites([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const removeFavorite = async (id) => {
    try {
      const filtered = favorites.filter((item) => item.id !== id);
      setFavorites(filtered);
      await AsyncStorage.setItem('@favorites', JSON.stringify(filtered));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Favoritos</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No tienes favoritos guardados aún.</Text>}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskDesc} numberOfLines={1}>{item.desc}</Text>
            </View>
            <TouchableOpacity style={styles.dangerButton} onPress={() => removeFavorite(item.id)}>
              <Text style={styles.buttonText}>X</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

function SettingsScreen() {
  const [selectedInterval, setSelectedInterval] = useState(5000);

  const changeInterval = async (time) => {
    setSelectedInterval(time);
    await AsyncStorage.setItem('@update_interval', time.toString());
    alert(`Intervalo actualizado a ${time / 1000} segundos`);
  };

  const resetApp = async () => {
    await AsyncStorage.clear();
    alert('Aplicación reseteada por completo.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración</Text>
      
      <Text style={styles.subtitle}>Intervalo de actualización automática:</Text>
      <View style={styles.intervalButtons}>
        {[3000, 5000, 10000].map((time) => (
          <TouchableOpacity 
            key={time} 
            style={[styles.intervalBtn, selectedInterval === time && styles.activeInterval]}
            onPress={() => changeInterval(time)}
          >
            <Text style={[styles.intervalText, selectedInterval === time && styles.activeIntervalText]}>
              {time / 1000}s
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ marginTop: 40 }}>
        <TouchableOpacity style={styles.dangerButton} onPress={resetApp}>
          <Text style={styles.buttonText}>Restaurar / AsyncStorage.clear()</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#fdf8ff' }, headerTintColor: '#7f00b2' }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Detalle de Noticia' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [favCount, setFavCount] = useState(0);
  useEffect(() => {
    const checkFavs = async () => {
      const data = await AsyncStorage.getItem('@favorites');
      if (data) setFavCount(JSON.parse(data).length);
    };
    checkFavs();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#fdf8ff" />
      <Tab.Navigator 
        screenOptions={{
          tabBarActiveTintColor: '#7f00b2',
          tabBarInactiveTintColor: '#64748b',
          headerShown: false,
          tabBarStyle: { backgroundColor: '#fdf8ff' }
        }}
      >
        <Tab.Screen name="Inicio" component={HomeStack} />
        <Tab.Screen 
          name="Favoritos" 
          component={FavoritesScreen} 
          options={{ tabBarBadge: favCount > 0 ? favCount : undefined }}
        />
        <Tab.Screen name="Ajustes" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#fdf8ff', 
    justifyContent: 'flex-start' 
  },
  welcomeText: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 10, 
    marginTop: 40 
  },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 15, 
    marginTop: 20 
  },
  subtitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#555', 
    marginVertical: 10 
  },
  counterContainer: { 
    backgroundColor: '#f3e8ff', 
    padding: 10, 
    borderRadius: 8, 
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: '#e9d5ff' 
  },
  counterText: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#7f00b2' 
  },
  input: { 
    backgroundColor: '#fff', 
    borderWidth: 1, 
    borderColor: '#d8b4fe', 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 12, 
    fontSize: 16 
  },
  textArea: { 
    height: 100, 
    textAlignVertical: 'top' 
  },
  primaryButton: { 
    backgroundColor: '#7f00b2', 
    padding: 14, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginVertical: 6 
  },
  dangerButton: { 
    backgroundColor: '#dc2626', 
    padding: 12, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginVertical: 6 
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  taskCard: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 10, 
    alignItems: 'center', 
    elevation: 2, 
    borderWidth: 1, 
    borderColor: '#f3e8ff' 
  },
  taskTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#1e293b' 
  },
  taskDesc: { 
    fontSize: 14, 
    color: '#64748b', 
    marginTop: 4 
  },
  doneButton: { 
    backgroundColor: '#16a34a', 
    padding: 10, 
    borderRadius: 20, 
    width: 36, 
    height: 36, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  doneButtonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  emptyText: { 
    textAlign: 'center', 
    color: '#94a3b8', 
    marginVertical: 20 
  },
  clockContainer: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginBottom: 20, 
    elevation: 2, 
    borderWidth: 1, 
    borderColor: '#f3e8ff' 
  },
  clockLabel: { 
    fontSize: 14, 
    color: '#64748b', 
    marginBottom: 5 
  },
  clockText: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#7f00b2' 
  },
  intervalButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  intervalBtn: { 
    backgroundColor: '#ffffff', 
    padding: 12, 
    borderRadius: 6, 
    flex: 1, 
    marginHorizontal: 4, 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#d8b4fe' 
  },
  activeInterval: { 
    backgroundColor: '#7f00b2', 
    borderColor: '#7f00b2' 
  },
  intervalText: { 
    color: '#7f00b2', 
    fontSize: 12, 
    fontWeight: 'bold' 
  },
  activeIntervalText: { 
    color: '#ffffff' 
  }
});