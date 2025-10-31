import React, { useEffect, useState } from "react";
import { Button, Image, StyleSheet, Text, TextInput, View } from "react-native";
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'

WebBrowser.maybeCompleteAuthSession();

type LoginScreenProps = {
  onLogin: (user?: { name: string; email: string; picture: string }) => void;
};

const GOOGLE_CLIENT_ID = '435752227605-e8cvgppg1j23j13vc07k45fer3b2j5v4.apps.googleusercontent.com';

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export default function OAuthLogin({ onLogin }: LoginScreenProps) {
    //   const [username, setUsername] = useState("");
    //   const [password, setPassword] = useState("");
    const [userInfo, setUserInfo] = useState<any>(null);
    const [request, response, promptAsync] = AuthSession.useAuthRequest(
      {
        clientId: GOOGLE_CLIENT_ID,
        redirectUri: AuthSession.makeRedirectUri({
         scheme: "reactnativetest"
        }),
        scopes: ["openid", "profile", "email"],
      },
      discovery
    );

    useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      fetchUserInfo(authentication?.accessToken);
    }
  }, [response]);

  const fetchUserInfo = async (token: string | undefined) => {
    if (!token) return;
    const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = await res.json();
    setUserInfo(user);
    onLogin(user); // login sukses
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login with Google</Text>
       {userInfo ? (
        <View style={styles.profile}>
          <Image
            source={{ uri: userInfo.picture }}
            style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 10 }}
          />
          <Text>{userInfo.name}</Text>
          <Text>{userInfo.email}</Text>
        </View>
      ) : (
        <Button
          title="Continue with Google"
          onPress={() => promptAsync()}
          disabled={!request}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 28, textAlign: "center", marginBottom: 24 },
    profile: { alignItems: 'center', marginTop: 20 },
});
