import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

export default function AddActivity({ route, navigation }) {
    const { date } = route.params;
    const [technicians, setTechnicians] = useState([]);
    const [newActivity, setNewActivity] = useState({
        title: '',
        description: '',
        time: '',
        technicianId: null,
        date: date,
    });

    useEffect(() => {
        const fetchTechnicians = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await fetch('http://10.224.5.140:3000/api/technicians', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) {
                    throw new Error('Error al obtener técnicos');
                }
                const data = await response.json();
                setTechnicians(data);
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'No se pudieron cargar los técnicos');
            }
        };

        fetchTechnicians();
    }, []);

    const handleAddActivity = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('http://10.224.5.140:3000/api/activities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newActivity),
            });

            if (!response.ok) {
                const errorData = await response.json(); 
                throw new Error(errorData.error || 'Error al agregar actividad');
            }

            Alert.alert('Éxito', 'Actividad agregada correctamente');

            if (navigation.canGoBack()) {
                navigation.goBack();
            } else {
                navigation.navigate('Principal');
            }
        } catch (error) {
            console.error('Error al agregar actividad:', error);
            Alert.alert('Error', error.message); // Muestra el mensaje de error detallado
        }
    };


    return (
        <View style={styles.container}>
            <ScrollView>
                <TextInput
                    style={styles.input}
                    placeholder="Título"
                    value={newActivity.title}
                    onChangeText={(text) => setNewActivity({ ...newActivity, title: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Descripción"
                    value={newActivity.description}
                    onChangeText={(text) => setNewActivity({ ...newActivity, description: text })}
                    multiline
                />
                <TextInput
                    style={styles.input}
                    placeholder="Hora (HH:mm)"
                    value={newActivity.time}
                    onChangeText={(text) => setNewActivity({ ...newActivity, time: text })}
                />
                <Picker
                    style={styles.picker}
                    selectedValue={newActivity.technicianId} 
                    onValueChange={(itemValue) => setNewActivity({ ...newActivity, technicianId: itemValue })}
                    mode="dropdown" 
                >
                    <Picker.Item key={0} label="Seleccionar Técnico" value={null} />
                    {Array.isArray(technicians) && technicians.map((technician) => (
                        <Picker.Item key={technician.id} label={technician.name} value={technician.id} />
                    ))}
                </Picker>

                <TouchableOpacity style={styles.saveButton} onPress={handleAddActivity}>
                    <Text style={styles.buttonText}>Guardar Actividad</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Principal')}>
                    <Text style={styles.buttonText}>Volver</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    backButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
    },
});
