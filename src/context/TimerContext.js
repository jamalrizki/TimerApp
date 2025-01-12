import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createFolderFromTemplate } from '../utils/templateUtils';

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [timers, setTimers] = useState([]);
  const [folders, setFolders] = useState([]);
  const [recentTimers, setRecentTimers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [savedTimers, savedFolders, savedRecentTimers] = await Promise.all([
        AsyncStorage.getItem('timers'),
        AsyncStorage.getItem('folders'),
        AsyncStorage.getItem('recentTimers')
      ]);

      setTimers(savedTimers ? JSON.parse(savedTimers) : []);
      setFolders(savedFolders ? JSON.parse(savedFolders) : []);
      setRecentTimers(savedRecentTimers ? JSON.parse(savedRecentTimers) : []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const updateRecentTimers = async (newTimer) => {
    try {
      const updatedRecentTimers = [
        newTimer,
        ...recentTimers.filter(t => t.id !== newTimer.id)
      ].slice(0, 5);
      
      setRecentTimers(updatedRecentTimers);
      await AsyncStorage.setItem('recentTimers', JSON.stringify(updatedRecentTimers));
    } catch (error) {
      console.error('Error updating recent timers:', error);
    }
  };

  const addRecentTimer = async (timer) => {
    try {
      const updatedRecent = [timer, ...recentTimers.slice(0, 4)];
      await AsyncStorage.setItem('recentTimers', JSON.stringify(updatedRecent));
      setRecentTimers(updatedRecent);
    } catch (error) {
      console.error('Error adding recent timer:', error);
    }
  };

  const saveTimer = async (newTimer) => {
    try {
      const updatedTimers = [...timers, newTimer];
      await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
      setTimers(updatedTimers);
    } catch (error) {
      console.error('Error saving timer:', error);
      throw error;
    }
  };

  const saveFolder = async (folder) => {
    try {
      const updatedFolders = [...(folders || []), folder];
      await AsyncStorage.setItem('folders', JSON.stringify(updatedFolders));
      setFolders(updatedFolders);
    } catch (error) {
      console.error('Error saving folder:', error);
    }
  };

  const createFromTemplate = async (template) => {
    try {
      const { playlist, timers: newTimers } = createFolderFromTemplate(template);
      
      // Save the folder
      const updatedFolders = [...(folders || []), playlist];
      await AsyncStorage.setItem('folders', JSON.stringify(updatedFolders));
      setFolders(updatedFolders);
      
      // Save all timers
      const updatedTimers = [...(timers || []), ...newTimers];
      await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
      setTimers(updatedTimers);
    } catch (error) {
      console.error('Error creating from template:', error);
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

  const deleteTimer = async (timerId) => {
    try {
      const updatedTimers = timers.filter(timer => timer.id !== timerId);
      await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
      setTimers(updatedTimers);
    } catch (error) {
      console.error('Error deleting timer:', error);
      throw error;
    }
  };

  const deleteFolder = async (folderId) => {
    try {
      const updatedFolders = folders.filter(folder => folder.id !== folderId);
      const updatedTimers = timers.filter(timer => timer.folderId !== folderId);
      await Promise.all([
        AsyncStorage.setItem('folders', JSON.stringify(updatedFolders)),
        AsyncStorage.setItem('timers', JSON.stringify(updatedTimers))
      ]);
      setFolders(updatedFolders);
      setTimers(updatedTimers);
    } catch (error) {
      console.error('Error deleting folder:', error);
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
    deleteTimer,
    deleteFolder,
    createFromTemplate,
    recentTimers,
    setRecentTimers,
    addRecentTimer,
    updateRecentTimers,
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
}; 