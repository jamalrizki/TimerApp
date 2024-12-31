import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [timers, setTimers] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [savedTimers, savedFolders] = await Promise.all([
          AsyncStorage.getItem('timers'),
          AsyncStorage.getItem('folders')
        ]);

        if (savedTimers) setTimers(JSON.parse(savedTimers));
        if (savedFolders) setFolders(JSON.parse(savedFolders));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const saveTimer = async (newTimer) => {
    try {
      const timerToSave = {
        ...newTimer,
        intervals: Array.isArray(newTimer.intervals) ? newTimer.intervals : [{
          duration: newTimer.duration,
          type: 'work',
        }],
      };
      const updatedTimers = [...timers, timerToSave];
      await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
      setTimers(updatedTimers);

      if (newTimer.folderId) {
        const updatedFolders = folders.map(folder => {
          if (folder.id === newTimer.folderId) {
            return {
              ...folder,
              timers: [...(folder.timers || []), timerToSave.id]
            };
          }
          return folder;
        });
        await AsyncStorage.setItem('folders', JSON.stringify(updatedFolders));
        setFolders(updatedFolders);
      }
    } catch (error) {
      console.error('Error saving timer:', error);
    }
  };

  const saveFolder = async (newFolder) => {
    try {
      const folderToSave = {
        ...newFolder,
        timers: newFolder.timers || [],
      };
      const updatedFolders = [...folders, folderToSave];
      await AsyncStorage.setItem('folders', JSON.stringify(updatedFolders));
      setFolders(updatedFolders);
    } catch (error) {
      console.error('Error saving folder:', error);
    }
  };

  const updateTimer = async (updatedTimer) => {
    try {
      const updatedTimers = timers.map(timer => 
        timer.id === updatedTimer.id ? updatedTimer : timer
      );
      await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
      setTimers(updatedTimers);
    } catch (error) {
      console.error('Error updating timer:', error);
      throw error;
    }
  };

  const value = {
    timers,
    setTimers,
    folders,
    setFolders,
    loading,
    setLoading,
    saveTimer,
    saveFolder,
    updateTimer,
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
}; 