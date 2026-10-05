import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ItemRow({ item, onToggle, onDelete, isDarkMode }) {
    return (
        <View style={[styles.row, isDarkMode ? styles.rowDark : styles.rowLight]}>
            <TouchableOpacity 
                style={styles.infoContainer} 
                onPress={() => onToggle(item.id)}
            >
                <Text style={[
                    styles.title, 
                    isDarkMode && styles.textDark,
                    item.done && styles.completedText
                ]}>
                    {item.title} {item.quantity ? `(Cant: ${item.quantity})` : ''}
                </Text>
                <Text style={[styles.dateText, isDarkMode && styles.dateTextDark]}>
                    {item.createdAt}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.actionBtn, item.done ? styles.undoBtn : styles.doneBtn]} 
                onPress={() => onToggle(item.id)}
            >
                <Text style={styles.actionBtnText}>{item.done ? 'Desmarcar' : 'Comprar'}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.deleteBtn} 
                onPress={() => onDelete(item.id)}
            >
                <Text style={styles.deleteBtnText}>❌</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        padding: 12,
        marginVertical: 6,
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    rowLight: { backgroundColor: '#fff' },
    rowDark: { backgroundColor: '#2a2a2a' },
    infoContainer: { flex: 1 },
    title: { fontSize: 16, color: '#333', fontWeight: '500' },
    textDark: { color: '#fff' },
    completedText: { textDecorationLine: 'line-through', color: '#888' },
    dateText: { fontSize: 11, color: '#666', marginTop: 2 },
    dateTextDark: { color: '#aaa' },
    actionBtn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 5, marginRight: 6 },
    doneBtn: { backgroundColor: '#4CAF50' },
    undoBtn: { backgroundColor: '#FF9800' },
    actionBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    deleteBtn: { padding: 6 },
    deleteBtnText: { fontSize: 16 },
});