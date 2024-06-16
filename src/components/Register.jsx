import React, { useState } from 'react';
import { ImageBackground, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import imgfond from '../img/fondo.jpg';
import { BlurView } from 'expo-blur';

export default function Register() {
  const [selectedRole, setSelectedRole] = useState('administrador');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch('http://192.168.1.16:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombreCompleto,
          email,
          password,
          rol: selectedRole,
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();
      Alert.alert('Éxito', data.message); 
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      Alert.alert('Error', 'Error al registrar usuario');
    }
  };

  return (
    <ImageBackground source={imgfond} resizeMode="cover" style={styles.imageBackground}>
      <ScrollView contentContainerStyle={{ flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <BlurView intensity={90}>
          <View style={styles.registerfondo}>
            <View>
              <Text style={styles.textoPrincipal}>Nombre completo</Text>
              <TextInput style={styles.input} placeholder='Nombre completo' value={nombreCompleto} onChangeText={setNombreCompleto} />
            </View>
            <View style={styles.pickerContainer}>
              <Text style={styles.textoPrincipal}>Rol:</Text>
              <Picker
                selectedValue={selectedRole}
                onValueChange={(itemValue) => setSelectedRole(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Administrador" value="administrador" />
                <Picker.Item label="Técnico" value="tecnico" />
              </Picker>
            </View>
            <View>
              <Text style={styles.textoPrincipal}>E-mail</Text>
              <TextInput style={styles.input} placeholder='email@email.com' value={email} onChangeText={setEmail} />
            </View>
            <View>
              <Text style={styles.textoPrincipal}>Password</Text>
              <TextInput style={styles.input} placeholder='password' secureTextEntry={true} value={password} onChangeText={setPassword} />
            </View>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#00CFEB90', marginTop: 20 }]} onPress={handleRegister}>
              <Text style={styles.buttonText}>Registrar</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
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
  registerfondo: {
    width: 350,
    height: 500,
    borderColor: '#fff',
    borderRadius: 10,
    borderWidth: 2,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerContainer: {
    width: 250,
    marginBottom: 10,
  },
  picker: {
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
});
