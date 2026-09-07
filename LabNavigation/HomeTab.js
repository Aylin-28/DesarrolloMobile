import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// --- STACK DE CHATS (Reto Extra) ---
function ListaChatsScreen({ navigation }) {
    return (
        <View style={styles.screenContainer}>
            <Text style={styles.title}>Lista de Chats</Text>
            
            <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.navigate('DetalleChat', { nombre: 'María Gómez' })}
            >
                <Ionicons name="chatbubble-ellipses-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>Abrir chat con María</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.navigate('DetalleChat', { nombre: 'Carlos Ruiz' })}
            >
                <Ionicons name="chatbubble-ellipses-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>Abrir chat con Carlos</Text>
            </TouchableOpacity>
        </View>
    );
}

function DetalleChatScreen({ route }) {
    const { nombre } = route.params || {};
    return (
        <View style={[styles.screenContainer, { backgroundColor: '#fcf8ff' }]}>
            <Ionicons name="person-circle-outline" size={80} color="#8A2BE2" style={{ marginBottom: 10 }} />
            <Text style={styles.title}>Conversación con</Text>
            <Text style={[styles.title, { color: '#8A2BE2', fontWeight: 'bold' }]}>{nombre}</Text>
        </View>
    );
}

const ChatsStack = createNativeStackNavigator();

function ChatsStackScreen() {
    return (
        <ChatsStack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#8A2BE2' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        >
            <ChatsStack.Screen 
                name="ListaChats" 
                component={ListaChatsScreen} 
                options={{ headerShown: false }} 
            />
            <ChatsStack.Screen 
                name="DetalleChat" 
                component={DetalleChatScreen} 
                options={({ route }) => ({ title: route.params?.nombre || 'Chat' })} 
            />
        </ChatsStack.Navigator>
    );
}
// ----------------------------------

function EstadosScreen() {
    return (
        <View style={styles.screenContainer}>
            <Ionicons name="radio-button-on" size={50} color="#9370DB" style={{ marginBottom: 10 }} />
            <Text style={styles.title}>Estados Recientes</Text>
        </View>
    );
}

function LlamadasScreen() {
    return (
        <View style={styles.screenContainer}>
            <Ionicons name="call" size={50} color="#9370DB" style={{ marginBottom: 10 }} />
            <Text style={styles.title}>Registro de Llamadas</Text>
        </View>
    );
}

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Chats') {
                        iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                    } else if (route.name === 'Estados') {
                        iconName = focused ? 'radio-button-on' : 'radio-button-off';
                    } else if (route.name === 'Llamadas') {
                        iconName = focused ? 'call' : 'call-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#6A0DAD', // Lila oscuro / Morado
                tabBarInactiveTintColor: '#b19cd9', // Lila claro inactivo
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopColor: '#e6ccff',
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            })}
        >
            <Tab.Screen 
                name="Chats" 
                component={ChatsStackScreen} 
                options={{ headerShown: false }} 
            />
            <Tab.Screen name="Estados" component={EstadosScreen} />
            <Tab.Screen name="Llamadas" component={LlamadasScreen} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f5ff', // Fondo lila muy sutil
        padding: 20,
    },
    title: {
        fontSize: 20,
        color: '#4B0082',
        marginBottom: 15,
        fontWeight: '500',
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#8A2BE2',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: 'center',
        marginVertical: 8,
        shadowColor: '#8A2BE2',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});