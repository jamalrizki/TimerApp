import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Button from '../components/Button';

const ContactScreen = () => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:contact@jrizki.com');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Us</Text>
      
      <Text style={styles.description}>
        Have questions, suggestions, or feedback? Feel free to reach out to us:
      </Text>

      <Button
        title="Email Us"
        onPress={handleEmailPress}
        style={styles.emailButton}
      />

      <Text style={styles.footer}>
        We'll get back to you as soon as possible. Cheers! 🍹
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    marginTop: 20,
  },
  description: {
    fontSize: 17,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  emailButton: {
    width: '100%',
    backgroundColor: '#00BFA5',
    marginBottom: 32,
  },
  footer: {
    fontSize: 17,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default ContactScreen; 