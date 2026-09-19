import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const STORAGE_KEY = '@todo_app_pro_tasks';

export default function App() {
  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('Todas'); 
  const [dynamicMessage, setDynamicMessage] = useState('');
  const [messageColor, setMessageColor] = useState('#666');

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedTasks !== null) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error('Error al cargar las tareas:', error);
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        console.error('Error al guardar las tareas:', error);
      }
    };
    saveTasks();

    const total = tasks.length;
    if (total === 0) {
      setDynamicMessage('No hay tareas pendientes.');
      setMessageColor('#666');
    } else if (total >= 1 && total <= 3) {
      setDynamicMessage(`Tienes ${total} tareas. ¡Vas por buen camino!`);
      setMessageColor('#bc4ed8'); 
    } else if (total >= 4 && total <= 5) {
      setDynamicMessage(`Tienes ${total} tareas. ¡Cuidado, se están acumulando!`);
      setMessageColor('#7f00b2'); 
    } else {
      setDynamicMessage('¡Demasiadas tareas pendientes!');
      setMessageColor('#4c007d'); 
    }
  }, [tasks]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
    }, 30000); 

    return () => clearInterval(timer);
  }, []);

  const addTask = () => {
    if (taskText.trim() === '') {
      alert('La tarea no puede estar vacía.');
      return;
    }

    const isDuplicate = tasks.some(
      (task) => task.text.toLowerCase() === taskText.trim().toLowerCase()
    );
    if (isDuplicate) {
      alert('Esta tarea ya existe en la lista.');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      text: taskText.trim(),
      completed: false,
      createdAt: new Date().toLocaleString(), 
    };

    setTasks([newTask, ...tasks]);
    setTaskText('');
  };

  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const deleteCompletedTasks = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === 'Pendientes') return !task.completed;
      if (filter === 'Completadas') return task.completed;
      return true; 
    })
    .sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.title}>TodoAppPro</Text>

      <Text style={[styles.dynamicMessage, { color: messageColor }]}>
        {dynamicMessage}
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe una nueva tarea..."
          placeholderTextColor="#888"
          value={taskText}
          onChangeText={setTaskText}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        {['Todas', 'Pendientes', 'Completadas'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterButton, filter === f && styles.activeFilter]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.activeFilterText,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <TouchableOpacity
              style={styles.taskInfo}
              onPress={() => toggleTaskCompletion(item.id)}
            >
              <Text
                style={[
                  styles.taskText,
                  item.completed && styles.completedText,
                ]}
              >
                {item.text}
              </Text>
              <Text style={styles.dateText}>{item.createdAt}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteTask(item.id)}
            >
              <Ionicons name = "close-circle" size={20} color={"#7f00b2"}/>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity
        style={styles.clearCompletedButton}
        onPress={deleteCompletedTasks}
      >
        <Text style={styles.clearCompletedText}>
          Eliminar completadas
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebe2f757',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#1b004b',
  },
  dynamicMessage: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#7f00b2',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#e4e6eb',
    marginHorizontal: 4,
    borderRadius: 6,
  },
  activeFilter: {
    backgroundColor: '#bc4ed8',
  },
  filterText: {
    color: '#333',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
  },
  listContainer: {
    paddingBottom: 20,
  },
  taskCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e1e4e8',
  },
  taskInfo: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  dateText: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    color: '#4c007d',
    fontWeight: 'bold',
    fontSize: 16,
  },
  clearCompletedButton: {
    backgroundColor: '#7f00b2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  clearCompletedText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});