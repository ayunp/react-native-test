import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Alert, Button, Image, StyleSheet, Text, View } from "react-native";

type ProfileScreenProps = {
  onLogout: () => void;
};

export default function Profile({ onLogout }: ProfileScreenProps) {
  const [user, setUser] = useState<{ name: string; email: string; picture?: string; username?: string } | null>(null);

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
          onPress: onLogout, 
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20 }}>Profile</Text>
      {user?.picture ? (<Image source={{ uri: user.picture }} style={styles.avatar}/>)
      : (<Image source={require('../../assets/default-avatar.png')} style={styles.avatar}/>)}
      <Text style={{paddingTop: 10 }}>{user?.name ? user?.name : user?.username}</Text>
      {user?.email ? (<Text style={{paddingBottom: 10 }}>{user?.email}</Text>) : (<View style={{paddingBottom: 10 }} />)}
      <Button title="LOG OUT" onPress={handleLogout}/>
    </View>
  );
}

  const styles = StyleSheet.create({
    avatar: { width: 100, height: 100 }
  })