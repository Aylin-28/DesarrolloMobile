import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function DashboardScreen({ movements, budget, theme }) {
  const isDark = theme === 'dark';

  const totalIncome = movements
    .filter((m) => m.type === 'income')
    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  const totalExpense = movements
    .filter((m) => m.type === 'expense')
    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  const balance = totalIncome - totalExpense;
  const budgetUsedPercent = budget > 0 ? (totalExpense / budget) * 100 : 0;

  let semaphoreColor = isDark ? '#81c784' : '#2e7d32';
  let statusMessage = 'Presupuesto bajo control';
  if (budgetUsedPercent >= 80 && budgetUsedPercent <= 100) {
    semaphoreColor = '#ffb74d';
    statusMessage = '¡Advertencia! Te acercas al límite del presupuesto';
  } else if (budgetUsedPercent > 100) {
    semaphoreColor = '#e57373';
    statusMessage = '¡Exceso crítico de presupuesto!';
  }

  const categoryTotals = movements
    .filter((m) => m.type === 'expense')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + parseFloat(curr.amount);
      return acc;
    }, {});

  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: isDark ? '#4d1127' : '#ffebf1' }]}>
      <Text style={[styles.title, { color: isDark ? '#ffb5c8' : '#ff6699' }]}>SmartWallet UTP</Text>

      <View style={styles.cardContainer}>
        <View style={[styles.card, { backgroundColor: isDark ? '#7a3a4f' : '#ffffff' }]}>
          <Text style={[styles.cardTitle, { color: isDark ? '#ffb5c8' : '#555' }]}>Ingresos</Text>
          <Text style={[styles.cardValue, { color: isDark ? '#ffffff' : '#000' }]}>+${totalIncome.toFixed(2)}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: isDark ? '#7a3a4f' : '#ffffff' }]}>
          <Text style={[styles.cardTitle, { color: isDark ? '#ffb5c8' : '#555' }]}>Gastos</Text>
          <Text style={[styles.cardValue, { color: isDark ? '#ffffff' : '#000' }]}>-${totalExpense.toFixed(2)}</Text>
        </View>
      </View>

      <View style={[styles.balanceCard, { backgroundColor: isDark ? '#7a3a4f' : '#ffd7e3' }]}>
        <Text style={[styles.balanceTitle, { color: isDark ? '#ffb5c8' : '#b23b61' }]}>Saldo Disponible</Text>
        <Text style={[styles.balanceValue, { color: isDark ? '#ffffff' : '#881537' }, balance < 0 && { color: '#e57373' }]}>
          ${balance.toFixed(2)}
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: isDark ? '#7a3a4f' : '#ffffff' }]}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#ffb5c8' : '#333' }]}>Presupuesto Mensual</Text>
        <Text style={[styles.budgetText, { color: isDark ? '#d38ca0' : '#666' }]}>
          Gastado: ${totalExpense.toFixed(2)} /${parseFloat(budget).toFixed(2)} ({budgetUsedPercent.toFixed(1)}%)
        </Text>
        <View style={[styles.progressBarBackground, { backgroundColor: isDark ? '#a66377' : '#ffc3d5' }]}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.min(budgetUsedPercent, 100)}%`, backgroundColor: semaphoreColor },
            ]}
          />
        </View>
        <Text style={[styles.statusMessage, { color: semaphoreColor }]}>{statusMessage}</Text>
      </View>

      <View style={[styles.section, { backgroundColor: isDark ? '#7a3a4f' : '#ffffff' }]}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#ffb5c8' : '#333' }]}>Top 3 Categorías de Gasto</Text>
        {topCategories.length === 0 ? (
          <Text style={[styles.emptyText, { color: isDark ? '#d38ca0' : '#888' }]}>No hay gastos registrados aún.</Text>
        ) : (
          topCategories.map(([cat, amount], index) => (
            <View key={cat} style={[styles.topRow, { borderBottomColor: isDark ? '#a66377' : '#ffebf1' }]}>
              <Text style={[styles.topCategory, { color: isDark ? '#ffffff' : '#444' }]}>
                {index + 1}. {cat}
              </Text>
              <Text style={[styles.topAmount, { color: isDark ? '#ffb5c8' : '#c62828' }]}>${amount.toFixed(2)}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 16, 
    flexGrow: 1 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 16, 
    textAlign: 'center' 
  },
  cardContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 12 
  },
  card: { 
    flex: 1, 
    padding: 16, 
    borderRadius: 12, 
    marginHorizontal: 4, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 4, 
    elevation: 2 
  },
  cardTitle: { 
    fontSize: 14, 
    fontWeight: '600' 
  },
  cardValue: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginTop: 4 
  },
  balanceCard: { 
    padding: 20, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginBottom: 16, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 4, 
    elevation: 2 
  },
  balanceTitle: { 
    fontSize: 14, 
    fontWeight: '600' 
  },
  balanceValue: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginTop: 4 
  },
  section: { 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 16, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 4, 
    elevation: 2 
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  budgetText: { 
    fontSize: 14, 
    marginBottom: 8 
  },
  progressBarBackground: { 
    height: 10, 
    borderRadius: 5, 
    overflow: 'hidden' 
  },
  progressBarFill: { 
    height: '100%', 
    borderRadius: 5 
  },
  statusMessage: { 
    fontSize: 12, 
    fontWeight: '600', 
    marginTop: 6, 
    textAlign: 'right' 
  },
  topRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 6, 
    borderBottomWidth: 1 
  },
  topCategory: { 
    fontSize: 14 
  },
  topAmount: { 
    fontSize: 14, 
    fontWeight: 'bold' 
  },
  emptyText: { 
    fontStyle: 'italic' 
  },
});