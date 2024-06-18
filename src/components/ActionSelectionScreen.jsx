import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ActionSelectionScreen({ navigation, route }) {
    const { date } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Selecciona una acción para {date}</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('AddActivity', { date })}
            >
                <Text style={styles.buttonText}>Agregar Actividad</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('ViewActivities', { date })}
            >
                <Text style={styles.buttonText}>Ver Actividades</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007AFF', // Azul iOS
        padding: 15,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
