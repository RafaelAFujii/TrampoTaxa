import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const CreateGigScreen: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Criar vaga</Text>
    <Text style={styles.subtitle}>Formulario de criação de turno.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0B0E',
    padding: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#8E95A5',
    fontSize: 14,
    textAlign: 'center',
  },
});
