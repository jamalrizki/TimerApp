import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import * as Speech from 'expo-speech';

const Countdown = ({ onComplete }) => {
  const [count, setCount] = useState(3);
  const scaleAnim = new Animated.Value(1);

  useEffect(() => {
    if (count > 0) {
      // Animate the number
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();

      // Decrease count after 1 second
      const timer = setTimeout(() => {
        setCount(count - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [count]);

  if (count === 0) return null;

  return (
    <View style={styles.container}>
      <Animated.Text 
        style={[
          styles.number,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        {count}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  number: {
    fontSize: 120,
    fontWeight: 'bold',
    color: '#00BFA5',
  },
});

export default Countdown; 