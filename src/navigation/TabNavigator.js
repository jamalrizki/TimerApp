import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeStack from './HomeStack';
import MyTimersStack from './MyTimersStack';
import ExploreStack from './ExploreStack';
import MoreStack from './MoreStack';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'My Timers') {
            iconName = focused ? 'timer' : 'timer-outline';
          } else if (route.name === 'Explore') {
            iconName = focused ? 'bulb' : 'bulb-outline';
          } else if (route.name === 'More') {
            iconName = focused ? 'menu' : 'menu-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00BFA5',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#1C1C1E',
          borderTopColor: '#2C2C2E',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="My Timers" component={MyTimersStack} />
      <Tab.Screen name="Explore" component={ExploreStack} />
      <Tab.Screen name="More" component={MoreStack} />
    </Tab.Navigator>
  );
};

export default TabNavigator; 