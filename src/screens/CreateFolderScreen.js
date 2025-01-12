import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useTimerContext } from '../hooks/useTimerContext';
import Button from '../components/Button';

const CreateFolderScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const { saveFolder } = useTimerContext();

  const handleCreate = () => {
    const newFolder = {
      id: Date.now().toString(),
      name: name || 'New Playlist',
      createdAt: new Date().toISOString(),
      timers: [],
    };
    saveFolder(newFolder);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Playlist Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter Playlist name"
        placeholderTextColor="#8E8E93"
      />
      <Button
        title="Create Playlist"
        onPress={handleCreate}
        style={styles.createButton}
      />
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
  createButton: {
    backgroundColor: '#00BFA5',
  },
});

export default CreateFolderScreen; 