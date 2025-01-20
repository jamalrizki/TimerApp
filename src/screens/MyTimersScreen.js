import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
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
      <Button 
        title="Create New Routine"
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
    backgroundColor: '#1C1C1E',
  },
  createButton: {
    marginBottom: 16,
    backgroundColor: '#00BFA5',
  },
});

export default MyTimersScreen; 