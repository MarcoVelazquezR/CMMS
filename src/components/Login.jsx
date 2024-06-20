import React, { useState } from 'react';
import { Image, ImageBackground, Text, StyleSheet, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import imgperf from '../img/logodifem.jpeg';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import imgfond from '../img/fondo.jpg';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('http://192.168.1.17:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error de inicio de sesión');
            }

            const data = await response.json();
            await AsyncStorage.setItem('token', data.token); 

            Alert.alert('Éxito', 'Inicio de sesión exitoso');
            navigation.replace('Principal');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };
    return (
        <ImageBackground source={imgfond} resizeMode="cover" style={styles.imageBackground}>
            <ScrollView contentContainerStyle={{
                flex: 1,
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <BlurView intensity={90}>
                    <View style={styles.loginfondo}>
                        <Image source={imgperf} style={styles.profilePicture} />
                        <View>
                            <Text style={styles.textoPrincipal}>E-mail</Text>
                            <TextInput style={styles.input}
                                placeholder='email@email.com'
                                value={email}
                                onChangeText={setEmail} />
                        </View>
                        <View>
                            <Text style={styles.textoPrincipal}>Password</Text>
                            <TextInput style={styles.input}
                                placeholder='password'
                                secureTextEntry={true}
                                value={password}
                                onChangeText={setPassword} />
                        </View>
                        <TouchableOpacity style={[styles.button, { backgroundColor: '#00CFEB90', marginTop: 20 }]} onPress={handleLogin}>
                            <Text style={styles.buttonText}>Iniciar Sesión</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, { backgroundColor: '#6792F090' }]} onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.buttonText}>Registrarse</Text>
                        </TouchableOpacity>
                    </View>
                </BlurView>
            </ScrollView>
        </ImageBackground >
    );
}

const styles = StyleSheet.create({
    loginfondo: {
        width: 350,
        height: 500,
        borderColor: '#fff',
        borderRadius: 10,
        borderWidth: 2,
        padding: 10,
        alignItems: 'center',
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderColor: '#fff',
        borderWidth: 1,
        marginVertical: 30,
    },
    textoPrincipal: {
        fontSize: 17,
        fontWeight: '400',
        color: 'white',
    },
    input: {
        width: 250,
        height: 40,
        borderColor: '#fff',
        borderWidth: 2,
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        backgroundColor: '#ffffff90',
        marginBottom: 10,
    },
    button: {
        width: 250,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        borderColor: '#fff',
        borderWidth: 1,
        marginTop: 5,
    },
    imageBackground: {
        flex: 1,
    },
});
