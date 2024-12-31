import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTimerContext } from '../hooks/useTimerContext';
import Button from '../components/Button';

const CreateTimerScreen = ({ navigation, route }) => {
  const { folderId } = route.params || {};
  const { saveTimer } = useTimerContext();
  const [name, setName] = useState('');
  const [intervals, setIntervals] = useState([
    { duration: 300, type: 'work' }
  ]);

  const addInterval = (type) => {
    setIntervals([...intervals, { duration: 300, type }]);
  };

  const removeInterval = (index) => {
    setIntervals(intervals.filter((_, i) => i !== index));
  };

  const updateInterval = (index, field, value) => {
    const updatedIntervals = [...intervals];
    if (field === 'duration') {
      const [minutes, seconds] = value.split(':').map(Number);
      const totalSeconds = (minutes * 60) + (seconds || 0);
      updatedIntervals[index] = { ...updatedIntervals[index], duration: totalSeconds };
    } else {
      updatedIntervals[index] = { ...updatedIntervals[index], [field]: value };
    }
    setIntervals(updatedIntervals);
  };

  const handleSave = () => {
    const newTimer = {
      id: Date.now().toString(),
      name: name || 'New Timer',
      duration: intervals.reduce((total, interval) => total + interval.duration, 0),
      intervals,
      createdAt: new Date().toISOString(),
      folderId: folderId,
    };
    saveTimer(newTimer);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Timer Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter timer name"
      />

      <Text style={styles.label}>Intervals</Text>
      {intervals.map((interval, index) => (
        <View key={index} style={styles.intervalContainer}>
          <View style={styles.intervalHeader}>
            <Text style={styles.intervalTitle}>Interval {index + 1}</Text>
            {intervals.length > 1 && (
              <TouchableOpacity onPress={() => removeInterval(index)}>
                <Ionicons name="trash-outline" size={24} color="#F44336" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.durationContainer}>
            <Text style={styles.durationLabel}>Duration (mm:ss)</Text>
            <TextInput
              style={styles.durationInput}
              value={`${Math.floor(interval.duration / 60)}:${(interval.duration % 60).toString().padStart(2, '0')}`}
              onChangeText={(value) => updateInterval(index, 'duration', value)}
              placeholder="05:00"
              keyboardType="numbers-and-punctuation"
            />
          </View>

          <View style={styles.typeContainer}>
            <Text style={styles.typeLabel}>Type</Text>
            <View style={styles.typeButtons}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  interval.type === 'work' && styles.typeButtonActive
                ]}
                onPress={() => updateInterval(index, 'type', 'work')}
              >
                <Text style={interval.type === 'work' ? styles.typeTextActive : styles.typeText}>
                  Work
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  interval.type === 'break' && styles.typeButtonActive
                ]}
                onPress={() => updateInterval(index, 'type', 'break')}
              >
                <Text style={interval.type === 'break' ? styles.typeTextActive : styles.typeText}>
                  Break
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}

      <View style={styles.addButtons}>
        <Button
          title="Add Work Interval"
          onPress={() => addInterval('work')}
          style={styles.addWorkButton}
        />
        <Button
          title="Add Break Interval"
          onPress={() => addInterval('break')}
          style={styles.addBreakButton}
        />
      </View>

      <Button
        title="Save Timer"
        onPress={handleSave}
        style={styles.saveButton}
      />
    </ScrollView>
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
  intervalContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  intervalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  intervalTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  durationContainer: {
    marginBottom: 12,
  },
  durationLabel: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
  durationInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  typeContainer: {
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  typeText: {
    color: '#666',
  },
  typeTextActive: {
    color: '#fff',
  },
  addButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  addWorkButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },
  addBreakButton: {
    flex: 1,
    backgroundColor: '#FFA000',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    marginBottom: 32,
  },
});

export default CreateTimerScreen; 