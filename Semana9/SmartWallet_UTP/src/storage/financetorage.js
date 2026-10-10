import AsyncStorage from '@react-native-async-storage/async-storage';
const KEYS = {
  MOVEMENTS: '@smartwallet/movements',
  BUDGET: '@smartwallet/budget',
  THEME: '@smartwallet/theme',
};

export const financeStorage = {
  async getMovements() {
    try {
      const data = await AsyncStorage.getItem(KEYS.MOVEMENTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al leer movimientos:', error);
      return [];
    }
  },

  async saveMovements(movements) {
    try {
      await AsyncStorage.setItem(KEYS.MOVEMENTS, JSON.stringify(movements));
    } catch (error) {
      console.error('Error al guardar movimientos:', error);
      throw new Error('No se pudieron guardar los movimientos.');
    }
  },

  async getBudget() {
    try {
      const data = await AsyncStorage.getItem(KEYS.BUDGET);
      return data ? JSON.parse(data) : 1000; // Valor por defecto
    } catch (error) {
      console.error('Error al leer presupuesto:', error);
      return 1000;
    }
  },

  async saveBudget(budget) {
    try {
      await AsyncStorage.setItem(KEYS.BUDGET, JSON.stringify(budget));
    } catch (error) {
      console.error('Error al guardar presupuesto:', error);
      throw new Error('No se pudo guardar el presupuesto.');
    }
  },

  // Tema
  async getTheme() {
    try {
      return (await AsyncStorage.getItem(KEYS.THEME)) || 'light';
    } catch (error) {
      console.error('Error al leer tema:', error);
      return 'light';
    }
  },

  async saveTheme(theme) {
    try {
      await AsyncStorage.setItem(KEYS.THEME, theme);
    } catch (error) {
      console.error('Error al guardar tema:', error);
    }
  },
};