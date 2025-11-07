import React, { useEffect, useState } from "react";
import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Alert, Image, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";


const WEB_CLIENT_ID = "435752227605-e8cvgppg1j23j13vc07k45fer3b2j5v4.apps.googleusercontent.com";

GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID
});

type LoginScreenProps = {
  onLogin: (user?: { name: string; email: string; photo: string }) => void;
};

export default function OAuthGoogle({ onLogin }: LoginScreenProps) {
  const [userInfo, setUserInfo] = useState<any>(null);
  const dispatch = useDispatch();
  
  const handleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        setUserInfo(response.data);
        if (userInfo && userInfo.user) {
          onLogin({
            name: userInfo.user.name,
            email: userInfo.user.email,
            photo: userInfo.user.photo,
          });
          dispatch(setUser({
            name: userInfo.user.name,
            email: userInfo.user.email,
            picture: userInfo.user.photo,
            token: userInfo.idToken
          }));
        } 
      } else {
        console.log("log in was cancelled by user");
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            Alert.alert("Log in already in progress")
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert("Play services not available or outdated");
            break;
          default:
          // some other error happened
        }
      } else {
        Alert.alert("An error that's not related to google sign in occurred");
      }
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
          <View style={styles.inner}>
            {userInfo ? (
              <View style={styles.profile}>
                <Image
                  source={{ uri: userInfo.user.photo }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    marginBottom: 10,
                  }}
                />
                <Text>{userInfo.user.name}</Text>
                <Text>{userInfo.user.email}</Text>
              </View>
            ) : (
              <View>
               <Image
                  source={require("../../assets/google-logo.png")}
                  style={{ width: 300, height: 150, resizeMode: "contain" }}
                />
                <Text style={styles.title}>Login with Google</Text>

              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Continue with Google</Text>
              </TouchableOpacity>
              {/* <GoogleSigninButton style={styles.button} onPress={handleLogin}></GoogleSigninButton> */}
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#F9F9F9" },
  inner: { marginHorizontal: 30 },
  title: { fontSize: 28, textAlign: "center", marginBottom: 24, marginTop: 20 },
  profile: { alignItems: 'center', marginTop: 20 },
  button: {
    backgroundColor: "#c3142bff",
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
   buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});