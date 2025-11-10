import { ActivityIndicator, View } from "react-native";
import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Dashboard from "./src/screens/Dashboard";
import Profile from "./src/screens/Profile";
import Login from "./src/screens/Login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import SyncFitbit from "./src/screens/SyncFitbit";

export type RootStackParamList = {
  Login: undefined;
  Tabs: undefined;
};

export type TabParamList = {
  Dashboard: {user?: { name?: string; username?: string }};
  SyncFitbit: undefined;
  Profile: {user?: { name?: string; emai?: string; picture?: string; username?: string }};
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
          if (route.name === "SyncFitbit") icon = "fitness-outline";
          if (route.name === "Profile") icon = "person-outline";
          return <Ionicons name={icon} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#f20b2aff",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="SyncFitbit" component={SyncFitbit} />
      <Tab.Screen name="Profile">
        {(props) => <Profile {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

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

  const handleLogin = async (user?: { name?: string; email?: string; picture?: string; username?:string }) => {
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
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="Login">
            {(props) => (
              <Login {...props} onLogin={handleLogin}></Login>
            )}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Tabs" options={{ headerShown: false }}>
               {(props) => (<TabsNavigator {...props} onLogout={handleLogout}/>)}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
}