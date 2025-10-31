import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Dashboard from "./screens/Dashboard";
import Assesments from "./screens/Assesments";
import Challenges from "./screens/Challenges";
import Rewards from "./screens/Rewards";
import Profile from "./screens/Profile";
import Details from "./screens/Details";
import Login from "./screens/Login";
import OAuthLogin from "./screens/OAuth-Login";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type RootStackParamList = {
  Login: undefined;
  OAuthLogin: undefined;
  Tabs: undefined;
  Details: { id: number };
};

export type TabParamList = {
  Dashboard: undefined;
  Assesments: undefined;
  Challenges: undefined;
  Rewards: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Tabs Navigator
function TabsNavigator({ onLogout }: { onLogout: () => void }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let icon: keyof typeof Ionicons.glyphMap = "home";
          if (route.name === "Assesments") icon = "create-outline";
          if (route.name === "Challenges") icon = "golf-outline";
          if (route.name === "Rewards") icon = "ribbon-outline";
          if (route.name === "Profile") icon = "person-outline";
          return <Ionicons name={icon} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007aff",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Assesments" component={Assesments} />
      <Tab.Screen name="Challenges" component={Challenges} />
      <Tab.Screen name="Rewards" component={Rewards} />
      <Tab.Screen name="Profile">
        {(props) => <Profile {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// Main Stack Navigator
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean | null>(null);

  // Cek login status saat app dibuka
  React.useEffect(() => {
    const loadLoginState = async () => {
      const stored = await AsyncStorage.getItem("isLoggedIn");
      setIsLoggedIn(stored === "true");
    };
    loadLoginState();
  }, []);

  const handleLogin = async (user?: { name: string; email: string; picture: string }) => {
    await AsyncStorage.setItem("isLoggedIn", "true");
    if (user) {
      AsyncStorage.setItem('user', JSON.stringify(user));
    }
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  if (isLoggedIn === null) {
    // tampilkan loading saat cek storage
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <>
          <Stack.Screen name="Login">
            {(props) => (
              <Login {...props} onLogin={() => setIsLoggedIn(true)}></Login>
            )}
          </Stack.Screen>
          <Stack.Screen name="OAuthLogin" options={{ headerShown: true }}>
            {(props) => (
              <OAuthLogin {...props} onLogin={handleLogin}></OAuthLogin>
            )}
          </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="Tabs" options={{ headerShown: false }}>
               {(props) => <TabsNavigator {...props} onLogout={handleLogout}/>}
            </Stack.Screen>
            <Stack.Screen name="Details" component={Details}  options={{ headerShown: true }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}