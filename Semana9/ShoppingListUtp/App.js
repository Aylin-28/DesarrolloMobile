import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, SafeAreaView, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const THEME_KEY = '@prefs/theme';
const QTY_KEY = '@prefs/default_qty';
const STORAGE_KEY = '@shopping_list';

export default function App() {
    const [currentTab, setCurrentTab] = useState('Home');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [defaultQty, setDefaultQty] = useState('1');
    const [listData, setListData] = useState([]);

    useEffect(() => {
        loadPreferences();
        loadShoppingList();
    }, []);

    const loadPreferences = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem(THEME_KEY);
            if (savedTheme !== null) {
                setIsDarkMode(JSON.parse(savedTheme));
            }

            const savedQty = await AsyncStorage.getItem(QTY_KEY);
            if (savedQty !== null) {
                setDefaultQty(JSON.parse(savedQty));
            }
        } catch (error) {
            console.error('Error al cargar preferencias:', error);
        }
    };

    const loadShoppingList = async () => {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEY);
            if (data !== null) {
                setListData(JSON.parse(data));
            }
        } catch (error) {
            console.error('Error al cargar datos de lista:', error);
        }
    };

    const toggleDarkMode = async (value) => {
        setIsDarkMode(value);
        try {
            await AsyncStorage.setItem(THEME_KEY, JSON.stringify(value));
        } catch (error) {
            console.error('Error al guardar el tema:', error);
        }
    };

    const updateDefaultQty = async (value) => {
        setDefaultQty(value);
        try {
            await AsyncStorage.setItem(QTY_KEY, JSON.stringify(value));
        } catch (error) {
            console.error('Error al guardar cantidad por defecto:', error);
        }
    };

    const importListData = async (newList) => {
        setListData(newList);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    };

    return (
        <SafeAreaProvider style={[styles.safeArea, isDarkMode ? styles.bgDark : styles.bgLight]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            
            <View style={[styles.header, isDarkMode ? styles.headerDark : styles.headerLight]}>
                <Text style={[styles.headerTitle, isDarkMode && styles.textDark]}>ShoppingList Utp</Text>
                <View style={styles.navTabs}>
                    <TouchableOpacity 
                        style={[styles.tabBtn, currentTab === 'Home' && styles.activeTab]} 
                        onPress={() => setCurrentTab('Home')}
                    >
                        <Text style={[styles.tabText, currentTab === 'Home' && styles.activeTabText]}>Lista</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.tabBtn, currentTab === 'Settings' && styles.activeTab]} 
                        onPress={() => setCurrentTab('Settings')}
                    >
                        <Text style={[styles.tabText, currentTab === 'Settings' && styles.activeTabText]}>Ajustes</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.content}>
                {currentTab === 'Home' ? (
                    <HomeScreen 
                        isDarkMode={isDarkMode} 
                        defaultQty={defaultQty} 
                        list={listData} 
                        setList={setListData} 
                    />
                ) : (
                    <SettingsScreen 
                        isDarkMode={isDarkMode} 
                        toggleDarkMode={toggleDarkMode} 
                        defaultQty={defaultQty}
                        updateDefaultQty={updateDefaultQty}
                        listData={listData}
                        importListData={importListData}
                    />
                )}
            </View>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1 
  },
  bgLight: { 
    backgroundColor: '#f5f5f5' 
  },
  bgDark: { 
    backgroundColor: '#121212' 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerLight: { 
    backgroundColor: '#fff', 
    borderColor: '#ddd' 
  },
  headerDark: { 
    backgroundColor: '#1e1e1e', 
    borderColor: '#333' 
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  textDark: { 
    color: '#fff' 
  },
  navTabs: { 
    flexDirection: 'row', 
    gap: 8 
  },
  tabBtn: { 
    paddingVertical: 6, 
    paddingHorizontal: 12, 
    borderRadius: 6, 
    backgroundColor: '#e0e0e0' 
  },
  activeTab: { 
    backgroundColor: '#007AFF' 
  },
  tabText: { 
    fontSize: 14, 
    color: '#333', 
    fontWeight: '500' 
  },
  activeTabText: { 
    color: '#fff' 
  },
  content: { 
    flex: 1 
  },

});