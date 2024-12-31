import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTimerContext } from '../hooks/useTimerContext';
import RecentTimers from '../components/RecentTimers';
import WelcomeMessage from '../components/WelcomeMessage';

const HomeScreen = () => {
  const { timers, loading } = useTimerContext();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <WelcomeMessage />
      <RecentTimers timers={timers.slice(0, 3)} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default HomeScreen; 