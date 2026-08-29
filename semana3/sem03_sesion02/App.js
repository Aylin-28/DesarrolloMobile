import React from 'react';
import { StyleSheet, Text, View, ScrollView, useWindowDimensions } from 'react-native';
import UserCard from './components/UserCard';


const users = [
  {
    id: 1,
    name: 'Sofía Lucia Garcia',
    age: 28,
    photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhKT2tv_TUg772sJhkJ2ULiup8zltN9PNdasNA5zYugRmBsicmm9z9ptA&s=10',
    role: 'Desarrolladora Frontend Senior',
    isOnline: true,
  },
  {
    id: 2,
    name: 'Carlos Alberto Ramirez',
    age: 34,
    photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7R8_35N1_F1Zo5fo5goXSaXeNNZfJxL60CxCKEOyCMaMSVcVodbrhw9E&s=10',
    role: 'Arquitecto de Software',
    isOnline: false,
  },
  {
    id: 3,
    name: 'María Fernanda Rengifo',
    age: 26,
    photo: 'https://img.magnific.com/foto-gratis/increible-mujer-negocios-alegre-pie-brazos-cruzados_171337-8487.jpg?semt=ais_hybrid&w=740&q=80',
    role: 'Diseñadora UX/UI',
    isOnline: true,
  },
  {
    id: 4,
    name: 'Jorge Luis Pérez',
    age: 41,
    photo: 'https://media.istockphoto.com/id/1413766112/es/foto/exitoso-hombre-de-negocios-maduro-mirando-a-la-c%C3%A1mara-con-confianza.jpg?s=612x612&w=0&k=20&c=_wh29d41PN8a3GlqANKphBMIkN2P-QI4KPPIM7bVvDA=',
    isOnline: false,
  },
];

export default function App() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const cardWidth = isLargeScreen ? '48%' : '100%';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>Directorio de Empleados</Text>
      
      <View style={styles.gridContainer}>
        {users.map((user) => (
          <View key={user.id} style={[styles.cardWrapper, { width: cardWidth }]}>
            <UserCard 
              name={user.name} 
              age={user.age} 
              photo={user.photo} 
              role={user.role} 
              isOnline={user.isOnline} 
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    flexGrow: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 20,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    marginBottom: 20,
  },
});