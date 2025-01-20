// import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import MyTimersScreen from '../screens/MyTimersScreen';
// import TimerDetailsScreen from '../screens/TimerDetailsScreen';
// import TimerScreen from '../screens/TimerScreen';
// import CreateFolderScreen from '../screens/CreateFolderScreen';
// import PlaylistDetailScreen from '../screens/PlaylistDetailScreen';

// const Stack = createStackNavigator();

// const TimerStackNavigator = () => {
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         headerStyle: {
//           backgroundColor: '#1C1C1E',
//         },
//         headerTitleStyle: {
//           color: '#fff',
//         },
//         headerTintColor: '#00BFA5',
//         headerBackTitle: 'My Timers',
//       }}
//     >
//       <Stack.Screen 
//         name="MyTimers"
//         component={MyTimersScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen 
//         name="CreateFolder" 
//         component={CreateFolderScreen}
//         options={{ title: 'Create Routine' }}
//       />
//       <Stack.Screen 
//         name="PlaylistDetail"
//         component={PlaylistDetailScreen}
//         options={{ 
//           title: 'Playlist Details', 
//           headerBackTitle: 'My Timers'
//         }}
//       />
//       <Stack.Screen 
//         name="TimerDetails" 
//         component={TimerDetailsScreen}
//         options={({ route }) => ({ 
//           title: route.params?.timer ? 'Timer Details' : 'Create Timer'
//         })}
//       />
//       <Stack.Screen 
//         name="Timer" 
//         component={TimerScreen}
//         options={{ title: 'Timer' }}
//       />
//     </Stack.Navigator>
//   );
// };

// export default TimerStackNavigator; 