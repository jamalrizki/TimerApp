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
      name: name || 'New Folder',
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
  createButton: {
    backgroundColor: '#007AFF',
  },
});

export default CreateFolderScreen; 