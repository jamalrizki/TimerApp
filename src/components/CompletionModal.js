import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

const CompletionModal = ({ onComplete }) => {
  const animation = useRef(null);

  useEffect(() => {
    animation.current?.play();
    // Wait for animation to finish before navigating back
    const timer = setTimeout(() => {
      onComplete();
    }, 2000); // Adjust timing based on your animation duration

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        ref={animation}
        source={require('../../assets/completion.json')}
        style={styles.animation}
        autoPlay
        loop={false}
      />
      <Text style={styles.text}>Great Job!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  animation: {
    width: Dimensions.get('window').width * 0.7,
    height: Dimensions.get('window').width * 0.7,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
  },
});

export default CompletionModal; 