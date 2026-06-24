import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import Navigation from './src/navigation';
import { Colors } from './src/theme';
import { iniciarBancoDeDados } from './src/database/databaseInit';

export default function App() {
  
  useEffect(() => {
    iniciarBancoDeDados();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.cream} />
      <Navigation />
    </>
  );
}