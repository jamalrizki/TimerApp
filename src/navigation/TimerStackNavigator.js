import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MyTimersScreen from '../screens/MyTimersScreen';
import TimerDetailsScreen from '../screens/TimerDetailsScreen';
import TimerScreen from '../screens/TimerScreen';
import CreateTimerScreen from '../screens/CreateTimerScreen';
import CreateFolderScreen from '../screens/CreateFolderScreen';
import FolderDetailScreen from '../screens/FolderDetailScreen';

const Stack = createStackNavigator();

const TimerStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MyTimers"
        component={MyTimersScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CreateFolder" 
        component={CreateFolderScreen}
        options={{ title: 'Create Playlist' }}
      />
      <Stack.Screen 
        name="FolderDetail"
        component={FolderDetailScreen}
        options={{ title: 'Playlist Details' }}
      />
      <Stack.Screen 
        name="CreateTimer" 
        component={CreateTimerScreen}
        options={{ title: 'Create Timer' }}
      />
      <Stack.Screen 
        name="TimerDetails" 
        component={TimerDetailsScreen}
        options={{ title: 'Timer Details' }}
      />
      <Stack.Screen 
        name="Timer" 
        component={TimerScreen}
        options={{ title: 'Timer' }}
      />
    </Stack.Navigator>
  );
};

export default TimerStackNavigator; 