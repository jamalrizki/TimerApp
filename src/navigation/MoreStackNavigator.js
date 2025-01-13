import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MoreScreen from '../screens/MoreScreen';
import SoundsScreen from '../screens/SoundsScreen';
import CalendarScreen from '../screens/CalendarScreen';
import ContactScreen from '../screens/ContactScreen';

const Stack = createStackNavigator();

const MoreStackNavigator = () => {
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
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen 
        name="MoreScreen"
        component={MoreScreen}
        options={{ 
          title: 'More'
        }}
      />
      <Stack.Screen 
        name="Sounds" 
        component={SoundsScreen}
        options={{ 
          title: 'Timer Sounds'
        }}
      />
      <Stack.Screen 
        name="Calendar" 
        component={CalendarScreen}
        options={{ 
          title: 'Session History'
        }}
      />
      <Stack.Screen 
        name="Contact" 
        component={ContactScreen}
        options={{ 
          title: 'Contact',
        }}
      />
    </Stack.Navigator>
  );
};

export default MoreStackNavigator; 