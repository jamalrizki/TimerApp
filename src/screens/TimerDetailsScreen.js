import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useTimerContext } from '../hooks/useTimerContext';
import Button from '../components/Button';
import TimePicker from '../components/TimePicker';

const TimerDetailsScreen = ({ route, navigation }) => {
  const { timer } = route.params;
  const { timers, saveTimer, updateTimer } = useTimerContext();
  
  const [name, setName] = useState(timer.name);
  const [duration, setDuration] = useState({
    hours: Math.floor(timer.duration / 3600),
    minutes: Math.floor((timer.duration % 3600) / 60),
    seconds: timer.duration % 60,
  });

  const handleSave = async () => {
    try {
      const totalSeconds = 
        parseInt(duration.hours) * 3600 + 
        parseInt(duration.minutes) * 60 + 
        parseInt(duration.seconds);

      if (isNaN(totalSeconds) || totalSeconds <= 0) {
        Alert.alert('Invalid Duration', 'Please enter a valid duration');
        return;
      }

      const updatedTimer = {
        ...timer,
        name,
        duration: totalSeconds,
        intervals: [{
          duration: totalSeconds,
          type: timer.intervals[0].type
        }]
      };

      await updateTimer(updatedTimer);
      navigation.goBack();
    } catch (error) {
      console.error('Error updating timer:', error);
      Alert.alert('Error', 'Failed to update timer');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Timer',
      'Are you sure you want to delete this timer?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTimer(timer.id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Timer Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Timer name"
      />

      <Text style={styles.label}>Duration</Text>
      <TimePicker
        hours={duration.hours.toString().padStart(2, '0')}
        minutes={duration.minutes.toString().padStart(2, '0')}
        seconds={duration.seconds.toString().padStart(2, '0')}
        onChange={(field, value) => setDuration(prev => ({ ...prev, [field]: value }))}
      />

      <View style={styles.buttonsContainer}>
        <Button
          title="Save Changes"
          onPress={handleSave}
          style={styles.saveButton}
        />
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Text style={styles.deleteButtonText}>Delete Timer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  durationInput: {
    flex: 1,
    textAlign: 'center',
  },
  durationSeparator: {
    fontSize: 24,
    marginHorizontal: 8,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff3b30'
  },
  deleteButtonText: {
    color: '#ff3b30',
    fontSize: 17,
    fontWeight: '500'
  },
  buttonsContainer: {
    gap: 16,
    marginTop: 'auto',
    marginBottom: 16,
  },
});

export default TimerDetailsScreen; 