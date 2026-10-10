import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function MovementRow({ item, onDelete, theme }) {
  const isDark = theme === 'dark';
  const isIncome = item.type === 'income';

  return (
    <View style={[styles.row, { backgroundColor: isDark ? '#7a3a4f' : '#fff' }]}>
      <View style={styles.info}>
        <Text style={[styles.description, { color: isDark ? '#ffffff' : '#333' }]}>{item.description}</Text>
        <Text style={[styles.details, { color: isDark ? '#ffb5c8' : '#777' }]}>
          {item.category} • {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.rightContainer}>
        <Text style={[styles.amount, isIncome ? styles.income : styles.expense]}>
          {isIncome ? '+' : '-'}${parseFloat(item.amount).toFixed(2)}
        </Text>
        <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteButton}>
          <Text style={[styles.deleteText, { color: isDark ? '#ffb5c8' : '#999' }]}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    marginVertical: 6,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  info: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
  },
  details: {
    fontSize: 12,
    marginTop: 4,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
  },
  income: {
    color: '#81c784',
  },
  expense: {
    color: '#e57373',
  },
  deleteButton: {
    padding: 6,
  },
  deleteText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});