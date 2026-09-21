import React, { useMemo, useRef, useState, useCallback } from "react";
import { View, Text, TextInput, FlatList, Pressable, StyleSheet } from "react-native";
// 1. Importa SafeAreaProvider
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { products } from "./data/Products";
import { ProductRow } from "./ProductRow";

export default function App() {
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const inputRef = useRef(null);
  const debounceRef = useRef(null); 

  const handleFocus = useCallback(() => inputRef.current?.focus(), []);
  const onChangeQuery = useCallback((text) => setQuery(text), []);
  const onChangeMinPrice = useCallback((text) => setMinPrice(text.replace(/[^0-9]/g, "")), []);
  const clear = useCallback(() => { setQuery(""); setMinPrice(""); inputRef.current?.focus(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const min = Number(minPrice || 0);
    const sorted = [...products].sort((a, b) => a.name.localeCompare(b.name));
    return sorted.filter(p => (q === "" || p.name.toLowerCase().includes(q)) && p.price >= min);
  }, [query, minPrice]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const categories = new Set(filtered.map(p => p.category)).size;
    return { total, categories };
  }, [filtered]);

  const renderItem = useCallback(({ item }) => <ProductRow item={item} />, []);
  const keyExtractor = useCallback((item) => item.id, []);

  return (
    /* 2. Envuelve todo dentro de SafeAreaProvider */
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Catalogo Optimizado</Text>

        <View style={styles.controls}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Buscar por nombre..."
            value={query}
            onChangeText={onChangeQuery}
            returnKeyType="search"
          />
          <TextInput
            style={styles.input}
            placeholder="Precio minimo (S/)"
            keyboardType="numeric"
            value={minPrice}
            onChangeText={onChangeMinPrice}
          />

          <View style={styles.buttons}>
            <Pressable onPress={handleFocus} style={styles.btn}><Text style={styles.btnText}>Foco</Text></Pressable>
            <Pressable onPress={clear} style={styles.btnSecondary}><Text style={styles.btnText}>Limpiar</Text></Pressable>
          </View>
        </View>

        <Text style={styles.stats}>Resultados: {stats.total} Categorías: {stats.categories}</Text>

        <FlatList
          data={filtered}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          initialNumToRender={20}
          windowSize={10}
          removeClippedSubviews
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingVertical: 8 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  controls: { gap: 8, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 12, height: 44 },
  buttons: { flexDirection: "row", gap: 8 },
  btn: { backgroundColor: "#111827", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 },
  btnSecondary: { backgroundColor: "#374151", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 },
  btnText: { color: "white", fontWeight: "600" },
  stats: { marginBottom: 4, color: "#6b7280" },
});