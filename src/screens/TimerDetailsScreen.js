import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useTimerContext } from '../hooks/useTimerContext';
import Button from '../components/Button';
import TimePicker from '../components/TimePicker';

const TimerDetailsScreen = ({ route, navigation }) => {
  const { timer, folderId } = route.params;
  const isEditing = !!timer;
  const { timers, saveTimer, updateTimer, deleteTimer } = useTimerContext();
  
  const [name, setName] = useState(timer?.name || '');
  const [description, setDescription] = useState(timer?.description || '');
  const [duration, setDuration] = useState({
    hours: timer ? Math.floor(timer.duration / 3600) : 0,
    minutes: timer ? Math.floor((timer.duration % 3600) / 60) : 5,
    seconds: timer ? timer.duration % 60 : 0,
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

      if (isEditing) {
        const updatedTimer = {
          ...timer,
          name,
          description,
          duration: totalSeconds,
        };
        await updateTimer(updatedTimer);
      } else {
        const newTimer = {
          id: Date.now().toString(),
          name: name || 'New Timer',
          description: description || 'Work',
          duration: totalSeconds,
          createdAt: new Date().toISOString(),
          folderId: folderId,
        };
        await saveTimer(newTimer);
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving timer:', error);
      Alert.alert('Error', 'Failed to save timer');
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
      <Text style={styles.label}>{isEditing ? 'Edit Timer' : 'New Timer'}</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Timer name"
        placeholderTextColor="#8E8E93"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Timer description (e.g., 'Warm up', 'Sprint')"
        placeholderTextColor="#8E8E93"
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
          title={isEditing ? "Save Changes" : "Create Timer"}
          onPress={handleSave}
          style={styles.saveButton}
        />
        {isEditing && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Text style={styles.deleteButtonText}>Delete Timer</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1C1C1E',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#2C2C2E',
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#fff',
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
    backgroundColor: '#00BFA5',
  },
  deleteButton: {
    backgroundColor: '#2C2C2E',
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