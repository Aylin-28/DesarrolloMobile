import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { pokeApi } from '../api/pokeApi';

export default function DetailScreen({ route }) {
  const { url } = route.params;
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await pokeApi.get(url);
        setPokemon(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [url]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFD301" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {pokemon && (
        <View style={styles.card}>
          <Image
            source={{ uri: pokemon.sprites.front_default }}
            style={styles.sprite}
          />
          <Text style={styles.name}>{pokemon.name.toUpperCase()}</Text>
          <View style={styles.infoBadge}><Text style={styles.infoText}>Altura: {pokemon.height / 10} m</Text></View>
          <View style={styles.infoBadge}><Text style={styles.infoText}>Peso: {pokemon.weight / 10} kg</Text></View>
          <View style={styles.infoBadge}><Text style={styles.infoText}>Experiencia Base: {pokemon.base_experience}</Text></View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f5f6fa' 
  },
  center: { 
    lex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  card: { 
    backgroundColor: '#fff', 
    padding: 30, 
    borderRadius: 16, 
    alignItems: 'center', 
    elevation: 5, 
    width: '85%', 
    borderWidth: 2, 
    borderColor: '#030081' 
  },
  sprite: {
    width: 140, 
    height: 140, 
    marginBottom: 15, 
    backgroundColor: '#f0f3f4', 
    borderRadius: 70 
  },
  name: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: '#0C005B' 
  }, 
  infoBadge: { 
    backgroundColor: '#FFD301', 
    paddingVertical: 8, 
    paddingHorizontal: 15, 
    borderRadius: 20, 
    marginVertical: 4, 
    width: '100%', 
    alignItems: 'center' 
  }, 
  infoText: { 
    fontSize: 15, 
    color: '#0C005B', 
    fontWeight: 'bold' 
  },
});