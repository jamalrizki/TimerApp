import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import IdeasScreen from '../screens/IdeasScreen';
import TimerScreen from '../screens/TimerScreen';

const Stack = createStackNavigator();

const IdeasStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1C1C1E',
        },
        headerTitleStyle: {
          color: '#fff',
        },
        headerTintColor: '#00BFA5',
      }}
    >
      <Stack.Screen 
        name="IdeasList"
        component={IdeasScreen}
        options={{ 
          title: 'Explore',
          headerShown: true  // Show header for main Explore screen
        }}
      />
      <Stack.Screen 
        name="Timer" 
        component={TimerScreen}
        options={{ title: 'Timer' }}
      />
    </Stack.Navigator>
  );
};

export default IdeasStackNavigator; 