import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View, KeyboardAvoidingView, TouchableOpacity, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { incrementSteps, reset } from "../redux/stepSlice";
import store, { RootState } from "../redux/store";
import * as Progress from 'react-native-progress';
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";


type DashboardNavProp = NativeStackNavigationProp<RootStackParamList, "Tabs">;

export default function Dashboard() {
  const nav = useNavigation<DashboardNavProp>();  
  const [user, setUser] = useState<{ name: string; email: string; picture?: string; username?: string } | null>(null);
  const { steps, points } = useSelector((state: RootState) => state.step);
  const { name, username } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      console.log('*** Redux store:', store.getState().step);
    });
    return unsubscribe;
  }, []);

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

  const progress = Math.min(points / 100, 1); // 100 points = 100%


  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.inner}>
        <Image
          source={require("../../assets/running-man.png")}
          style={{ width: 200, height: 200, resizeMode: "contain", alignSelf: "center"}}
        />
        <Text style={styles.title}>Hi, {user?.name ? user?.name : user?.username}</Text>

        <View style={styles.card}>
          <View style={styles.statRow}>
            <Ionicons
              name={"footsteps"}
              size={50}
              color={"#8B0023"}
              style={{ paddingRight: 10 }}
            />
            <View>
              <Text style={styles.label}>Steps:</Text>
              <Text style={styles.value}>{steps.toLocaleString()}</Text>
            </View>
          </View>

          <View style={[styles.statRow, { marginTop: 10 }]}>
            <Ionicons
              name={"diamond"}
              size={50}
              color={"#8B0023"}
              style={{ paddingRight: 10 }}
            />
            <View>
              <Text style={styles.label}>Points:</Text>
              <Text style={styles.value}>{points}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => dispatch(incrementSteps(100))}
        >
          <Text style={styles.buttonText}>+ Add 100 Steps</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => dispatch(reset())}
        >
          <Text style={[styles.buttonText, { color: "#222" }]}>Reset</Text>
        </TouchableOpacity>

        <View style={{ width: "100%" }}>
          <Text style={styles.progressLabel}>Progress</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Progress.Bar
              progress={progress}
              width={null}
              color="#ed1f3bff"
              unfilledColor="#EDEDED"
              borderWidth={0}
              height={12}
              style={styles.progressBar}
            />
            <Text style={styles.progressText}>
              {Math.round(progress * 100)}%
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
  },
  inner: {
    marginHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 30,
    color: "#68001aff",
  },
  card: {
    width: "100%",
    backgroundColor: "#F9F9F9",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 30,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    color: "#444",
  },
  value: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
  },
  addButton: {
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
  resetButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  progressLabel: {
    marginTop: 20,
    fontSize: 14,
    color: "#444",
     fontWeight: "600",
  },
  progressBar: {
    width: 280,
    height: 6,
    marginTop: 5,
    borderRadius: 10,
  },
  progressText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
  },
});


