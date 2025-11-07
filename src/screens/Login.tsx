import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../../App";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';

type LoginScreenProps = {
  onLogin: (user?: {
    name?: string;
    email?: string;
    photo?: string;
    username?: string;
    // token?: string | null;
  }) => void;
};

type StackNavProp = NativeStackNavigationProp<RootStackParamList, "Login">;

export default function Login({ onLogin }: LoginScreenProps) {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigation<StackNavProp>();
  const dispatch = useDispatch();

  const handleLogin = () => {
    if (username && password) {
      onLogin({ username });
      dispatch(setUser({username}));
    } else {
      alert("Please enter username & password!");
    }
  };

  const handleGoogleLogin = async () => {
      try {
        await GoogleSignin.hasPlayServices();
        const response = await GoogleSignin.signIn();
        if (isSuccessResponse(response)) {
          const userData = response.data;
          setUserInfo(userData);
          if (userData && userData.user) {
            onLogin({
              name: userData.user.name!,
              email: userData.user.email,
              photo: userData.user.photo!,
            });
            dispatch(setUser({
              name: userData.user.name!,
              email: userData.user.email,
              picture: userData.user.photo!,
              token: userData.idToken
            }));
          }
        } else {
          console.log("log in was cancelled by user");
        }
      } catch (error) {
        if (isErrorWithCode(error)) {
          switch (error.code) {
            case statusCodes.IN_PROGRESS:
              alert("Log in already in progress")
              break;
            case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
              alert("Play services not available or outdated");
              break;
            default:
            // some other error happened
          }
        } else {
          alert("An error that's not related to google sign in occurred");
        }
      }
    }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.inner}>
        <Image
          source={require("../../assets/login-header.png")}
          style={{ width: 300, height: 350, resizeMode: "contain" }}
        />
        <Text style={styles.title}>
          Welcome Back!
        </Text>
        <Text style={styles.subtitle}>
          Log in to continue your journey
        </Text>
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
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.googleButton]} onPress={handleGoogleLogin}>
          <Text style={styles.buttonText}>Login with Google</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F9F9F9",
  },
  inner: {
    marginHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
    color: "#666"
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#ed1f3bff",
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
  googleButton: {
    backgroundColor: "#c3142bff",
  }
});
