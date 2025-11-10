import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from '@expo/vector-icons';

WebBrowser.maybeCompleteAuthSession();

const clientId = "23TPZD";
const redirectUri = AuthSession.makeRedirectUri({
  scheme: "reactnativetest",
  path: "auth",
});

const discovery = {
  authorizationEndpoint: "https://www.fitbit.com/oauth2/authorize",
  tokenEndpoint: "https://api.fitbit.com/oauth2/token",
  revocationEndpoint: "https://api.fitbit.com/oauth2/revoke",
};

export default function SyncFitbit() {
  const [token, setToken] = useState<string | null>(null);
  const [steps, setSteps] = useState<number | null>(null);
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [sleep, setSleep] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      scopes: ["activity", "heartrate", "sleep", "profile"],
      redirectUri,
      responseType: "token",
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      setToken(access_token);
    }
  }, [response]);

  const fetchFitbitData = async (accessToken: string) => {
    try {
      // Get today’s activity data
      const activityRes = await fetch(
        "https://api.fitbit.com/1/user/-/activities/date/today.json",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const activityData = await activityRes.json();

      // Get heart rate
      const heartRes = await fetch(
        "https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const heartData = await heartRes.json();

      // Get sleep data
      const sleepRes = await fetch(
        "https://api.fitbit.com/1.2/user/-/sleep/date/today.json",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const sleepData = await sleepRes.json();

      setSteps(activityData.summary?.steps ?? 0);
      setHeartRate(heartData["activities-heart"]?.[0]?.value?.restingHeartRate ?? 0);

      const minutesAsleep = sleepData.summary?.totalMinutesAsleep ?? 0;
      const h = Math.floor(minutesAsleep / 60);
      const m = minutesAsleep % 60;
      setSleep(`${h}h ${m}m`);

      setLastSynced(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Fitbit fetch error:", error);
    }
  };

   const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to disconnect Fitbit?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          setToken(null);
          setSteps(null);
          setHeartRate(null);
          setSleep(null);
          setLastSynced(null);
        },
      },
    ]);
  };


  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {!token ? (
        <>
          <Text style={styles.title}>Connect to Fitbit</Text>
          <TouchableOpacity style={styles.button} onPress={() => promptAsync()}>
            <Text style={styles.buttonText}>Login with Fitbit</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
        <View style={styles.dataContainer}>
          <Text style={styles.sectionTitle}>Sync status</Text>
          <Text style={styles.subText}>
            Last synced: {lastSynced ? `${lastSynced}` : "Just now"}
          </Text>

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
            Fetched Data
          </Text>

          <View style={styles.card}>
            <View style={styles.row}>
            <Ionicons
              name={"footsteps"}
              size={50}
              color={"#8B0023"}
              style={{ paddingRight: 10 }}
            />
            <View>
              <Text style={styles.label}>Steps</Text>
              <Text style={styles.value}>{steps ? steps?.toLocaleString() : 0}</Text>
            </View>
            </View>
            <View style={styles.row}>
             <Ionicons
              name={"heart"}
              size={50}
              color={"#8B0023"}
              style={{ paddingRight: 10 }}
            />
            <View>
              <Text style={styles.label}>Heart rate</Text>
              <Text style={styles.value}>{heartRate ? heartRate : 0} bpm</Text>
            </View>
            </View>
            <View style={styles.row}>
             <Ionicons
              name={"bed"}
              size={50}
              color={"#8B0023"}
              style={{ paddingRight: 10 }}
            />
            <View>
              <Text style={styles.label}>Sleep</Text>
              <Text style={styles.value}>{sleep ? sleep : 0}</Text>
            </View>
            </View>
          </View>

          <TouchableOpacity style={[styles.button, {marginTop: 10, backgroundColor: '#c74657ff'}]} onPress={() => handleLogout()}>
            <Text style={styles.buttonText}>Disconnect to Fitbit</Text>
          </TouchableOpacity>
        </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
  },
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
    paddingHorizontal: 40,
  },
  center: {
    alignItems: "center",
  },
  dataContainer: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  subText: {
    fontSize: 14,
    color: "#666",
  },
   card: {
    // width: "100%",
    backgroundColor: "#F9F9F9",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 30,
  },
  row: {
    borderBottomColor: "#EAEAEA",
    borderBottomWidth: 1,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center"
  },
  label: {
    fontSize: 16,
    color: "#555",
  },
  value: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 4,
  },
});
