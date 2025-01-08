import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useTimerContext } from '../hooks/useTimerContext';

const RecentTimers = ({ timers = [] }) => {
  const { deleteTimer } = useTimerContext();

  const renderRightActions = (progress, dragX, timer) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
    });

    return (
      <Animated.View
        style={[
          styles.deleteAction,
          {
            transform: [{ translateX: trans }],
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Delete Timer',
              'Are you sure you want to delete this timer?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => deleteTimer(timer.id),
                },
              ]
            );
          }}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Timers</Text>
      {timers.map((timer, index) => (
        <Swipeable
          key={timer.id || index}
          renderRightActions={(progress, dragX) => 
            renderRightActions(progress, dragX, timer)
          }
        >
          <View style={styles.timerItem}>
            <Text style={styles.timerName}>{timer.name || 'Unnamed Timer'}</Text>
            <Text style={styles.duration}>
              {Math.floor(timer.duration / 60)}:
              {(timer.duration % 60).toString().padStart(2, '0')}
            </Text>
          </View>
        </Swipeable>
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
  deleteAction: {
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  deleteButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RecentTimers; 