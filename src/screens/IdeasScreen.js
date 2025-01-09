import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { timerTemplates } from '../constants/timerTemplates';
import { useNavigation } from '@react-navigation/native';

const IdeasScreen = () => {
  const navigation = useNavigation();

  const handleTemplatePress = (template) => {
    navigation.navigate('Timer', {
      timer: template.timers[0],
      sequence: template.timers,
      currentIndex: 0
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
    backgroundColor: '#1C1C1E',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 24,
  },
  templateItem: {
    padding: 16,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    marginBottom: 16,
  },
  templateName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#fff',
  },
  templateDescription: {
    fontSize: 14,
    color: '#8E8E93',
  },
});

export default IdeasScreen; 