import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

export default function EditActivity({ route, navigation }) {
    const { activityId, date } = route.params;
    const [technicians, setTechnicians] = useState([]);
    const [activity, setActivity] = useState({
        title: '',
        description: '',
        time: '',
        technicianId: null,
        date: date,
    });

    useEffect(() => {
        fetchActivity();
        fetchTechnicians();
    }, [activityId]);

    const fetchActivity = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`http://10.224.5.140:3000/api/activities/${activityId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) {
                throw new Error('Error al obtener actividad');
            }
            const data = await response.json();
            data.technicians = data.technicians.map(technician => technician.id);
            setActivity(data);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo cargar la actividad');
        }
    };

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

    const handleEditActivity = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`http://10.224.5.140:3000/api/activities/${activityId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(activity),
            });
            if (!response.ok) {
                throw new Error('Error al editar actividad');
            }
            Alert.alert('Éxito', 'Actividad editada correctamente');
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo editar la actividad');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <TextInput
                    style={styles.input}
                    placeholder="Título"
                    value={activity.title}
                    onChangeText={(text) => setActivity({ ...activity, title: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Descripción"
                    value={activity.description}
                    onChangeText={(text) => setActivity({ ...activity, description: text })}
                    multiline
                />
                <TextInput
                    style={styles.input}
                    placeholder="Hora (HH:mm)"
                    value={activity.time}
                    onChangeText={(text) => setActivity({ ...activity, time: text })}
                />
                <Picker
                    style={styles.picker}
                    selectedValue={activity.technicianId}
                    onValueChange={(itemValue) => setActivity({ ...activity, technicianId: itemValue })}
                    mode="dropdown"
                >
                    <Picker.Item key={0} label="Seleccionar Técnico" value={null} />
                    {Array.isArray(technicians) && technicians.map((technician) => (
                        <Picker.Item key={technician.id} label={technician.name} value={technician.id} />
                    ))}
                </Picker>

                <TouchableOpacity style={styles.saveButton} onPress={handleEditActivity}>
                    <Text style={styles.buttonText}>Guardar Cambios</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Volver</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

// Estilos
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
