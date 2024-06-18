import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

LocaleConfig.locales['es'] = {
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
};
LocaleConfig.defaultLocale = 'es';

export default function Principal() {
    const [selectedDate, setSelectedDate] = useState('');
    const [activities, setActivities] = useState({});
    const [technicians, setTechnicians] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => { // Función para cargar datos iniciales
        try {
            await Promise.all([fetchActivities(), fetchTechnicians()]); // Carga en paralelo
        } catch (error) {
            console.error('Error al cargar datos iniciales:', error);
            Alert.alert('Error', 'No se pudieron cargar los datos iniciales');
        }
    };

    const fetchActivities = async () => {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch('http://192.168.1.12:3000/api/activities', {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setActivities(data);
    };

    const fetchTechnicians = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('http://192.168.1.12:3000/api/technicians', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) { // Check if the request was successful
                throw new Error(`Error fetching technicians: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // Ensure data is an array before filtering
            if (Array.isArray(data)) {
                setTechnicians(data.filter(user => user.rol === 'tecnico'));
            } else {
                // Handle the case where data is not an array (e.g., an error object)
                console.error('Error fetching technicians: Unexpected response format', data);
                // You might want to display an error message to the user or log the error
                Alert.alert('Error', 'Unexpected error fetching technicians.');
            }
        } catch (error) {
            console.error('Error fetching technicians:', error);
            // Display an error message to the user
            Alert.alert('Error', 'An error occurred while fetching technicians.');
        }
    };

    const markedDates = Object.keys(activities).reduce((acc, date) => {
        acc[date] = { marked: true, dotColor: 'blue' };
        return acc;
    }, {});

    const fetchActivitiesForDate = async (dateString) => {  // Recibe dateString como parámetro
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`http://192.168.1.12:3000/api/activities?date=${dateString}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) {
                throw new Error('Error al obtener actividades');
            }
            const data = await response.json();
            setActivities((prevActivities) => ({
                ...prevActivities,
                [dateString]: data,
            }));
            setModalVisible(true);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudieron cargar las actividades');
        }
    };

    const onDayPress = (day) => {
        setSelectedDate(day.dateString);
        navigation.navigate('ActionSelectionScreen', { date: day.dateString });
    };

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Calendar
                onDayPress={onDayPress}
                markedDates={markedDates}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        marginTop: 20,
    },
    calendar: {
        marginBottom: 16,
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
    button: {
        backgroundColor: '#007AFF', // Azul iOS
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    modalContent: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
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
        backgroundColor: '#4CAF50', // Verde
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    cancelButton: {
        backgroundColor: '#f44336', // Rojo
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    modalButton: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});