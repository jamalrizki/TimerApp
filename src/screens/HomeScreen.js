import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTimerContext } from '../hooks/useTimerContext';
import RecentTimers from '../components/RecentTimers';
import WelcomeMessage from '../components/WelcomeMessage';

const HomeScreen = () => {
  const { timers, loading, recentTimers } = useTimerContext();

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
      <RecentTimers timers={recentTimers} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
});

export default HomeScreen; 