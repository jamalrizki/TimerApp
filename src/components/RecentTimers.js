import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { timerTemplates } from '../constants/timerTemplates';

const RecentTimers = ({ timers = [] }) => {
  const navigation = useNavigation();

  const handleTimerPress = (timer) => {
    // If timer has presetId, it's a preset template
    if (timer.presetId) {
      navigation.navigate('Explore', {
        screen: 'Timer',
        initial: false,
        params: {
          timer: timer.sequence ? timer.sequence[0] : timer,
          sequence: timer.sequence || [timer],
          currentIndex: 0,
          fromRecent: true
        }
      });
    } else if (timer.folderId) {
      // If it's a playlist timer, navigate to the playlist
      navigation.navigate('My Timers', {
        screen: 'PlaylistDetail',
        params: {
          folder: {
            id: timer.folderId,
            name: timer.name,
            timers: []
          }
        }
      });
    } else {
      // If it's a single custom timer
      navigation.navigate('My Timers', {
        screen: 'Timer',
        params: {
          timer: timer,
          sequence: [timer],
          currentIndex: 0
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Timers</Text>
      {timers.map((timer, index) => {
        // Find if timer is part of a preset
        const preset = timerTemplates.find(template => 
          template.timers.some(t => t.id === timer.id)
        );
        
        return (
          <TouchableOpacity
            key={timer.id || index}
            style={styles.timerItem}
            onPress={() => handleTimerPress(timer)}
          >
            <Text style={styles.timerName}>
              {preset ? preset.name : (timer.name || 'Unnamed Timer')}
            </Text>
            <TouchableOpacity 
              style={styles.playButton}
              onPress={() => handleTimerPress(timer)}
            >
              <Ionicons name="play" size={20} color="#00BFA5" />
            </TouchableOpacity>
          </TouchableOpacity>
        );
      })}
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
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RecentTimers; 