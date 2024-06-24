import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Alert, ImageBackground, ScrollView } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import imgfond from '../img/fondo.jpg';
import AddReport from './AddReport';
import AddActivity from './AddActivity';

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
    const [reporteModalVisible, setReporteModalVisible] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [userName, setUserName] = useState('');
    const navigation = useNavigation();
    const [userReports, setUserReports] = useState([]);
    const [selectedReportId, setSelectedReportId] = useState(null);
    const [showCalendarForAssignment, setShowCalendarForAssignment] = useState(false);
    const [allReports, setAllReports] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            fetchInitialData();
            fetchUserName();
            getUserRole();
            fetchReportsBasedOnRole();
        }, [userRole]) // Dependencia para recargar solo cuando cambia el rol
    );

    const fetchReportsBasedOnRole = async () => {
        if (userRole === 'usuario') {
            fetchUserReports();
        } else if (userRole === 'administrador') {
            fetchReports();
        }
    };

    const fetchInitialData = async () => {
        try {
            await Promise.all([fetchActivities(), fetchTechnicians()]);
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

            if (!response.ok) {
                throw new Error(`Error fetching technicians: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (Array.isArray(data)) {
                setTechnicians(data.filter(user => user.rol === 'tecnico'));
            } else {
                console.error('Error fetching technicians: Unexpected response format', data);
                Alert.alert('Error', 'Unexpected error fetching technicians.');
            }
        } catch (error) {
            console.error('Error fetching technicians:', error);
            Alert.alert('Error', 'An error occurred while fetching technicians.');
        }
    };

    const fetchUserName = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('http://192.168.1.12:3000/api/user-profile', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setUserName(data.nombre_completo);
        } catch (error) {
            Alert.alert(error);
        }
    };

    const getUserRole = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('http://192.168.1.12:3000/api/user-profile', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setUserRole(data.rol);
        } catch (error) {
            console.error('Error fetching user role:', error);
            Alert.alert('Error', 'An error occurred while fetching user information.');
        }
    };

    const markedDates = Object.keys(activities).reduce((acc, date) => {
        acc[date] = { marked: true, dotColor: 'blue' };
        return acc;
    }, {});

    const fetchActivitiesForDate = async (dateString) => {
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

    const fetchUserReports = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('http://192.168.1.12:3000/api/reportes/usuario', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error('Error al obtener los reportes del usuario');
            }
            const data = await response.json();
            setUserReports(data);
        } catch (error) {
            Alert.alert('Error', 'An error occurred while fetching user reports.');
        }
    };

    const fetchReports = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('http://192.168.1.12:3000/api/reportes/admin', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error('Error al obtener los reportes');
            }
            const data = await response.json();
            setAllReports(data);
        } catch (error) {
            Alert.alert('Error', 'An error occurred while fetching reports.');
        }
    };

    const onDayPress = (day) => {
        if (userRole === 'administrador') {
            setSelectedDate(day.dateString);
            navigation.navigate('ActionSelectionScreen', { date: day.dateString });
        }
    };

    const handleAssignTask = (reportId) => {
        setSelectedReportId(reportId);
        setShowCalendarForAssignment(true);
        Alert.alert('Asignar Técnico', 'Selecciona una fecha para programar la actividad.');
    };

    const onDayPressForAssignment = (day) => {
        navigation.navigate('AddActivity', { date: day.dateString, reportID: selectedReportId });
        setShowCalendarForAssignment(false);
    };

    const onReporteModalClose = () => {
        setReporteModalVisible(false);
        setTimeout(() => {
            fetchReportsBasedOnRole();
        }, 0);
    };

    const handleCompleteTask = async (reportId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`http://192.168.1.12:3000/api/reportes/${reportId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ estado: 'resuelto' }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response from server:', errorData); // Registrar la respuesta completa
                throw new Error(errorData.error || 'Error al completar el reporte');
            }

            Alert.alert('Éxito', 'Reporte completado');
            fetchReportsBasedOnRole(); // Recargar los reportes después de actualizar
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <ImageBackground source={imgfond} resizeMode="cover" style={styles.imageBackground}>
            <ScrollView>
                <View style={styles.headerContainer}>
                    <Text style={styles.welcomeText}>Bienvenido, {typeof userName === 'string' ? userName : ''}</Text>
                    <TouchableOpacity style={styles.cerrarSesion} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.buttonText}>Cerrar Sesión</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.calendarOrReportContainer}>
                    {showCalendarForAssignment ? (
                        <Calendar
                            onDayPress={onDayPressForAssignment}
                            markedDates={markedDates}
                        />
                    ) : userRole !== 'usuario' ? (
                        <Calendar
                            onDayPress={onDayPress}
                            markedDates={markedDates}
                        />
                    ) : (
                        <ScrollView style={styles.reportContainer}>
                            <Text style={styles.userReports}>Tus reportes:</Text>
                            {userReports.map((reporte) => (
                                <View key={reporte.id} style={styles.reporteItem}>
                                    <Text style={styles.reporteTitle}>{reporte.tipo_reporte}: {reporte.descripcion}</Text>
                                    <Text>Estado: {reporte.estado}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    )}
                    {userRole === 'administrador' && (
                        <ScrollView style={styles.reportContainer}>
                            <Text style={styles.userReports}>Reportes de todos los usuarios:</Text>
                            {allReports.map((reporte) => (
                                <View key={reporte.id} style={styles.reporteItem}>
                                    <Text style={styles.reporteTitle}>{reporte.tipo_reporte}: {reporte.descripcion}</Text>
                                    <Text>Usuario: {reporte.nombre_usuario}</Text>
                                    <Text>Área: {reporte.area}</Text>
                                    <Text>Estado: {reporte.estado}</Text>
                                    {reporte.estado === 'pendiente' && (
                                        <TouchableOpacity onPress={() => handleAssignTask(reporte.id)} style={styles.assignButton}>
                                            <Text style={styles.buttonText}>Asignar Técnico</Text>
                                        </TouchableOpacity>
                                    )}
                                    {reporte.estado === 'en_progreso' && (
                                        <TouchableOpacity onPress={() => handleCompleteTask(reporte.id)} style={styles.completeButton}>
                                            <Text style={styles.buttonText}>Completado</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ))}
                        </ScrollView>
                    )}
                    {userRole === 'usuario' && (
                        <TouchableOpacity style={styles.addReportButton} onPress={() => setReporteModalVisible(true)}>
                            <Text style={styles.buttonText}>Crear Reporte</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <Modal visible={reporteModalVisible} animationType="slide">
                    <AddReport onClose={onReporteModalClose} />
                </Modal>
            </ScrollView>
        </ImageBackground>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        marginTop: 5,
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
        backgroundColor: '#007AFF',
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
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    cancelButton: {
        backgroundColor: '#f44336',
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
    imageBackground: {
        flex: 1,
    },
    cerrarSesion: {
        backgroundColor: '#007AFF',
        padding: 12,
        width: 120,
        marginLeft: 12,
        borderRadius: 8,
        marginTop: 50,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        marginTop: 10,
    },
    welcomeText: {
        fontSize: 18,
        marginTop: 45,
        marginLeft: 5,
        color: 'white',
        fontWeight: 'bold',
    },
    userReports: {
        fontSize: 18,
        marginTop: 45,
        marginLeft: 5,
        color: 'black',
        fontWeight: 'bold',
    },
    addReportButton: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    reporteItem: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    reporteTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    assignButton: {
        backgroundColor: '#4CAF50',
        padding: 8,
        borderRadius: 5,
        marginTop: 5,
        alignSelf: 'flex-start',
    },
    calendarOrReportContainer: {
        flex: 1,
        padding: 16,
        marginTop: 5,
    },
    calendarOrReportContainer: {
        padding: 16,
        marginTop: 5,
    },
    reporteEstadoResuelto: {
        backgroundColor: 'green',
        color: 'white',
        padding: 5,
        borderRadius: 5,
    },
    completeButton: {
        backgroundColor: 'green',
        padding: 8,
        borderRadius: 5,
        marginTop: 5,
        alignSelf: 'flex-start',
    },
});
