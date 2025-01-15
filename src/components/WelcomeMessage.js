import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';

const WelcomeMessage = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.heroContainer}>
          <Image
            source={require('../../assets/hour-glass.jpeg')}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <Text style={styles.overlayText}>OmniTimer</Text>
        </View>
        <Text style={styles.title}>Welcome to OmniTimer</Text>
        <Text style={styles.subtitle}>
          The multi-purpose interval app that adapts to you. From fitness and meditation to Pomodoro and more, get started now and make every second count.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  container: {
    padding: 16,
  },
  heroContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  heroImage: {
    width: '100%',
    height: 230,
    borderRadius: 12,
  },
  overlayText: {
    position: 'absolute',
    bottom: 4,
    left: 2,
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
});

export default WelcomeMessage; 