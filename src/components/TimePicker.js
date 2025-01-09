import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ITEM_HEIGHT = 50;    // height of each picker row
const VISIBLE_ITEMS = 5;   // how many rows visible at once

const TimePicker = ({ hours, minutes, seconds, onChange }) => {
  const hoursScrollRef = useRef();
  const minutesScrollRef = useRef();
  const secondsScrollRef = useRef();
  
  useEffect(() => {
    // Add a small delay to ensure the ScrollView is ready
    setTimeout(() => {
      hoursScrollRef.current?.scrollTo({ y: parseInt(hours) * ITEM_HEIGHT, animated: false });
      minutesScrollRef.current?.scrollTo({ y: parseInt(minutes) * ITEM_HEIGHT, animated: false });
      secondsScrollRef.current?.scrollTo({ y: parseInt(seconds) * ITEM_HEIGHT, animated: false });
    }, 100);
  }, [hours, minutes, seconds]);

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
    <View style={styles.pickerOuterContainer}>
      {/* <LinearGradient
        colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
        style={styles.fadeTop}
        pointerEvents="none"
      />
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
        style={styles.fadeBottom}
        pointerEvents="none"
      /> */}
      <View style={styles.centerHighlight} pointerEvents="none" />

      <View style={styles.pickerContainer}>
        <View style={styles.pickerColumn}>
          <ScrollView
            ref={hoursScrollRef}
            style={styles.picker}
            contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            onMomentumScrollEnd={(e) => {
              const selectedIndex = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
              onChange('hours', selectedIndex < 10 ? selectedIndex.toString() : selectedIndex.toString().padStart(2, '0'));
            }}
          >
            {renderPickerItems(24, hours, 
              (value) => onChange('hours', value))}
          </ScrollView>
          <Text style={styles.staticUnitLabel}>hr</Text>
        </View>

        <Text style={styles.pickerSeparator}>:</Text>
        
        <View style={styles.pickerColumn}>
          <ScrollView
            ref={minutesScrollRef}
            style={styles.picker}
            contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            onMomentumScrollEnd={(e) => {
              const selectedIndex = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
              onChange('minutes', selectedIndex < 10 ? selectedIndex.toString() : selectedIndex.toString().padStart(2, '0'));
            }}
          >
            {renderPickerItems(60, minutes,
              (value) => onChange('minutes', value))}
          </ScrollView>
          <Text style={styles.staticUnitLabel}>min</Text>
        </View>

        <Text style={styles.pickerSeparator}>:</Text>

        <View style={styles.pickerColumn}>
          <ScrollView
            ref={secondsScrollRef}
            style={styles.picker}
            contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            onMomentumScrollEnd={(e) => {
              const selectedIndex = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
              onChange('seconds', selectedIndex < 10 ? selectedIndex.toString() : selectedIndex.toString().padStart(2, '0'));
            }}
          >
            {renderPickerItems(60, seconds,
              (value) => onChange('seconds', value))}
          </ScrollView>
          <Text style={styles.staticUnitLabel}>sec</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Copy all the picker-related styles from FolderDetailScreen
  pickerOuterContainer: {
    position: 'relative',
    marginBottom: 24,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    backgroundColor: '#1C1C1E',
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
    color: '#fff',
    marginBottom: 8,
  },
  pickerTextFaded: {
    opacity: 0.8,
  },
  pickerSeparator: {
    fontSize: 24,
    paddingHorizontal: 8,
    alignSelf: 'center',
    color: '#000',
    opacity: 0.5,
  },
  centerHighlight: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: ITEM_HEIGHT * 2,
    height: ITEM_HEIGHT,
    backgroundColor: 'rgba(0, 191, 165, 0.1)',  // Teal highlight with opacity
    borderColor: '#00BFA5',  // Teal borders
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
  staticUnitLabel: {
    fontSize: 18,
    color: '#8E8E93',
    position: 'absolute',
    left: '60%',
    top: ITEM_HEIGHT * 2 + 10,
    opacity: 0.6,
  }
});

export default TimePicker; 