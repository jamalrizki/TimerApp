import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const IdeasScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ideas</Text>
      <Text style={styles.subtitle}>Coming soon!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default IdeasScreen; 