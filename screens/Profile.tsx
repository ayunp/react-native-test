import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Alert, Button, Image, Text, View } from "react-native";

type ProfileScreenProps = {
  onLogout: () => void;
};

export default function Profile({ onLogout }: ProfileScreenProps) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
        const stored = await AsyncStorage.getItem('user');
        if (stored) setUser(JSON.stringify(stored));
    };
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
      <Image source={{ uri: user.picture }}></Image>
      <Text>{user.name}</Text>
      <Text>{user.email}</Text>
      <Button title="LOGOUT" onPress={handleLogout} />
    </View>
  );
}
