import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { TimerProvider } from './src/context/TimerContext';
import RootNavigator from './src/navigation/RootNavigator';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TimerProvider>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" />
          <RootNavigator />
        </NavigationContainer>
      </TimerProvider>
    </GestureHandlerRootView>
  );
} 