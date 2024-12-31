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
        name="TimersList" 
        component={MyTimersScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CreateFolder" 
        component={CreateFolderScreen}
        options={{ title: 'Create Folder' }}
      />
      <Stack.Screen 
        name="FolderDetail"
        component={FolderDetailScreen}
        options={{ title: 'Folder Details' }}
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
      <Stack.Screen 
        name="CreateTimer" 
        component={CreateTimerScreen}
        options={{ title: 'Create Timer' }}
      />
    </Stack.Navigator>
  );
};

export default TimerStackNavigator; 