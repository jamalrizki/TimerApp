import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, BackHandler, AppState } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import Button from "../components/Button";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import CompletionModal from "../components/CompletionModal";
import { CommonActions } from "@react-navigation/native";
import Countdown from "../components/Countdown";
import { useTimerContext } from "../hooks/useTimerContext";
import { timerTemplates } from "../constants/timerTemplates";

const TimerScreen = ({ route, navigation }) => {
  const { timer, sequence, currentIndex: initialIndex = 0 } = route.params;
  const [timeLeft, setTimeLeft] = useState(timer.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSequenceIndex, setCurrentSequenceIndex] =
    useState(initialIndex);
  const [cycles, setCycles] = useState(1);
  const [totalCycles, setTotalCycles] = useState(1);
  const [shouldExit, setShouldExit] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [sound, setSound] = useState();
  const [savedSound, setSavedSound] = useState("voice");
  const [showCountdown, setShowCountdown] = useState(false);
  const [isAlertShowing, setIsAlertShowing] = useState(false);

  const timerRef = useRef(null);
  const { updateRecentTimers, addRecentTimer } = useTimerContext();

  const currentTimer = sequence ? sequence[currentSequenceIndex] : timer;
  const totalDuration = currentTimer.duration;
  const currentIntervalLabel = currentTimer.description || "Work";
  const circleColor = "#00BFA5";

  // SVG Arc calculation
  const progress = timeLeft / totalDuration;
  const size = 250;
  const strokeWidth = 10;
  const center = size / 2;
  const radius = center - strokeWidth;
  const arcProgress = 1 - progress;

  useEffect(() => {
    if (shouldExit) {
      setShowCompletion(true);
    }
  }, [shouldExit]);

  useEffect(() => {
    let intervalId;
    
    if (isRunning && !isPaused) {
      intervalId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleIntervalComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      timerRef.current = intervalId;
    }

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        // App has come to the foreground
        loadSoundPreference();
      }
    });

    return () => {
      clearInterval(intervalId);
      subscription.remove();
    };
  }, [isRunning, isPaused, currentSequenceIndex]);

  const handleNext = () => {
    if (sequence && currentSequenceIndex < sequence.length - 1) {
      setCurrentSequenceIndex((prev) => prev + 1);
      setTimeLeft(sequence[currentSequenceIndex + 1].duration);
    } else {
      setCycles((prev) => prev + 1);
      setCurrentSequenceIndex(0);
      setTimeLeft(sequence ? sequence[0].duration : timer.duration);
    }
  };

  const handlePrev = () => {
    if (currentSequenceIndex > 0) {
      setCurrentSequenceIndex((prev) => prev - 1);
      setTimeLeft(sequence[currentSequenceIndex - 1].duration);
    } else if (cycles > 0) {
      setCycles((prev) => prev - 1);
      setCurrentSequenceIndex(sequence ? sequence.length - 1 : 0);
      setTimeLeft(
        sequence ? sequence[sequence.length - 1].duration : timer.duration
      );
    }
  };

  const handleIntervalComplete = () => {
    clearInterval(timerRef.current);

    // Check if we're in a sequence and not at the end
    if (sequence) {
      if (currentSequenceIndex < sequence.length - 1) {
        // Move to next timer in sequence
        const nextInterval = sequence[currentSequenceIndex + 1];
        if (savedSound === "off") {
          // Do nothing - sound is off
        } else if (savedSound === "voice") {
          const textToSpeak = nextInterval.name || nextInterval.description || "Next interval";
          Speech.speak(textToSpeak, {
            language: "en",
            rate: 0.8,
          });
        } else {
          playSound();
        }
        setCurrentSequenceIndex(prev => prev + 1);
        setTimeLeft(sequence[currentSequenceIndex + 1].duration);
      } else if (cycles < totalCycles) {
        // Start new cycle
        const firstInterval = sequence[0];
        if (savedSound === "off") {
          // Do nothing - sound is off
        } else if (savedSound === "voice") {
          const textToSpeak = `Cycle ${cycles + 1}. ${firstInterval.name || firstInterval.description || "First interval"}`;
          Speech.speak(textToSpeak, {
            language: "en",
            rate: 0.8,
          });
        } else {
          playSound();
        }
        setCycles(prev => prev + 1);
        setCurrentSequenceIndex(0);
        setTimeLeft(sequence[0].duration);
      } else {
        // All cycles complete
        logCompletedSession();
        setIsRunning(false);
        setShouldExit(true);
      }
    } else {
      // Single timer complete
      if (cycles < totalCycles) {
        setCycles(prev => prev + 1);
        setTimeLeft(timer.duration);
        if (savedSound === "off") {
          // Do nothing - sound is off
        } else if (savedSound === "voice") {
          const textToSpeak = `Starting cycle ${cycles + 1}. ${timer.description || timer.name || "Timer"}`;
          Speech.speak(textToSpeak, {
            language: "en",
            rate: 0.8,
          });
        } else {
          playSound();
        }
      } else {
        logCompletedSession();
        setIsRunning(false);
        setShouldExit(true);
      }
    }
  };

  useEffect(() => {
    if (shouldExit) {
      setShowCompletion(true);
    }
  }, [shouldExit]);

  const logCompletedSession = async () => {
    try {
      const timestamp = new Date().toISOString();
      // Save to completed sessions for calendar
      const savedSessions = await AsyncStorage.getItem('completedSessions');
      const sessions = savedSessions ? JSON.parse(savedSessions) : {};
      const dateKey = timestamp.split('T')[0];
      sessions[dateKey] = (sessions[dateKey] || 0) + 1;
      await AsyncStorage.setItem('completedSessions', JSON.stringify(sessions));

      // If this is part of a playlist (folder)
      if (route.params.folder) {
        const playlistTimer = {
          id: route.params.folder.id,
          name: route.params.folder.name,
          folderId: route.params.folder.id,
          sequence: sequence
        };
        addRecentTimer(playlistTimer);
      } else {
        // Find if this is part of a preset
        const preset = timerTemplates.find(template => 
          template.timers.some(t => t.id === timer.id)
        );

        if (preset) {
          const presetTimer = {
            id: preset.id,
            name: preset.name,
            description: preset.description,
            presetId: preset.id,
            sequence: preset.timers
          };
          addRecentTimer(presetTimer);
        } else {
          // Regular timer
          addRecentTimer(timer);
        }
      }
    } catch (error) {
      console.error('Error logging session:', error);
    }
  };

  const handleStart = () => {
    setShowCountdown(true);
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

  const handleCycleChange = (increment) => {
    // Allow changing cycles anytime, but don't go below current cycle
    setTotalCycles((prev) => Math.max(cycles, Math.max(1, prev + increment)));
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const createArc = (percentage) => {
    const angle = percentage * 360;
    const rad = ((angle - 90) * Math.PI) / 180;
    const x = center + radius * Math.cos(rad);
    const y = center + radius * Math.sin(rad);
    const largeArc = percentage > 0.5 ? 1 : 0;

    return `M ${center},${strokeWidth}
            A ${radius},${radius} 0 ${largeArc} 1 ${x},${y}`;
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playSound = async () => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const soundMap = {
        beep: require("../../assets/beep.mp3"),
        bell: require("../../assets/bell.mp3"),
        chimes: require("../../assets/chimes.mp3"),
        celesta: require("../../assets/celesta.mp3"),
        crotales: require("../../assets/crotales.mp3"),
        glockenspiel: require("../../assets/glockenspiel.mp3"),
        gong: require("../../assets/gong.mp3"),
        gunshot: require("../../assets/gun-shot.mp3"),
        tibetan_bowl: require("../../assets/tibetan-bowl.mp3"),
        toilet_lid: require("../../assets/gong.mp3"),
        xylophone: require("../../assets/xylophone.mp3"),
      };
      if (savedSound === "off") return;

      if (!soundMap[savedSound]) {
        return;
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        soundMap[savedSound],
        { shouldPlay: true }
      );
      setSound(newSound);
    } catch {
      // Handle error silently
    }
  };

  // Single source of truth for back handling
  const handleBackPress = React.useCallback(() => {
    if (!isRunning) {
      navigation.goBack();
      return true;
    }
    
    // Prevent multiple alerts
    if (isAlertShowing) return true;
    
    setIsAlertShowing(true);
    setIsPaused(true);
    clearInterval(timerRef.current);

    Alert.alert(
      "Quit Timer?",
      "Are you sure you want to quit? Your progress will be lost.",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {
            setIsAlertShowing(false);
            setIsPaused(false);
          },
        },
        {
          text: "Quit",
          style: "destructive",
          onPress: () => {
            setIsAlertShowing(false);
            navigation.goBack();
          },
        },
      ]
    );
    return true;
  }, [isRunning, navigation, isAlertShowing]);

  // Hardware back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );
    return () => backHandler.remove();
  }, [handleBackPress]);

  // Navigation back button
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity 
          onPress={handleBackPress}
          style={{ 
            marginLeft: 16,
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Ionicons name="chevron-back" size={24} color="#00BFA5" />
          <Text style={{ 
            color: '#00BFA5',
            marginLeft: 4,
            fontSize: 17
          }}>
            Back
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [handleBackPress]);

  // Remove the beforeRemove listener if it exists
  useEffect(() => {
    return () => {
      navigation.removeListener('beforeRemove', handleBackPress);
    };
  }, [navigation, handleBackPress]);

  const handleCompletionFinish = () => {
    if (route.params.folder) {
      // If we came from a playlist, reset the stack to MyTimers and then navigate to PlaylistDetail
      navigation.dispatch(
        CommonActions.reset({
          index: 2,
          routes: [
            { name: 'MyTimers' },
            { 
              name: 'PlaylistDetail', 
              params: { folder: route.params.folder }
            }
          ],
        })
      );
    } else {
      navigation.goBack();
    }
  };

  const loadSoundPreference = async () => {
    try {
      const saved = await AsyncStorage.getItem("selectedSound");
      const soundToUse = saved || "voice";
      setSavedSound(soundToUse);
    } catch (error) {
      setSavedSound("voice");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadSoundPreference();
    }, [])
  );

  const handleCountdownComplete = () => {
    setShowCountdown(false);
    startTimer();
  };

  const startTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
    // Announce the first interval
    if (savedSound === "off") {
      // Do nothing - sound is off
    } else if (savedSound === "voice") {
      const textToSpeak =
        sequence 
          ? sequence[currentSequenceIndex].name || 'Interval'
          : currentTimer.description || currentTimer.name || "Start";
      Speech.speak(textToSpeak, {
        language: "en",
        rate: 0.8,
      });
    } else {
      playSound();
    }
  };

  const handleTimerComplete = () => {
    if (sequence && currentSequenceIndex < sequence.length - 1) {
      // If there's another timer in the sequence
      if (savedSound === "off") {
        // Do nothing - sound is off
      } else if (savedSound === "voice") {
        const nextTimer = sequence[currentSequenceIndex + 1];
        const textToSpeak = nextTimer.name || nextTimer.description || "Next interval";
        Speech.speak(textToSpeak, {
          language: "en",
          rate: 0.8,
        });
      } else {
        playSound();
      }
      setCurrentSequenceIndex(currentSequenceIndex + 1);
      setTimeLeft(sequence[currentSequenceIndex + 1].duration);
    } else {
      // Final timer completed
      clearInterval(timerRef.current);
      setIsRunning(false);
      logCompletedSession();
      setShouldExit(true);
    }
  };

  useEffect(() => {
    // When the timer screen first loads, if it's part of a sequence
    // add the sequence to recent timers only once at the start
    if (route.params.sequence && currentSequenceIndex === 0) {
      const preset = timerTemplates.find(template => 
        template.timers.some(t => t.id === route.params.timer.id)
      );
      if (preset) {
        addRecentTimer(route.params.timer);
      }
    } else if (!route.params.sequence) {
      // If it's a single timer, add it normally
      addRecentTimer(route.params.timer);
    }
  }, []);

  useEffect(() => {
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true
        });
      } catch (error) {
        console.log('Error setting audio mode:', error);
      }
    };

    configureAudio();
  }, []);

  return (
    <View style={styles.container}>
      {showCountdown && <Countdown onComplete={handleCountdownComplete} />}
      {showCompletion && (
        <CompletionModal onComplete={handleCompletionFinish} />
      )}
      <Text style={styles.timerName}>{currentTimer.name}</Text>
      <Text style={[styles.intervalType, { color: circleColor }]}>
        {currentIntervalLabel}
      </Text>
      {sequence && (
        <Text style={styles.sequenceProgress}>
          Timer {currentSequenceIndex + 1} of {sequence.length}
        </Text>
      )}
      <Text style={styles.cycleCount}>
        Cycle: {cycles}/{totalCycles}
      </Text>

      <View style={styles.topControls}>
        <TouchableOpacity
          onPress={() => handleCycleChange(-1)}
          style={styles.cycleButton}
        >
          <Text style={styles.cycleButtonText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleCycleChange(1)}
          style={styles.cycleButton}
        >
          <Text style={styles.cycleButtonText}>+</Text>
        </TouchableOpacity>
      </View>

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
          {`${minutes}:${seconds.toString().padStart(2, "0")}`}
        </Text>
      </View>

      <View style={styles.navigationControls}>
        <TouchableOpacity onPress={handlePrev} style={styles.navButton}>
          <Ionicons name="chevron-back-sharp" size={24} color="#fff" />
          <Ionicons
            name="chevron-back-sharp"
            size={24}
            color="#fff"
            style={styles.overlappingIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style={styles.navButton}>
          <Ionicons name="chevron-forward-sharp" size={24} color="#fff" />
          <Ionicons
            name="chevron-forward-sharp"
            size={24}
            color="#fff"
            style={styles.overlappingIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.controls}>
        {!isRunning ? (
          <TouchableOpacity onPress={handleStart} style={styles.controlButton}>
            <Ionicons name="play" size={32} color="#fff" />
          </TouchableOpacity>
        ) : isPaused ? (
          <TouchableOpacity onPress={handleResume} style={styles.controlButton}>
            <Ionicons name="play" size={32} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handlePause} style={styles.controlButton}>
            <Ionicons name="pause" size={32} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
    alignItems: "center",
    padding: 16,
  },
  timerName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#fff",
  },
  intervalType: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#00BFA5",
  },
  cycleCount: {
    fontSize: 16,
    color: "#8E8E93",
    marginBottom: 0,
  },
  timerContainer: {
    width: 250,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    position: "relative",
  },
  timeText: {
    position: "absolute",
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
  },
  navigationControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 32,
    marginBottom: 16,
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2C2C2E",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#00BFA5",
    justifyContent: "center",
    alignItems: "center",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  sequenceProgress: {
    fontSize: 16,
    color: "#8E8E93",
    marginBottom: 8,
  },
  overlappingIcon: {
    marginLeft: -15,
  },
  cycleRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  cycleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2C2C2E",
    justifyContent: "center",
    alignItems: "center",
  },
  cycleButtonText: {
    color: "#00BFA5",
    fontSize: 24,
    fontWeight: "bold",
  },
  topControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 32,
    marginTop: -8,
    marginBottom: 24,
  },
});

export default TimerScreen;