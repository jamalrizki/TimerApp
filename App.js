import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { TimerProvider } from './src/context/TimerContext';
import RootNavigator from './src/navigation/RootNavigator';
import { StatusBar } from 'react-native';

export default function App() {
  return (
    <TimerProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <RootNavigator />
      </NavigationContainer>
    </TimerProvider>
  );
} 