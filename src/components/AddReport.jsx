import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

export default function AddReport({ onClose }) {
    const [tipoReporte, setTipoReporte] = useState('error');
    const [descripcion, setDescripcion] = useState('');
    const [area, setArea] = useState('');

    const handleAddReport = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('http://192.168.207.3:3000/api/reportes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    tipo_reporte: tipoReporte,
                    descripcion,
                    area
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al crear el reporte');
            }

            Alert.alert('Éxito', 'Reporte creado correctamente');
            onClose();
        } catch (error) {
            console.error('Error al crear el reporte:', error);
            Alert.alert('Error', error.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Tipo de Reporte:</Text>
            <Picker
                selectedValue={tipoReporte}
                onValueChange={(itemValue) => setTipoReporte(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Error" value="error" />
                <Picker.Item label="Sugerencia" value="sugerencia" />
                <Picker.Item label="Otro" value="otro" />
            </Picker>

            <Text style={styles.label}>Descripción:</Text>
            <TextInput
                style={styles.input}
                placeholder="Describe tu reporte aquí"
                multiline
                numberOfLines={4}
                value={descripcion}
                onChangeText={setDescripcion}
            />
            <Text style={styles.label}>Área:</Text>
            <TextInput
                style={styles.input}
                placeholder="Área del reporte"
                value={area}
                onChangeText={setArea}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleAddReport}>
                <Text style={styles.buttonText}>Enviar Reporte</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 15,
    },
    input: {
        height: 100,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    submitButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
