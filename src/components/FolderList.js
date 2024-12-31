import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTimerContext } from '../hooks/useTimerContext';
import { useNavigation } from '@react-navigation/native';

const FolderList = ({ folders, timers, navigation }) => {
  if (!folders || !timers) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Folders</Text>
      </View>
      {folders.length === 0 ? (
        <Text style={styles.emptyText}>No folders yet</Text>
      ) : (
        folders.map((folder) => {
          const folderTimers = timers.filter(timer => 
            timer.folderId === folder.id || (folder.timers || []).includes(timer.id)
          );
          
          return (
            <TouchableOpacity 
              key={folder.id}
              style={styles.folderItem}
              onPress={() => navigation.navigate('FolderDetail', { folder })}
            >
              <Ionicons name="folder-outline" size={24} color="#007AFF" />
              <Text style={styles.folderName}>{folder.name}</Text>
              <Text style={styles.timerCount}>
                {folderTimers.length} timers
              </Text>
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  folderName: {
    marginLeft: 12,
    fontSize: 16,
    flex: 1,
  },
  timerCount: {
    color: '#666',
    fontSize: 14,
  },
  emptyText: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default FolderList; 