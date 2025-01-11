import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTimerContext } from '../hooks/useTimerContext';

const MoreScreen = ({ navigation }) => {
  const { setTimers, setFolders } = useTimerContext();

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will reset all your timers and history. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              const currentSound = await AsyncStorage.getItem('selectedSound') || 'voice';
              await AsyncStorage.clear();
              await AsyncStorage.setItem('selectedSound', currentSound);
              setTimers([]);
              setFolders([]);
              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => navigation.navigate('Sounds')}
      >
        <View style={styles.menuItemContent}>
          <Ionicons name="musical-note-outline" size={24} color="#00BFA5" />
          <Text style={styles.menuItemText}>Timer Sounds</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#8E8E93" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => navigation.navigate('Calendar')}
      >
        <View style={styles.menuItemContent}>
          <Ionicons name="calendar-outline" size={24} color="#00BFA5" />
          <Text style={styles.menuItemText}>Session History</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#8E8E93" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.menuItem, styles.dangerItem]} 
        onPress={handleClearData}
      >
        <View style={styles.menuItemContent}>
          <Ionicons name="trash-outline" size={24} color="#FF453A" />
          <Text style={[styles.menuItemText, styles.dangerText]}>Clear Data</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#FF453A" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1C1C1E',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    marginBottom: 12,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  dangerItem: {
    marginTop: 'auto',
    marginBottom: 32,
  },
  dangerText: {
    color: '#FF453A',
  },
});

export default MoreScreen; 