import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { financeStorage } from './src/storage/financetorage';
import DashboardScreen from './src/screens/DashboardScreen';
import MovementsScreen from './src/screens/MovementsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

export default function App() {
  const [currentTab, setCurrentTab] = useState('Dashboard');
  const [movements, setMovements] = useState([]);
  const [budget, setBudget] = useState(1000);
  const [theme, setTheme] = useState('light');
  const [lastDeleted, setLastDeleted] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const storedMovements = await financeStorage.getMovements();
        const storedBudget = await financeStorage.getBudget();
        const storedTheme = await financeStorage.getTheme();

        setMovements(storedMovements);
        setBudget(storedBudget);
        setTheme(storedTheme);
      } catch (error) {
        console.error('Error al inicializar datos:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAddMovement = async (newMovement) => {
    const updated = [newMovement, ...movements];
    setMovements(updated);
    await financeStorage.saveMovements(updated);
  };

  const handleDeleteMovement = async (id) => {
    const itemToDelete = movements.find((m) => m.id === id);
    const updated = movements.filter((m) => m.id !== id);
    setMovements(updated);
    setLastDeleted(itemToDelete);
    await financeStorage.saveMovements(updated);
  };

  const handleUndoDelete = async () => {
    if (lastDeleted) {
      const updated = [lastDeleted, ...movements];
      setMovements(updated);
      setLastDeleted(null);
      await financeStorage.saveMovements(updated);
    }
  };

  const handleUpdateBudget = async (newBudget) => {
    setBudget(newBudget);
    await financeStorage.saveBudget(newBudget);
  };

  const handleToggleTheme = async (newTheme) => {
    setTheme(newTheme);
    await financeStorage.saveTheme(newTheme);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text>Cargando SmartWallet UTP...</Text>
      </View>
    );
  }

  const isDark = theme === 'dark';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#4d1127' : '#ffffff' }]}>
      <View style={styles.content}>
        {currentTab === 'Dashboard' && <DashboardScreen movements={movements} budget={budget} theme={theme} />}
        {currentTab === 'Movements' && (
          <MovementsScreen
            movements={movements}
            onAddMovement={handleAddMovement}
            onDeleteMovement={handleDeleteMovement}
            onUndoDelete={handleUndoDelete}
            lastDeleted={lastDeleted}
            theme={theme}
          />
        )}
        {currentTab === 'Settings' && (
          <SettingsScreen
            budget={budget}
            onUpdateBudget={handleUpdateBudget}
            theme={theme}
            onToggleTheme={handleToggleTheme}
          />
        )}
      </View>

      <View style={[styles.navBar, { backgroundColor: isDark ? '#7a3a4f' : '#ffffff', borderTopColor: isDark ? '#a66377' : '#ffd7e3' }]}>
        <TouchableOpacity
          style={[styles.navItem, currentTab === 'Dashboard' && (isDark ? styles.activeTabDark : styles.activeTab)]}
          onPress={() => setCurrentTab('Dashboard')}
        >
          <Text style={[styles.navText, { color: isDark ? '#ffb5c8' : '#888' }, currentTab === 'Dashboard' && { color: isDark ? '#ffffff' : '#b23b61' }]}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, currentTab === 'Movements' && (isDark ? styles.activeTabDark : styles.activeTab)]}
          onPress={() => setCurrentTab('Movements')}
        >
          <Text style={[styles.navText, { color: isDark ? '#ffb5c8' : '#888' }, currentTab === 'Movements' && { color: isDark ? '#ffffff' : '#b23b61' }]}>Movimientos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, currentTab === 'Settings' && (isDark ? styles.activeTabDark : styles.activeTab)]}
          onPress={() => setCurrentTab('Settings')}
        >
          <Text style={[styles.navText, { color: isDark ? '#ffb5c8' : '#888' }, currentTab === 'Settings' && { color: isDark ? '#ffffff' : '#b23b61' }]}>Ajustes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  content: { 
    flex: 1 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#ffebf1' 
  },
  navBar: { 
    flexDirection: 'row', 
    borderTopWidth: 1 
  },
  navItem: { 
    flex: 1, 
    paddingVertical: 14, 
    alignItems: 'center' 
  },
  activeTab: { 
    backgroundColor: '#ffd7e3' 
  },
  activeTabDark: { 
    backgroundColor: '#a66377' 
  },
  navText: { 
    fontSize: 13, 
    fontWeight: 'bold' 
  },
});