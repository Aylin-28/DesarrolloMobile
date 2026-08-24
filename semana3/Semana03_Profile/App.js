import React from "react";
import { SafeAreaView } from "react-native";
import PerfilUsuario from "./components/PerfilUsuario";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <PerfilUsuario name="Juan Pérez" age={28} />
      <PerfilUsuario name="Ana López" age={34} />
    </SafeAreaView>
  );
}