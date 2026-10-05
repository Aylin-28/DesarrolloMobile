import React, { useState, useEffect, useRef } from 'react';
import { 
    StyleSheet, Text, View, TextInput, TouchableOpacity, 
    FlatList, Alert, Keyboard 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ItemRow from '../components/ItemRow';

const STORAGE_KEY = '@shopping_list';

export default function HomeScreen({ isDarkMode, defaultQty, list, setList }) {
    const [itemText, setItemText] = useState('');
    const [qtyText, setQtyText] = useState('');
    const [searchText, setSearchText] = useState('');

    const saveTimeoutRef = useRef(null);

 
    useEffect(() => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = setTimeout(() => {
            saveData(list);
        }, 500);

        return () => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        };
    }, [list]);

    const saveData = async (currentList) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(currentList));
        } catch (error) {
            console.error('Error al guardar la lista:', error);
        }
    };

    const addItem = () => {
        if (!itemText.trim()) {
            Alert.alert('Error', 'El nombre del producto no puede estar vacío.');
            return;
        }

        const newItem = {
            id: Date.now().toString(),
            title: itemText.trim(),
            quantity: qtyText.trim() || defaultQty || '1',
            done: false,
            createdAt: new Date().toLocaleString(),
        };

        setList([newItem, ...list]);
        setItemText('');
        setQtyText('');
        Keyboard.dismiss();
    };

    const toggleItem = (id) => {
        setList(list.map(item => 
            item.id === id ? { ...item, done: !item.done } : item
        ));
    };

    const removeItem = (id) => {
        setList(list.filter(item => item.id !== id));
    };

    const clearAll = () => {
        Alert.alert(
            'Borrar todo',
            '¿Estás seguro de que deseas eliminar toda la lista?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Sí, borrar', 
                    style: 'destructive', 
                    onPress: async () => {
                        setList([]);
                        try {
                            await AsyncStorage.removeItem(STORAGE_KEY);
                        } catch (error) {
                            console.error('Error al limpiar AsyncStorage:', error);
                        }
                    } 
                }
            ]
        );
    };

    const filteredList = list.filter(item => 
        item.title.toLowerCase().includes(searchText.toLowerCase())
    );

    const totalCount = list.length;
    const completedCount = list.filter(i => i.done).length;
    const pendingCount = totalCount - completedCount;

    return (
        <View style={[styles.container, isDarkMode ? styles.containerDark : styles.containerLight]}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={[styles.searchInput, isDarkMode && styles.inputDark]}
                    placeholder="Buscar producto..."
                    placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>

            <View style={styles.form}>
                <TextInput
                    style={[styles.input, isDarkMode && styles.inputDark]}
                    placeholder={`Producto (def. cant: ${defaultQty || '1'})...`}
                    placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
                    value={itemText}
                    onChangeText={setItemText}
                />
                <TextInput
                    style={[styles.inputQty, isDarkMode && styles.inputDark]}
                    placeholder={defaultQty || "Cant"}
                    placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
                    keyboardType="numeric"
                    value={qtyText}
                    onChangeText={setQtyText}
                />
                <TouchableOpacity style={styles.addBtn} onPress={addItem}>
                    <Text style={styles.addBtnText}>Agregar</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ItemRow 
                        item={item} 
                        onToggle={toggleItem} 
                        onDelete={removeItem} 
                        isDarkMode={isDarkMode} 
                    />
                )}
                ListEmptyComponent={
                    <Text style={[styles.emptyText, isDarkMode && styles.textDark]}>
                        {list.length === 0 ? 'No hay productos en la lista. ¡Agrega uno nuevo!' : 'No se encontraron resultados.'}
                    </Text>
                }
                contentContainerStyle={styles.listContainer}
            />

            <View style={[styles.footer, isDarkMode ? styles.footerDark : styles.footerLight]}>
                <View style={styles.counters}>
                    <Text style={[styles.counterText, isDarkMode && styles.textDark]}>Total: {totalCount}</Text>
                    <Text style={[styles.counterText, isDarkMode && styles.textDark]}>Pend: {pendingCount}</Text>
                    <Text style={[styles.counterText, isDarkMode && styles.textDark]}>Comp: {completedCount}</Text>
                </View>
                {list.length > 0 && (
                    <TouchableOpacity style={styles.clearBtn} onPress={clearAll}>
                        <Text style={styles.clearBtnText}>Borrar todo</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 10 },
    containerLight: { backgroundColor: '#f5f5f5' },
    containerDark: { backgroundColor: '#121212' },
    searchContainer: { paddingHorizontal: 16, marginBottom: 8 },
    searchInput: { backgroundColor: '#fff', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
    form: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 10, gap: 8 },
    input: { flex: 3, backgroundColor: '#fff', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
    inputQty: { flex: 1, backgroundColor: '#fff', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', textAlign: 'center' },
    inputDark: { backgroundColor: '#1e1e1e', borderColor: '#444', color: '#fff' },
    addBtn: { backgroundColor: '#007AFF', justifyContent: 'center', paddingHorizontal: 16, borderRadius: 8 },
    addBtnText: { color: '#fff', fontWeight: 'bold' },
    listContainer: { paddingHorizontal: 16, paddingBottom: 20 },
    emptyText: { textAlign: 'center', color: '#888', marginTop: 40, fontSize: 16 },
    footer: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1 },
    footerLight: { backgroundColor: '#fff', borderColor: '#ddd' },
    footerDark: { backgroundColor: '#1e1e1e', borderColor: '#333' },
    counters: { flexDirection: 'row', gap: 12 },
    counterText: { fontSize: 14, fontWeight: '600', color: '#333' },
    textDark: { color: '#fff' },
    clearBtn: { backgroundColor: '#FF3B30', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
    clearBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});