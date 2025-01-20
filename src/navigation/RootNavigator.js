import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import TimerStackNavigator from './TimerStackNavigator';
import IdeasStackNavigator from './IdeasStackNavigator';
import MoreStackNavigator from './MoreStackNavigator';
import MyTimersStackNavigator from './MyTimersStackNavigator';

const Tab = createBottomTabNavigator();

const RootNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: '#1C1C1E',
        },
        headerTitleStyle: {
          color: '#fff',
        },
        tabBarStyle: {
          backgroundColor: '#1C1C1E',
          borderTopColor: '#2C2C2E',
        },
        tabBarActiveTintColor: '#00BFA5',
        tabBarInactiveTintColor: '#fff',
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home-sharp' : 'home-outline';
          } else if (route.name === 'My Routines') {
            iconName = focused ? 'stopwatch' : 'stopwatch-outline';
          } else if (route.name === 'Explore') {
            iconName = focused ? 'bulb-sharp' : 'bulb-outline';
          } else if (route.name === 'More') {
            iconName = focused ? 'menu-sharp' : 'menu-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen 
        name="My Routines" 
        component={MyTimersStackNavigator}
      />
      <Tab.Screen 
        name="Explore" 
        component={IdeasStackNavigator}
      />
      <Tab.Screen 
        name="More" 
        component={MoreStackNavigator}
      />
    </Tab.Navigator>
  );
};

export default RootNavigator; 