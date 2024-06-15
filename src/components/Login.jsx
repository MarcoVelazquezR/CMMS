import React from 'react';
import { Image, Text, StyleSheet, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import imgperf from '../img/logodifem.jpeg';
import { BlurView } from 'expo-blur';

export default function Login() {
    return (
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
                        <TextInput style={styles.input} placeholder='email@email.com' />
                    </View>
                    <View>
                        <Text style={styles.textoPrincipal}>Password</Text>
                        <TextInput style={styles.input} placeholder='password' secureTextEntry={true} />
                    </View>
                    <TouchableOpacity style={[styles.button, { backgroundColor: '#00CFEB90', marginTop: 20 }]}>
                        <Text style={styles.buttonText}>Iniciar Sesión</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, { backgroundColor: '#6792F090' }]}>
                        <Text style={styles.buttonText}>Registrarse</Text>
                    </TouchableOpacity>
                </View>
            </BlurView>
        </ScrollView>
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
});
