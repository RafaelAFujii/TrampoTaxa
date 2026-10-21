import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const ContractorGigsScreen: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Vagas do contratante</Text>
    <Text style={styles.subtitle}>Lista de turnos e candidatos.</Text>
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
