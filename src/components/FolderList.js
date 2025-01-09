import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTimerContext } from '../hooks/useTimerContext';
import { Swipeable } from 'react-native-gesture-handler';

const FolderList = ({ folders, timers, navigation }) => {
  const { deleteFolder } = useTimerContext();

  if (!folders || !timers) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Playlists</Text>
      </View>
      {folders.length === 0 ? (
        <Text style={styles.emptyText}>No Playlists yet</Text>
      ) : (
        folders.map((folder) => {
          const folderTimers = timers.filter(timer => 
            timer.folderId === folder.id || (folder.timers || []).includes(timer.id)
          );
          
          return (
            <Swipeable
              key={folder.id}
              renderRightActions={(progress, dragX) => (
                <Animated.View style={styles.deleteAction}>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        'Delete Playlist',
                        'Are you sure you want to delete this playlist and all its timers?',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Delete',
                            style: 'destructive',
                            onPress: () => deleteFolder(folder.id),
                          },
                        ]
                      );
                    }}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash-outline" size={24} color="#fff" />
                  </TouchableOpacity>
                </Animated.View>
              )}
            >
              <TouchableOpacity 
                style={styles.folderItem}
                onPress={() => navigation.navigate('FolderDetail', { folder })}
              >
                <View style={styles.folderContent}>
                  <View style={styles.folderInfo}>
                    <Text style={styles.folderName}>{folder.name}</Text>
                    <Text style={styles.timerCount}>
                      {folderTimers.length} intervals
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.playButton}
                    onPress={() => {
                      if (folderTimers.length > 0) {
                        navigation.navigate('Timer', {
                          timer: folderTimers[0],
                          sequence: folderTimers,
                          currentIndex: 0
                        });
                      }
                    }}
                  >
                    <Ionicons name="play" size={24} color="#00BFA5" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Swipeable>
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
    color: 'white'
  },
  folderItem: {
    padding: 12,
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    marginBottom: 8,
  },
  folderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  folderInfo: {
    flex: 1,
  },
  folderName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 4,
  },
  timerCount: {
    color: '#8E8E93',
    fontSize: 14,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#8E8E93',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  deleteAction: {
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  deleteButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FolderList; 