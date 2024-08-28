import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

export default function EditActivity({ route, navigation }) {
    const { activityId, date } = route.params;
    const [activity, setActivity] = useState(null);
    const [technicians, setTechnicians] = useState([]);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await fetch(`http://192.168.207.3:3000/api/activities/${activityId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) {
                    throw new Error('Error al obtener actividad');
                }
                const data = await response.json();
                setActivity(data);
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'No se pudo cargar la actividad');
            }
        };

        const fetchTechnicians = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await fetch('http://192.168.207.3:3000/api/technicians', {
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

        fetchActivity();
        fetchTechnicians();
    }, [activityId]);

    const handleUpdateActivity = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const formattedActivity = {
                ...activity,
                hora: activity.hora.replace(/:00$/, ''),
            };
            const response = await fetch(`http://192.168.207.3:3000/api/activities/${activityId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(activity),
            });
            if (response.ok) {
                Alert.alert('Éxito', 'La actividad se actualizó correctamente');
                navigation.navigate('ViewActivities', { date }); // Regresar a la vista de actividades
            } else {
                throw new Error('Error al actualizar actividad');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo actualizar la actividad');
        }
    };

    return (
        <View style={styles.container}>
            {activity && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Título"
                        value={activity.titulo}
                        onChangeText={(text) => setActivity({ ...activity, titulo: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Descripción"
                        value={activity.descripcion}
                        onChangeText={(text) => setActivity({ ...activity, descripcion: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Hora (HH:mm)"
                        value={activity.hora}
                        onChangeText={(text) => setActivity({ ...activity, hora: text })}
                    />
                    <Picker
                        selectedValue={activity.technician?.id}
                        onValueChange={(itemValue) => setActivity({ ...activity, technician: { id: itemValue } })}
                    >
                        {technicians.map((technician) => (
                            <Picker.Item key={technician.id} label={technician.name} value={technician.id} />
                        ))}
                    </Picker>

                    <TouchableOpacity style={styles.updateButton} onPress={handleUpdateActivity}>
                        <Text style={styles.buttonText}>Actualizar Actividad</Text>
                    </TouchableOpacity>
                </>
            )}
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
    updateButton: {
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
