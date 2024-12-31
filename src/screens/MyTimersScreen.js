import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTimerContext } from '../hooks/useTimerContext';
import Button from '../components/Button';
import FolderList from '../components/FolderList';

const MyTimersScreen = ({ navigation }) => {
  const { loading, timers, folders } = useTimerContext();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Timers</Text>
      <Button 
        title="Create New Folder" 
        onPress={() => navigation.navigate('CreateFolder')}
        style={styles.createButton}
      />
      <FolderList 
        navigation={navigation}
        folders={folders || []}
        timers={timers || []}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  createButton: {
    marginBottom: 16,
  },
});

export default MyTimersScreen; 