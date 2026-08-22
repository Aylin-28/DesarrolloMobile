import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Image, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.primerContainer}>
        <Text style={styles.titulo}>Bienvenido a Mi App</Text>
        <Text style={styles.subTitulo}>A continuación, veremos a un golden retriver</Text>
        <Image
          source={{ uri: "https://www.anipedia.net/imagenes/que-comen-los-perros.jpg" }}
          style={styles.image}
        />
        <Text style={styles.description}>
          Esta es una interfaz basica construida con view, Text e Image en react
          Native.
        </Text>
      </View>  

      <View style={styles.segundoContainer}>
        <Text style={styles.titulo}>Bienvenido a Mi App</Text>
        <Text style={styles.subTitulo}>A continuación, veremos a un gato negro</Text>
        <Image
          source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQF1NRU-ZB1Yd4QX1U9TJabU3mI7EZrfWDINAoIVgAs_ytiTlieP9p3Fw&s=10" }}
          style={styles.image}
        />
        <Text style={styles.description}>
          Esta es una interfaz basica construida con view, Text e Image en react
          Native.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerTitulo}>Pie de pagina</Text>
      </View>
    </View>

    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderColor: "#ececec9c",
    borderWidth: 2,
    borderRadius: 5, 
    margin: 8,
  },

  primerContainer: {
    flex: 1,
    backgroundColor: '#E3F6F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    height: 50,
    weight: 50,
    borderColor: "#a7a7a7cc",
    borderWidth: 2,
    borderRadius: 50, 
    margin: 8,
  },

  segundoContainer: {
    flex: 1,
    backgroundColor: '#afcbeb52',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    height: 50,
    weight: 50,
    borderColor: "#a7a7a7cc",
    borderWidth: 2,
    borderRadius: 50, 
    margin: 8,
  },
  
  footer: {
    fontSize: 16,
    backgroundColor: "#DBE7E4",
    textAlign: "center",
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
  },

  titulo: {
    fontSize: 24,
    fpontWeight: "bold",
    color: "#1f3c88",
    marginBottom: 20,
  },
  subTitulo: {
    fontSize: 24,
    fpontWeight: "bold",
    color: "#000000",
    marginBottom: 20,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 100,
  },
  description: {
    fontSize: 16,
    color: "#2d2655",
    textAlign: "center",
  },
  footerTitulo: {
    fontSize: 24,
    fpontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
  },

});
