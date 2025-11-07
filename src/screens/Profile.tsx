import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Alert, Button, Image, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { clearUser } from "../redux/userSlice";

type ProfileScreenProps = {
  onLogout: () => void;
};

export default function Profile({ onLogout }: ProfileScreenProps) {
  const [user, setUser] = useState<{ name: string; email: string; photo?: string; username?: string } | null>(null);
  const userData= useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('user');
        if (stored) {
            const parsedUser = JSON.parse(stored);
            setUser(parsedUser);
        }
      } catch (e) {
        console.error('Failed to load user:', e);
      }
    }
    loadUser();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await GoogleSignin.signOut();
              dispatch(clearUser());
              onLogout?.(); // optional callback to navigate, etc.
            } catch (error) {
              console.error("Error signing out: ", error);
            }
          }, 
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {user?.photo ? (<Image source={{ uri: user.photo }} style={styles.avatar} />)
       : (<Image source={require("../../assets/default-avatar.png")} style={styles.avatar}/>)}

      <Text style={styles.name}> {user?.name ? user?.name : user?.username}</Text>
      {user?.email ? (<Text style={styles.email}>{user?.email}</Text>) 
      : (<View style={{ paddingBottom: 10 }} />)}
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

  const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 30,
  },
  avatar: { 
    width: 120, 
    height: 120,
    borderRadius: 60
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    paddingTop: 10
  },
  email: {
    fontSize: 16,
    color: '#777',
    marginTop: 2,
    paddingBottom: 10
  },
  button: {
    backgroundColor: '#c3142bff',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 8,
    elevation: 3,
    marginTop: 40
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
 
  })