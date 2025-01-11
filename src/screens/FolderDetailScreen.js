import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated } from 'react-native';
import { useTimerContext } from '../hooks/useTimerContext';
import Button from '../components/Button';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

const FolderDetailScreen = ({ route, navigation }) => {
  const { folder } = route.params;
  const { timers, deleteTimer } = useTimerContext();

  const folderTimers = (timers || []).filter(timer => {
    return timer.folderId === folder.id || (folder.timers || []).includes(timer.id);
  });

  const handleStartSequence = () => {
    if (folderTimers.length > 0) {
      navigation.navigate('Timer', { 
        timer: folderTimers[0],
        sequence: folderTimers,
        currentIndex: 0,
        folder: folder
      });
    }
  };

  const renderRightActions = (progress, dragX, timer) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
    });

    return (
      <Animated.View
        style={[
          styles.deleteAction,
          {
            transform: [{ translateX: trans }],
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Delete Timer',
              'Are you sure you want to delete this timer?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => deleteTimer(timer.id),
                },
              ]
            );
          }}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.folderName}>{folder.name}</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Add Interval"
          onPress={() => navigation.navigate('TimerDetails', { folderId: folder.id })}
          style={styles.createButton}
        />
        {folderTimers.length > 0 && (
          <Button
            title="Play"
            onPress={handleStartSequence}
            style={styles.startButton}
          />
        )}
      </View>

      {/* ---------- List of timers in this folder ---------- */}
      <ScrollView>
        {folderTimers.length === 0 ? (
          <Text style={styles.emptyText}>No timers in this folder</Text>
        ) : (
          folderTimers.map((timer, index) => (
            <Swipeable
              key={timer.id}
              renderRightActions={(progress, dragX) => 
                renderRightActions(progress, dragX, timer)
              }
            >
              <TouchableOpacity
                style={styles.timerItem}
                onPress={() => navigation.navigate('TimerDetails', { timer })}
              >
                <View style={styles.timerInfo}>
                  <Text style={styles.timerIndex}>{index + 1}</Text>
                  <Text style={styles.timerName}>{timer.name}</Text>
                </View>
                <Text style={styles.duration}>
                  {Math.floor(timer.duration / 60)}:
                  {(timer.duration % 60).toString().padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            </Swipeable>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default FolderDetailScreen;

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1C1C1E',
  },
  folderName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  createButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#00BFA5',
  },
  startButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#00BFA5',
  },
  emptyText: {
    textAlign: 'center',
    color: '#8E8E93',
    fontSize: 16,
    marginTop: 24,
  },
  timerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    marginBottom: 12,
  },
  timerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timerIndex: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8E93',
  },
  timerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  duration: {
    fontSize: 16,
    color: '#8E8E93',
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
