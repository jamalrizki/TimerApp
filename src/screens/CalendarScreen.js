import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sessions, setSessions] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const savedSessions = await AsyncStorage.getItem('completedSessions');
      if (savedSessions) {
        setSessions(JSON.parse(savedSessions));
      }
    } catch (error) {
      console.log('Error loading sessions:', error);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getLastDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();
  };

  const renderCalendar = () => {
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    // Get start of calendar (last days of previous month if needed)
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(1 - firstDayOfMonth.getDay());
    
    const weeks = [];
    let currentWeek = [];
    const today = new Date();
    
    // Generate 6 weeks to ensure consistent calendar size
    for (let week = 0; week < 6; week++) {
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate);
        const dateString = currentDate.toISOString().split('T')[0];
        const isCurrentMonth = currentDate.getMonth() === currentMonth.getMonth();
        const hasSession = sessions[dateString];
        const isToday = currentDate.toDateString() === today.toDateString();
        
        currentWeek.push(
          <View 
            key={dateString}
            style={[
              styles.dayCell,
              !isCurrentMonth && styles.otherMonthCell,
              hasSession && styles.dayWithSession,
              isToday && styles.todayCell,
            ]}
          >
            <Text style={[
              styles.dayText,
              !isCurrentMonth && styles.otherMonthText,
              hasSession && styles.dayWithSessionText,
              isToday && styles.todayText,
            ]}>
              {currentDate.getDate()}
            </Text>
          </View>
        );
        
        startDate.setDate(startDate.getDate() + 1);
      }
      weeks.push(
        <View key={`week-${week}`} style={styles.week}>
          {currentWeek}
        </View>
      );
      currentWeek = [];
    }
    
    return weeks;
  };

  const changeMonth = (increment) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + increment);
    setCurrentMonth(newMonth);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => changeMonth(-1)}>
          <Ionicons name="chevron-back" size={24} color="#00BFA5" />
        </TouchableOpacity>
        <Text style={styles.monthText}>
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Text>
        <TouchableOpacity onPress={() => changeMonth(1)}>
          <Ionicons name="chevron-forward" size={24} color="#00BFA5" />
        </TouchableOpacity>
      </View>
      <View style={styles.weekDays}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <Text key={day} style={styles.weekDayText}>{day}</Text>
        ))}
      </View>
      <View style={styles.calendar}>
        {renderCalendar()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  monthText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    color: '#8E8E93',
    fontSize: 14,
  },
  calendar: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    overflow: 'hidden',
    padding: 1,
  },
  week: {
    flexDirection: 'row',
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3A3A3C',
    margin: 1,
    borderRadius: 8,
  },
  otherMonthCell: {
    backgroundColor: '#2C2C2E',
  },
  otherMonthText: {
    color: '#8E8E93',
  },
  dayWithSession: {
    backgroundColor: '#00BFA5',
  },
  todayCell: {
    borderWidth: 1,
    borderColor: '#00BFA5',
  },
  dayText: {
    color: '#fff',
    fontSize: 16,
  },
  todayText: {
    fontWeight: 'bold',
  },
  dayWithSessionText: {
    color: '#fff',
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
    fontSize: 16,
  },
});

export default CalendarScreen; 