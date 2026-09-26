import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function HomeScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);


  useEffect(() => {
    loadData();

    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });

    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('@tasks');
      const savedCompleted = await AsyncStorage.getItem('@completed_count');
      if (savedTasks) setTasks(JSON.parse(savedTasks));
      else setTasks([]);
      
      if (savedCompleted) setCompletedCount(parseInt(savedCompleted, 10));
      else setCompletedCount(0);
    } catch (error) {
      console.error('Error al cargar datos', error);
    }
  };

  const saveTasksAndCount = async (newTasks, newCount) => {
    try {
      setTasks(newTasks);
      setCompletedCount(newCount);
      await AsyncStorage.setItem('@tasks', JSON.stringify(newTasks));
      await AsyncStorage.setItem('@completed_count', newCount.toString());
    } catch (error) {
      console.error('Error al guardar datos', error);
    }
  };

  const completeTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    const newCount = completedCount + 1;
    saveTasksAndCount(updatedTasks, newCount);
  };

  const clearAllTasks = async () => {
    try {
      await AsyncStorage.setItem('@tasks', JSON.stringify([]));
      await AsyncStorage.setItem('@completed_count', '0');
      
      setTasks([]);
      setCompletedCount(0);
    } catch (error) {
      console.error('Error al limpiar las tareas', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>¡Bienvenido a TaskFlow!</Text>

      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>Tareas completadas: {completedCount}</Text>
      </View>

      <Text style={styles.subtitle}>Tareas Pendientes:</Text>
      
      <FlatList
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.taskCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskDesc}>{item.description}</Text>
            </View>
            <TouchableOpacity style={styles.doneButton} onPress={() => completeTask(index)}>
              <Text style={styles.doneButtonText}>✓</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay tareas pendientes.</Text>}
      />

      {tasks.length > 0 && (
        <TouchableOpacity style={styles.dangerButton} onPress={clearAllTasks}>
          <Text style={styles.buttonText}>Eliminar todas las tareas</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity 
        style={styles.primaryButton} 
        onPress={() => navigation.navigate('AddTask')}
      >
        <Text style={styles.buttonText}>+ Agregar Nueva Tarea</Text>
      </TouchableOpacity>
    </View>
  );
}

function AddTaskScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSaveTask = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Error', 'El título y la descripción no pueden estar vacíos.');
      return;
    }

    try {
      const savedTasks = await AsyncStorage.getItem('@tasks');
      const currentTasks = savedTasks ? JSON.parse(savedTasks) : [];
      const newTask = { title, description };
      const updatedTasks = [...currentTasks, newTask];

      await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));
      navigation.goBack();
    } catch (error) {
      console.error('Error al guardar tarea', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva Tarea</Text>
      <TextInput
        style={styles.input}
        placeholder="Título de la tarea"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descripción detallada"
        placeholderTextColor="#888"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TouchableOpacity style={styles.primaryButton} onPress={handleSaveTask}>
        <Text style={styles.buttonText}>Guardar Tarea</Text>
      </TouchableOpacity>
    </View>
  );
}

function SettingsScreen() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [intervalTime, setIntervalTime] = useState(1000);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, intervalTime);

    return () => clearInterval(timer);
  }, [intervalTime]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración del Sistema</Text>
      
      <View style={styles.clockContainer}>
        <Text style={styles.clockLabel}>Hora Actual en Vivo:</Text>
        <Text style={styles.clockText}>{time}</Text>
      </View>

      <Text style={styles.subtitle}>Cambiar velocidad del reloj:</Text>
      <View style={styles.intervalButtons}>
        <TouchableOpacity 
          style={[styles.intervalBtn, intervalTime === 1000 && styles.activeInterval]} 
          onPress={() => setIntervalTime(1000)}
        >
          <Text style={[styles.intervalText, intervalTime === 1000 && styles.activeIntervalText]}>1 Segundo</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.intervalBtn, intervalTime === 3000 && styles.activeInterval]} 
          onPress={() => setIntervalTime(3000)}
        >
          <Text style={[styles.intervalText, intervalTime === 3000 && styles.activeIntervalText]}>3 Segundos</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.intervalBtn, intervalTime === 5000 && styles.activeInterval]} 
          onPress={() => setIntervalTime(5000)}
        >
          <Text style={[styles.intervalText, intervalTime === 5000 && styles.activeIntervalText]}>5 Segundos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: '#7f00b2',
      }}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Configuración" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
          headerStyle: { backgroundColor: '#7f00b2' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      >
        <Stack.Screen name="HomeTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ title: 'Crear Tarea' }} />
      </Stack.Navigator>
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