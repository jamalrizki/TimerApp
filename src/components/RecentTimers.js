import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RecentTimers = ({ timers = [] }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Timers</Text>
      {timers.map((timer, index) => (
        <View key={timer.id || index} style={styles.timerItem}>
          <Text>{timer.name || 'Unnamed Timer'}</Text>
        </View>
      ))}
      {timers.length === 0 && (
        <Text style={styles.emptyText}>No recent timers</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  timerItem: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  emptyText: {
    color: '#666',
    fontStyle: 'italic',
  },
});

export default RecentTimers; 