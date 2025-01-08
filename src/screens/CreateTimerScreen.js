import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTimerContext } from '../hooks/useTimerContext';
import Button from '../components/Button';
import { timerTemplates } from '../constants/timerTemplates';
import TimePicker from '../components/TimePicker';

const CreateTimerScreen = ({ navigation, route }) => {
  const { folderId, template } = route.params || {};
  const { saveTimer } = useTimerContext();
  const [name, setName] = useState(template ? template.name : '');
  const [duration, setDuration] = useState({
    hours: '00',
    minutes: '05',
    seconds: '00'
  });

  const handleSave = () => {
    const totalSeconds = 
      (parseInt(duration.hours) * 3600) + 
      (parseInt(duration.minutes) * 60) + 
      parseInt(duration.seconds);

    const newTimer = {
      id: Date.now().toString(),
      name: name || 'New Timer',
      duration: totalSeconds,
      createdAt: new Date().toISOString(),
      folderId: folderId,
    };
    saveTimer(newTimer);
    navigation.goBack();
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
        hours={duration.hours}
        minutes={duration.minutes}
        seconds={duration.seconds}
        onChange={(field, value) => setDuration(prev => ({ ...prev, [field]: value }))}
      />

      <View style={styles.buttonsContainer}>
        <Button
          title="Save Changes"
          onPress={handleSave}
          style={styles.saveButton}
        />
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
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    marginBottom: 32,
  },
});

export default CreateTimerScreen; 