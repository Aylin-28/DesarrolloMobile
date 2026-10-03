import React, { useState, useEffect, useCallback } from 'react';
import {View, Text, FlatList, TextInput, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Button } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { pokeApi } from '../api/pokeApi';

export default function HomeScreen({ navigation }) {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadSettingsAndPokemons();
    }, [])
  );

  const loadSettingsAndPokemons = async () => {
    try {
      const savedLimit = await AsyncStorage.getItem('@pokemon_limit');
      const currentLimit = savedLimit ? parseInt(savedLimit, 10) : 20;
      setLimit(currentLimit);
      setOffset(0);
      fetchPokemons(false, 0, currentLimit);
    } catch (err) {
      console.error(err);
      fetchPokemons(false, 0, 20);
    }
  };

  const fetchPokemons = async (isRefresh = false, nextOffset = 0, currentLimit = limit) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (nextOffset === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const response = await pokeApi.get(`/pokemon?limit=${currentLimit}&offset=${nextOffset}`);
      
      const detailedPokemons = await Promise.all(
        response.data.results.map(async (poke) => {
          const res = await pokeApi.get(poke.url);
          return {
            name: poke.name,
            url: poke.url,
            id: res.data.id,
            sprite: res.data.sprites.front_default,
          };
        })
      );

      if (isRefresh || nextOffset === 0) {
        setPokemons(detailedPokemons);
      } else {
        setPokemons((prev) => [...prev, ...detailedPokemons]);
      }
    } catch (err) {
      setError('Error al conectar con la PokeAPI. Verifica tu conexión.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setOffset(0);
    fetchPokemons(true, 0, limit);
  };

  const handleLoadMore = () => {
    if (!loadingMore && !loading && !searchQuery) {
      const nextOffset = offset + limit;
      setOffset(nextOffset);
      fetchPokemons(false, nextOffset, limit);
    }
  };

  const filteredPokemons = pokemons.filter((poke) =>
    poke.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && pokemons.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFD301" />
        <Text style={styles.loadingText}>Cargando Pokédex...</Text>
      </View>
    );
  }

  if (error && pokemons.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Reintentar" onPress={() => fetchPokemons(false, 0, limit)} color="#3836ce" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar Pokémon..."
        placeholderTextColor="#2d1e91c7"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredPokemons}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('DetallePokemon', { url: item.url })}
          >
            <Image source={{ uri: item.sprite }} style={styles.sprite} />
            <View>
              <Text style={styles.pokeName}>{item.name.toUpperCase()}</Text>
              <Text style={styles.pokeId}>ID: #{item.id}</Text>
            </View>
          </TouchableOpacity>
        )}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No se encontraron Pokémon.</Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            {loadingMore && <ActivityIndicator size="small" color="#FFD301" />}
            <Text style={styles.counterText}>Mostrando de {limit} en {limit} | Total cargados: {pokemons.length}</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f6fa', 
    paddingHorizontal: 12, 
    paddingTop: 12 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#2825db',
    color: 'rgba(45, 26, 172, 0.87)',
    fontWeight: 'bold'
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 12,
    borderLeftWidth: 6,
    borderLeftColor: '#F1B900', 
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sprite: {
    width: 70,
    height: 70, 
    marginRight: 15, 
    backgroundColor: '#f0f3f4', 
    borderRadius: 35 
  },
  pokeName: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#0C005B' 
  }, 
  pokeId: { 
    fontSize: 13, 
    color: '#2d2ba0', 
    fontWeight: '600' 
  }, 
  loadingText: { 
    marginTop: 10, 
    color: '#030081', 
    fontWeight: 'bold' 
  },
  errorText: { 
    color: '#030081', 
    marginBottom: 10, 
    textAlign: 'center', 
    fontWeight: 'bold' 
  },
  emptyText: { 
    color: '#0C005B', 
    marginTop: 20, 
    fontWeight: 'bold' 
  },
  footer: { 
    paddingVertical: 20, 
    alignItems: 'center' 
  },
  counterText: { 
    marginTop: 5, 
    color: '#030081', 
    fontWeight: 'bold', 
    fontSize: 13 
  }
});