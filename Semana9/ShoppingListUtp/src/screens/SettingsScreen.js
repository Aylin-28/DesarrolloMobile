import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';

export default function SettingsScreen({ 
    isDarkMode, 
    toggleDarkMode, 
    defaultQty, 
    updateDefaultQty, 
    listData, 
    importListData 
}) {
    const [jsonInput, setJsonInput] = useState(JSON.stringify(listData, null, 2));

    const handleExport = () => {
        setJsonInput(JSON.stringify(listData, null, 2));
        Alert.alert('Exportado', 'Los datos actuales se cargaron en el cuadro de texto JSON.');
    };

    const handleImport = () => {
        try {
            const parsedData = JSON.parse(jsonInput);
            if (Array.isArray(parsedData)) {
                importListData(parsedData);
                Alert.alert('Éxito', 'Lista importada correctamente desde JSON.');
            } else {
                Alert.alert('Error', 'El formato JSON debe ser un arreglo de elementos.');
            }
        } catch (error) {
            Alert.alert('Error JSON', 'El texto ingresado no tiene un formato JSON válido.');
        }
    };

    return (
        <ScrollView style={[styles.container, isDarkMode ? styles.containerDark : styles.containerLight]}>
            <View style={[styles.settingRow, isDarkMode ? styles.rowDark : styles.rowLight]}>
                <Text style={[styles.label, isDarkMode && styles.textDark]}>Modo Oscuro</Text>
                <Switch
                    value={isDarkMode}
                    onValueChange={toggleDarkMode}
                />
            </View>

            <View style={[styles.settingRow, isDarkMode ? styles.rowDark : styles.rowLight, { marginTop: 12 }]}>
                <Text style={[styles.label, isDarkMode && styles.textDark]}>Cantidad por defecto</Text>
                <TextInput
                    style={[styles.qtyInput, isDarkMode && styles.inputDark]}
                    keyboardType="numeric"
                    value={defaultQty}
                    onChangeText={updateDefaultQty}
                    maxLength={3}
                />
            </View>

            <View style={[styles.sectionCard, isDarkMode ? styles.rowDark : styles.rowLight]}>
                <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>Respaldo (Import / Export JSON)</Text>
                <TextInput
                    style={[styles.jsonInput, isDarkMode && styles.inputDark]}
                    multiline
                    placeholder="[ { id: '1', title: 'Manzana', ... } ]"
                    placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
                    value={jsonInput}
                    onChangeText={setJsonInput}
                />
                <View style={styles.jsonBtnContainer}>
                    <TouchableOpacity style={styles.exportBtn} onPress={handleExport}>
                        <Text style={styles.btnText}>Exportar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.importBtn} onPress={handleImport}>
                        <Text style={styles.btnText}>Importar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    containerLight: { backgroundColor: '#f5f5f5' },
    containerDark: { backgroundColor: '#121212' },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    rowLight: { 
        backgroundColor: '#fff' 
    },
    rowDark: { 
        backgroundColor: '#2a2a2a' 
    },
    label: { 
        fontSize: 16, 
        fontWeight: '500', 
        color: '#333' 
    },
    textDark: { 
        color: '#fff' 
    },
    qtyInput: { 
        width: 50, 
        backgroundColor: '#f0f0f0', 
        textAlign: 'center', 
        padding: 6, 
        borderRadius: 6, 
        borderWidth: 1, 
        borderColor: '#ccc' 
    },
    inputDark: { 
        backgroundColor: '#1e1e1e', 
        borderColor: '#444', 
        color: '#fff' 
    },
    sectionCard: { 
        padding: 16, 
        borderRadius: 8, 
        marginTop: 16, 
        marginBottom: 30 
    },
    sectionTitle: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginBottom: 10 
    },
    jsonInput: { 
        height: 120, 
        borderWidth: 1, 
        borderColor: '#ccc', 
        borderRadius: 8, 
        padding: 10, 
        textAlignVertical: 'top', 
        fontSize: 12, 
        backgroundColor: '#fafafa' 
    },
    jsonBtnContainer: { 
        flexDirection: 'row', 
        justifyContent: 'flex-end', 
        gap: 10, 
        marginTop: 10 
    },
    exportBtn: { 
        backgroundColor: '#5856D6', 
        paddingVertical: 8, 
        paddingHorizontal: 14, 
        borderRadius: 6 
    },
    importBtn: { 
        backgroundColor: '#34C759', 
        paddingVertical: 8, 
        paddingHorizontal: 14, 
        borderRadius: 6 
    },
    btnText: { 
        color: '#fff', 
        fontWeight: 'bold', 
        fontSize: 14 
    },
});