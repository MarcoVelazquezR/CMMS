import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './src/components/Login';
import Register from './src/components/Register';
import Principal from './src/components/Principal';
import ViewActivities from './src/components/ViewActivities';
import AddActivity from './src/components/AddActivity';
import EditActivity from './src/components/EditActivity';
import ActionSelectionScreen from './src/components/ActionSelectionScreen';
import imgfond from './src/img/fondo.jpg';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRouteName, setInitialRouteName] = useState('Login');

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setInitialRouteName('Principal');
      }
    };
    checkToken();
  }, []);

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRouteName}>
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
          <Stack.Screen name="Principal" component={Principal} options={{ headerShown: false }} />
          <Stack.Screen name="ViewActivities" component={ViewActivities} options={{ title: 'Actividades' }} />
          <Stack.Screen name="AddActivity" component={AddActivity} options={{ title: 'Agregar Actividad' }} />
          <Stack.Screen name="EditActivity" component={EditActivity} options={{ title: 'Editar Actividad' }} />
          <Stack.Screen name="ActionSelectionScreen" component={ActionSelectionScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
