import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MyTimersScreen from '../screens/MyTimersScreen';
import PlaylistDetailScreen from '../screens/PlaylistDetailScreen';
import TimerDetailsScreen from '../screens/TimerDetailsScreen';
import CreateFolderScreen from '../screens/CreateFolderScreen';
import TimerScreen from '../screens/TimerScreen';

const Stack = createStackNavigator();

const MyTimersStackNavigator = () => {
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
        name="MyTimers" 
        component={MyTimersScreen}
        options={{ 
          title: 'My Timer Playlist'
        }}
      />
      <Stack.Screen 
        name="PlaylistDetail"
        component={PlaylistDetailScreen}
        options={{ 
          title: 'Playlist Details',
          headerBackTitle: 'Back'
        }}
      />
      <Stack.Screen 
        name="TimerDetails" 
        component={TimerDetailsScreen}
        options={({ route }) => ({ 
          title: route.params?.timer ? 'Timer Details' : 'Create Timer'
        })}
      />
      <Stack.Screen 
        name="Timer" 
        component={TimerScreen}
        options={{ title: 'Timer' }}
      />
      <Stack.Screen 
        name="CreateFolder" 
        component={CreateFolderScreen}
        options={{ title: 'Create Playlist' }}
      />
    </Stack.Navigator>
  );
};

export default MyTimersStackNavigator; 