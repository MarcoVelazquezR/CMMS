import React from 'react';
import { Image, StyleSheet, View} from 'react-native';
import imgfond from './src/img/fondo.jpg';
import Login from './src/components/Login';

export default function App() {
  return (
    <View style={styles.container}>
      <Image source={imgfond} style={[styles.imgfondo, StyleSheet.absoluteFill]} />
      <Login />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgfondo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});