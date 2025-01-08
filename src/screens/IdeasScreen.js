import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { timerTemplates } from '../constants/timerTemplates';
import { useNavigation } from '@react-navigation/native';
import { useTimerContext } from '../hooks/useTimerContext';

const IdeasScreen = () => {
  const navigation = useNavigation();
  const { saveTimer } = useTimerContext();

  const handleTemplatePress = (template) => {
    // Navigate to folder selection first
    navigation.navigate('My Timers', {
      screen: 'FolderDetail',
      params: { 
        folder: {
          id: template.id,
          name: template.name,
        }
      }
    });

    // Create all interval timers in the folder
    template.intervals.forEach((interval, index) => {
      const timer = {
        id: Date.now().toString() + index,
        name: interval.label,
        duration: interval.duration,
        createdAt: new Date().toISOString(),
        folderId: template.id,
      };
      saveTimer(timer);
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Timer Templates</Text>
      <Text style={styles.subtitle}>Choose a template to get started</Text>
      
      {timerTemplates.map(template => (
        <TouchableOpacity
          key={template.id}
          style={styles.templateItem}
          onPress={() => handleTemplatePress(template)}
        >
          <Text style={styles.templateName}>{template.name}</Text>
          <Text style={styles.templateDescription}>
            {template.description}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  templateItem: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  templateName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  templateDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default IdeasScreen; 