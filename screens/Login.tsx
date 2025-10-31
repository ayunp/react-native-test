import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { RootStackParamList } from "../App";

type LoginScreenProps = {
  onLogin: () => void;
};

type StackNavProp = NativeStackNavigationProp<RootStackParamList, "Login">;

export default function Login({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
    const nav = useNavigation<StackNavProp>();

  const handleLogin = () => {
    if (username && password) {
      onLogin();
    } else {
      alert("Please enter username & password!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="LOGIN" onPress={handleLogin} />
      <View style={{ height: 10 }} />
      <Button title="LOGIN with GOOGLE" onPress={() => nav.navigate("OAuthLogin")}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 28, textAlign: "center", marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  }
});
