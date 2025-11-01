import React, { useEffect, useState } from "react";
import { Button, Image, StyleSheet, Text, TextInput, View } from "react-native";
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

type LoginScreenProps = {
  onLogin: (user?: { name: string; email: string; picture: string }) => void;
};

const GOOGLE_CLIENT_ID = "435752227605-df00fm45fv1565efdip8ji2fi8c46k59.apps.googleusercontent.com";
const REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: "reactnativetest",
  preferLocalhost: false,
  path: "auth",
});

export default function OAuthLogin({ onLogin }: LoginScreenProps) {
  const discovery = AuthSession.useAutoDiscovery("https://accounts.google.com");
  const [userInfo, setUserInfo] = useState<any>(null);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      redirectUri: REDIRECT_URI,
      scopes: ["openid", "profile", "email"],
      responseType: "id_token",
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const id_token = response.params.id_token;
      if (id_token) fetchUserInfo(id_token);
    }
  }, [response]);

  const fetchUserInfo = async (id_token: string) => {
    try {
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${id_token}` },
      });
      const user = await res.json();
      setUserInfo(user);
      onLogin(user);
    } catch (e) {
      console.error("Failed to fetch user info", e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login with Google</Text>
      {userInfo ? (
        <View style={styles.profile}>
          <Image
            source={{ uri: userInfo.picture }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              marginBottom: 10,
            }}
          />
          <Text>{userInfo.name}</Text>
          <Text>{userInfo.email}</Text>
        </View>
      ) : (
        <Button title="Continue with Google" onPress={() => promptAsync()} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 28, textAlign: "center", marginBottom: 24 },
    profile: { alignItems: 'center', marginTop: 20 },
});
