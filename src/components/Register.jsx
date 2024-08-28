import React, { useState } from 'react';
import { ImageBackground, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import imgfond from '../img/fondo.jpg';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';

export default function Register() {
  const navigation = useNavigation();
  const [selectedRole, setSelectedRole] = useState('administrador');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleRegister = async () => {
    const newErrors = {};
    if (!nombreCompleto.trim()) newErrors.nombreCompleto = 'El nombre es obligatorio';
    if (!validateEmail(email)) newErrors.email = 'El email no es válido';
    if (password.length < 8) newErrors.password = 'La contraseña debe tener al menos 8 caracteres';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch('http://192.168.207.3:3000/api/register', {
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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la respuesta del servidor');
      }
      const data = await response.json();
      Alert.alert('Éxito', data.message);
      navigation.replace('Login');
    } catch (error) {
      console.error('Error al registrar usuario:', error.message);
      Alert.alert('Error', error.message);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <ImageBackground source={imgfond} resizeMode="cover" style={styles.imageBackground}>
      <ScrollView contentContainerStyle={{ flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <BlurView intensity={90}>
          <View style={styles.registerfondo}>
            <View>
              <Text style={styles.textoPrincipal}>Nombre completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre completo"
                value={nombreCompleto}
                onChangeText={setNombreCompleto}
              />
              {errors.nombreCompleto && <Text style={styles.errorText}>{errors.nombreCompleto}</Text>}
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
                <Picker.Item label="Usuario" value="usuario" />
              </Picker>
            </View>
            <View>
              <Text style={styles.textoPrincipal}>E-mail</Text>
              <TextInput
                style={styles.input}
                placeholder="email@email.com"
                value={email}
                onChangeText={setEmail}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View>
              <Text style={styles.textoPrincipal}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
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
