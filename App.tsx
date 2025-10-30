import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { StackScreen } from 'react-native-screens';
import Dashboard from './screens/Dashboard';
import Assesments from './screens/Assesments';
import Challenges from './screens/Challenges';
import Rewards from './screens/Rewards';
import Profile from './screens/Profile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Details from './screens/Details';

export type RootStackParamList = {
  Tabs: undefined;
  Details: {id: number};
}

export type TabParamList = {
  Dashboard: undefined;
  Assesments: undefined;
  Challenges: undefined;
  Rewards: undefined;
  Profile: undefined;
}

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Tabs Navigator
function TabsNavigator() {
  return (
    <Tab.Navigator screenOptions={({route}) => ({
      headerShown: false,
      tabBarIcon: ({color, size}) => {
        let icon: keyof typeof Ionicons.glyphMap = 'home';
        if (route.name === 'Assesments') icon = 'create-outline'
        if (route.name === 'Challenges') icon = 'golf-outline'
        if (route.name === 'Rewards') icon = 'ribbon-outline'
        if (route.name === 'Profile') icon = 'person-outline'
        return <Ionicons name={icon} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007aff',
      tabBarInactiveTintColor: 'gray',
    })}>
      <Tab.Screen name="Dashboard" component={Dashboard}/>
      <Tab.Screen name="Assesments" component={Assesments}/>
      <Tab.Screen name="Challenges" component={Challenges}/>
      <Tab.Screen name="Rewards" component={Rewards}/>
      <Tab.Screen name="Profile" component={Profile}/>
    </Tab.Navigator>
  )
}

// Main Stack Navigator
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Tabs" component={TabsNavigator} options={{ headerShown: false}}/>
        <Stack.Screen name="Details" component={Details}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
