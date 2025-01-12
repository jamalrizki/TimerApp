import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SOUNDS = [
  { id: 'voice', name: 'Voice', isVoice: true },
  { id: 'beep', name: 'Beep', file: require('../../assets/beep.mp3') },
  { id: 'bell', name: 'Bell', file: require('../../assets/bell.mp3') },
  { id: 'chimes', name: 'Chimes', file: require('../../assets/chimes.mp3') },
  { id: 'celesta', name: 'Celesta', file: require('../../assets/celesta.mp3') },
  { id: 'crotales', name: 'Crotales', file: require('../../assets/crotales.mp3') },
  { id: 'glockenspiel', name: 'Glockenspiel', file: require('../../assets/glockenspiel.mp3') },
  { id: 'gong', name: 'Gong', file: require('../../assets/gong.mp3') },
  { id: 'gunshot', name: 'Gunshot', file: require('../../assets/gun-shot.mp3') },
  { id: 'tibetan_bowl', name: 'Tibetan Bowl', file: require('../../assets/tibetan-bowl.mp3') },
  { id: 'toilet_lid', name: 'Toilet Lid', file: require('../../assets/gong.mp3') },
  { id: 'xylophone', name: 'Xylophone', file: require('../../assets/xylophone.mp3') },
];

const SoundsScreen = () => {
  const [selectedSound, setSelectedSound] = React.useState('voice');
  const [sound, setSound] = React.useState();

  React.useEffect(() => {
    loadSelectedSound();
    return sound ? () => sound.unloadAsync() : undefined;
  }, []);

  const loadSelectedSound = async () => {
    try {
      const saved = await AsyncStorage.getItem('selectedSound');
      setSelectedSound(saved || 'voice');
    } catch (error) {
      setSelectedSound('voice');
    }
  };

  const playSound = async (soundFile) => {
    try {
      if (sound) await sound.unloadAsync();
      if (!soundFile) return; // For voice option which has no sound file
      const { sound: newSound } = await Audio.Sound.createAsync(soundFile);
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      // Handle error silently
    }
  };

  const handleSelectSound = async (soundId) => {
    setSelectedSound(soundId);
    try {
      await AsyncStorage.setItem('selectedSound', soundId);
      if (soundId !== 'voice') {
        const soundItem = SOUNDS.find(s => s.id === soundId);
        if (soundItem && soundItem.file) {
          playSound(soundItem.file);
        }
      }
    } catch (error) {
      // Handle error silently
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Timer Sounds</Text>
      <ScrollView>
        {SOUNDS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.soundItem}
            onPress={() => handleSelectSound(item.id)}
          >
            <View style={styles.soundInfo}>
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => !item.isVoice && playSound(item.file)}
              >
                <Ionicons 
                  name={item.isVoice ? "mic-outline" : "play"} 
                  size={24} 
                  color="#00BFA5" 
                />
              </TouchableOpacity>
              <Text style={styles.soundName}>{item.name}</Text>
            </View>
            {selectedSound === item.id && (
              <Ionicons name="checkmark" size={24} color="#00BFA5" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
    marginTop: 60,
  },
  soundItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    marginBottom: 12,
  },
  soundInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  soundName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    marginBottom: 24,
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
});

export default SoundsScreen; 