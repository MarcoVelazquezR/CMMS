import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function ViewActivities({ route, navigation }) {
    const { date } = route.params;
    const [activities, setActivities] = useState([]);

    const fetchActivitiesForDate = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`http://192.168.1.12:3000/api/activities?date=${date}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error('Error al obtener actividades');
            }

            const data = await response.json();
            setActivities(data);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudieron cargar las actividades');
        }
    };
    useFocusEffect(
        useCallback(() => {
            fetchActivitiesForDate();
        }, [date])
    );

    const handleEditActivity = (activityId) => {
        navigation.navigate('EditActivity', { activityId, date });
    };

    const handleDeleteActivity = async (activityId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`http://192.168.1.12:3000/api/activities/${activityId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                fetchActivitiesForDate(date);
            } else {
                throw new Error('Error al eliminar actividad');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo eliminar la actividad');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Actividades para {date}</Text>

            <ScrollView style={styles.activityList}>
                {activities?.length > 0 ? (
                    activities.map((activity) => (
                        <View key={activity.id} style={styles.activityItem}>
                            <Text style={styles.activityTitle}>{activity.titulo}</Text>
                            <Text>{activity.descripcion}</Text>
                            <Text>Hora: {activity.hora.replace(/:00$/, '')}</Text>
                            <Text>Técnico: {activity.technician ? activity.technician.name : 'No asignado'}</Text>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.editButton} onPress={() => handleEditActivity(activity.id)}>
                                    <Text style={styles.buttonText}>Editar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteActivity(activity.id)}>
                                    <Text style={styles.buttonText}>Eliminar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noActivitiesText}>No hay actividades para esta fecha.</Text>
                )}
            </ScrollView>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Principal')}>
                <Text style={styles.buttonText}>Volver</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    activityList: {
        flex: 1,
    },
    activityItem: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    activityTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    noActivitiesText: {
        textAlign: 'center',
        marginTop: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    editButton: {
        backgroundColor: 'green',
        padding: 8,
        borderRadius: 5,
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 8,
        borderRadius: 5,
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
