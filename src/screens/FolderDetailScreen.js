import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTimerContext } from '../hooks/useTimerContext';
import Button from '../components/Button';
import TimePicker from '../components/TimePicker';

const ITEM_HEIGHT = 50;    // height of each picker row
const VISIBLE_ITEMS = 5;   // how many rows visible at once

const FolderDetailScreen = ({ route, navigation }) => {
  const { folder } = route.params;
  const { timers, saveTimer } = useTimerContext();
  const [showModal, setShowModal] = useState(false);
  const [newTimer, setNewTimer] = useState({
    name: '',
    hours: '00',
    minutes: '00',
    seconds: '00',
    type: 'work',
  });

  const folderTimers = (timers || []).filter(timer => {
    return timer.folderId === folder.id || (folder.timers || []).includes(timer.id);
  });

  const handleCreateTimer = () => {
    try {
      // Convert string values to numbers and validate
      const hours = parseInt(newTimer.hours) || 0;
      const minutes = parseInt(newTimer.minutes) || 0;
      const seconds = parseInt(newTimer.seconds) || 0;
      
      // Calculate total duration in seconds
      const duration = 
        (hours * 3600) + (minutes * 60) + seconds;
      
      if (duration <= 0) {
        Alert.alert('Invalid Duration', 'Please enter a valid duration');
        return;
      }
      
      const newTimerObj = {
        id: Date.now().toString(),
        name: newTimer.name || `Timer ${(folderTimers || []).length + 1}`,
        duration: duration,
        intervals: [{
          duration: duration,
          type: newTimer.type,
        }],
        folderId: folder.id,
        createdAt: new Date().toISOString(),
      };
      saveTimer(newTimerObj);
      setShowModal(false);
      setNewTimer({ name: '', hours: '00', minutes: '00', seconds: '00', type: 'work' });
    } catch (error) {
      console.error('Error creating timer:', error);
      Alert.alert('Error', 'Failed to create timer. Please try again.');
    }
  };

  const handleStartSequence = () => {
    if (folderTimers.length > 0) {
      navigation.navigate('Timer', { 
        timer: folderTimers[0],
        sequence: folderTimers,
        currentIndex: 0
      });
    }
  };

  const handleDurationChange = (field, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;
    // Seconds cannot exceed 59
    if (field === 'seconds' && parseInt(value) > 59) return;
    
    setNewTimer(prev => ({ ...prev, [field]: value }));
  };

  const renderPickerItems = (max, value, onChange) => {
    return Array.from({ length: max }, (_, i) => {
      const displayNumber = i < 10 ? i.toString() : i.toString().padStart(2, '0');
      return (
        <TouchableOpacity
          key={i}
          style={styles.pickerItem}
          onPress={() => onChange(displayNumber)}
        >
          <Text
            style={[
              styles.pickerText,
              styles.pickerTextFaded
            ]}
          >
            {displayNumber}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.folderName}>{folder.name}</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Add Timer"
          onPress={() => setShowModal(true)}
          style={styles.createButton}
        />
        {folderTimers.length > 0 && (
          <Button
            title="Start Sequence"
            onPress={handleStartSequence}
            style={styles.startButton}
          />
        )}
      </View>

      {/* ---------------- MODAL ---------------- */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Timer</Text>
            
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={newTimer.name}
              onChangeText={(text) => 
                setNewTimer(prev => ({ ...prev, name: text }))
              }
              placeholder="Timer name"
            />
            
            <Text style={styles.label}>Duration</Text>
            
            {/* The outer container that holds all 3 pickers + fades + highlight */}
            <View style={styles.pickerOuterContainer}>
              {/* Fade at top */}
              <LinearGradient
                colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
                style={styles.fadeTop}
                pointerEvents="none"
              />
              {/* Fade at bottom */}
              <LinearGradient
                colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
                style={styles.fadeBottom}
                pointerEvents="none"
              />
              {/* Center highlight overlay */}
              <View style={styles.centerHighlight} pointerEvents="none" />

              <View style={styles.pickerContainer}>
                {/* Hours Column */}
                <View style={styles.pickerColumn}>
                  <ScrollView
                    style={styles.picker}
                    contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    onMomentumScrollEnd={(e) => {
                      const selectedIndex = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
                      setNewTimer(prev => ({ 
                        ...prev, 
                        hours: selectedIndex < 10 ? selectedIndex.toString() : selectedIndex.toString().padStart(2, '0')
                      }));
                    }}
                  >
                    {renderPickerItems(24, newTimer.hours, 
                      (value) => setNewTimer(prev => ({ ...prev, hours: value })))}
                  </ScrollView>
                  {/* Adjusted label styling here */}
                  <Text style={styles.staticUnitLabel}>hr</Text>
                </View>

                <Text style={styles.pickerSeparator}>:</Text>
                
                {/* Minutes Column */}
                <View style={styles.pickerColumn}>
                  <ScrollView
                    style={styles.picker}
                    contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    onMomentumScrollEnd={(e) => {
                      const selectedIndex = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
                      setNewTimer(prev => ({ 
                        ...prev, 
                        minutes: selectedIndex < 10 ? selectedIndex.toString() : selectedIndex.toString().padStart(2, '0')
                      }));
                    }}
                  >
                    {renderPickerItems(60, newTimer.minutes,
                      (value) => setNewTimer(prev => ({ ...prev, minutes: value })))}
                  </ScrollView>
                  {/* Adjusted label styling here */}
                  <Text style={styles.staticUnitLabel}>min</Text>
                </View>

                <Text style={styles.pickerSeparator}>:</Text>

                {/* Seconds Column */}
                <View style={styles.pickerColumn}>
                  <ScrollView
                    style={styles.picker}
                    contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    onMomentumScrollEnd={(e) => {
                      const selectedIndex = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
                      setNewTimer(prev => ({ 
                        ...prev, 
                        seconds: selectedIndex < 10 ? selectedIndex.toString() : selectedIndex.toString().padStart(2, '0')
                      }));
                    }}
                  >
                    {renderPickerItems(60, newTimer.seconds,
                      (value) => setNewTimer(prev => ({ ...prev, seconds: value })))}
                  </ScrollView>
                  {/* Adjusted label styling here */}
                  <Text style={styles.staticUnitLabel}>sec</Text>
                </View>
              </View>
            </View>

            <Text style={styles.label}>Type</Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  newTimer.type === 'work' && styles.typeButtonActive
                ]}
                onPress={() => setNewTimer(prev => ({ ...prev, type: 'work' }))}
              >
                <Text
                  style={
                    newTimer.type === 'work' 
                      ? styles.typeTextActive 
                      : styles.typeText
                  }
                >
                  Work
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  newTimer.type === 'break' && styles.typeButtonActive
                ]}
                onPress={() => setNewTimer(prev => ({ ...prev, type: 'break' }))}
              >
                <Text
                  style={
                    newTimer.type === 'break' 
                      ? styles.typeTextActive 
                      : styles.typeText
                  }
                >
                  Break
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setShowModal(false)}
                style={styles.cancelButton}
              />
              <Button
                title="Create"
                onPress={handleCreateTimer}
                style={styles.confirmButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* ---------- List of timers in this folder ---------- */}
      <ScrollView>
        {folderTimers.length === 0 ? (
          <Text style={styles.emptyText}>No timers in this folder</Text>
        ) : (
          folderTimers.map((timer, index) => (
            <TouchableOpacity
              key={timer.id}
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
    backgroundColor: '#fff',
  },
  folderName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    flex: 1,
  },
  startButton: {
    backgroundColor: '#2196F3',
    flex: 1,
  },
  timerItem: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerName: {
    fontSize: 16,
  },
  duration: {
    color: '#666',
    fontSize: 14,
  },
  emptyText: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 24,
  },
  timerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  timerIndex: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
    color: '#666',
  },
  /* MODAL */
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  /* PICKER AREA */
  pickerOuterContainer: {
    position: 'relative',
    marginBottom: 24,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
  },
  pickerColumn: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  picker: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 20,
  },
  pickerText: {
    fontSize: 24,
    color: '#000',
    marginBottom: 8,
  },
  pickerTextFaded: {
    opacity: 0.4,

  },
  pickerSeparator: {
    fontSize: 24,
    paddingHorizontal: 8,
    alignSelf: 'center',
    color: '#000',
    opacity: 0.5,
  },
  /* TYPE SELECTOR */
  typeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    padding: 12,
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
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#2196F3',
  },
  confirmButton: {
    backgroundColor: '#30D158',
  },
  /* FADE & HIGHLIGHT OVERLAYS */
  centerHighlight: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: ITEM_HEIGHT * 2, 
    height: ITEM_HEIGHT,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderColor: '#007AFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  fadeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 2,
    zIndex: 12,
  },
  fadeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 2,
    zIndex: 12,
  },
  /* << This is the adjusted style so it’s beside the numbers >> */
  staticUnitLabel: {
    fontSize: 18,
    color: '#000',
    position: 'absolute',
    // Align in the same horizontal space as the scroll items, but shifted right
    left: '60%', // or tweak this number
    top: ITEM_HEIGHT * 2 + 10, // push it slightly down so it doesn't overlap
    opacity: 0.6,
  },
});
