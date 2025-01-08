import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import Button from '../components/Button';

const TimerScreen = ({ route, navigation }) => {
  const { timer, sequence, currentIndex = 0 } = route.params;
  const [timeLeft, setTimeLeft] = useState(timer.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(currentIndex);
  const [shouldExit, setShouldExit] = useState(false);
  
  const timerRef = useRef(null);

  const currentTimer = sequence ? sequence[currentSequenceIndex] : timer;
  const totalDuration = currentTimer.duration;
  const currentInterval = currentTimer.intervals?.[0] || {};
  const currentIntervalType = currentInterval.type || 'work';
  const currentIntervalLabel = currentInterval.label || (currentIntervalType === 'work' ? 'Work' : 'Rest');
  const circleColor = currentIntervalType === 'work' ? '#4CAF50' : '#FFA000';
  
  // SVG Arc calculation
  const progress = timeLeft / totalDuration;
  const size = 250;
  const strokeWidth = 10;
  const center = size / 2;
  const radius = center - strokeWidth;
  const arcProgress = 1 - progress;
  
  useEffect(() => {
    if (shouldExit) {
      navigation.goBack();
    }
  }, [shouldExit, navigation]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleIntervalComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, isPaused, currentSequenceIndex]);

  const handleNext = () => {
    if (sequence && currentSequenceIndex < sequence.length - 1) {
      setCurrentSequenceIndex(prev => prev + 1);
      setTimeLeft(sequence[currentSequenceIndex + 1].duration);
    } else {
      setCycles(prev => prev + 1);
      setCurrentSequenceIndex(0);
      setTimeLeft(sequence ? sequence[0].duration : timer.duration);
    }
  };

  const handlePrev = () => {
    if (currentSequenceIndex > 0) {
      setCurrentSequenceIndex(prev => prev - 1);
      setTimeLeft(sequence[currentSequenceIndex - 1].duration);
    } else if (cycles > 0) {
      setCycles(prev => prev - 1);
      setCurrentSequenceIndex(sequence ? sequence.length - 1 : 0);
      setTimeLeft(sequence ? sequence[sequence.length - 1].duration : timer.duration);
    }
  };

  const handleIntervalComplete = () => {
    clearInterval(timerRef.current);
    if (sequence && currentSequenceIndex < sequence.length - 1) {
      setCurrentSequenceIndex(prev => prev + 1);
      setTimeLeft(sequence[currentSequenceIndex + 1].duration);
    } else {
      setShouldExit(true);
    }
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
    clearInterval(timerRef.current);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    clearInterval(timerRef.current);
    setCurrentSequenceIndex(0);
    setTimeLeft(sequence ? sequence[0].duration : timer.duration);
    setCycles(0);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const createArc = (percentage) => {
    const angle = percentage * 360;
    const rad = (angle - 90) * Math.PI / 180;
    const x = center + radius * Math.cos(rad);
    const y = center + radius * Math.sin(rad);
    const largeArc = percentage > 0.5 ? 1 : 0;
    
    return `M ${center},${strokeWidth}
            A ${radius},${radius} 0 ${largeArc} 1 ${x},${y}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerName}>{currentTimer.name}</Text>
      <Text style={[styles.intervalType, { color: circleColor }]}>
        {currentIntervalLabel}
      </Text>
      {sequence && (
        <Text style={styles.sequenceProgress}>
          Timer {currentSequenceIndex + 1} of {sequence.length}
        </Text>
      )}
      <Text style={styles.cycleCount}>Cycle: {cycles + 1}</Text>
      
      <View style={styles.timerContainer}>
        <Svg width={size} height={size}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={circleColor}
            strokeWidth={strokeWidth}
            fill="none"
            opacity={0.3}
          />
          <Path
            d={createArc(arcProgress)}
            stroke={circleColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
        </Svg>
        <Text style={styles.timeText}>
          {`${minutes}:${seconds.toString().padStart(2, '0')}`}
        </Text>
      </View>

      <View style={styles.navigationControls}>
        <Button
          title="Prev"
          onPress={handlePrev}
          style={styles.prevButton}
        />
        <Button
          title="Next"
          onPress={handleNext}
          style={styles.nextButton}
        />
      </View>

      <View style={styles.controls}>
        {!isRunning ? (
          <Button title="Start" onPress={handleStart} style={styles.startButton} />
        ) : isPaused ? (
          <>
            <Button title="Resume" onPress={handleResume} style={styles.resumeButton} />
            <Button title="Stop" onPress={handleStop} style={styles.stopButton} />
          </>
        ) : (
          <>
            <Button title="Pause" onPress={handlePause} style={styles.pauseButton} />
            <Button title="Stop" onPress={handleStop} style={styles.stopButton} />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 16,
  },
  timerName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  intervalType: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cycleCount: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  timerContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  timeText: {
    position: 'absolute',
    fontSize: 48,
    fontWeight: 'bold',
  },
  navigationControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 32,
    marginBottom: 16,
  },
  prevButton: {
    width: 100,
    backgroundColor: '#90CAF9',
  },
  nextButton: {
    width: 100,
    backgroundColor: '#2196F3',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    width: 120,
  },
  pauseButton: {
    backgroundColor: '#FFA000',
    width: 120,
  },
  resumeButton: {
    backgroundColor: '#4CAF50',
    width: 120,
  },
  stopButton: {
    backgroundColor: '#F44336',
    width: 120,
  },
  sequenceProgress: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
});

export default TimerScreen; 