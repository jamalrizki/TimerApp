import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RecentTimers = ({ timers = [] }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Timers</Text>
      {timers.map((timer, index) => (
        <TouchableOpacity
          key={timer.id || index}
          style={styles.timerItem}
          onPress={() => navigation.navigate('My Timers', {
            screen: 'FolderDetail',
            params: { 
              folder: {
                id: timer.folderId,
                name: timer.name
              }
            }
          })}
        >
          <Text style={styles.timerName}>{timer.name || 'Unnamed Timer'}</Text>
          <Text style={styles.duration}>
            {Math.floor(timer.duration / 60)}:
            {(timer.duration % 60).toString().padStart(2, '0')}
          </Text>
        </TouchableOpacity>
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
    backgroundColor: '#1C1C1E',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#fff',
  },
  timerItem: {
    padding: 12,
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerName: {
    fontSize: 16,
    color: '#fff',
  },
  duration: {
    color: '#8E8E93',
    fontSize: 14,
  },
  emptyText: {
    color: '#8E8E93',
    fontStyle: 'italic',
  },
});

export default RecentTimers; 