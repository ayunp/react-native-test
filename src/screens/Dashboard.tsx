import React, { useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { Button, StyleSheet, Text, View, ProgressBarAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { incrementSteps, reset } from "../redux/stepSlice";
import store, { RootState } from "../redux/store";
import * as Progress from 'react-native-progress';


type DashboardNavProp = NativeStackNavigationProp<RootStackParamList, "Tabs">;

export default function Dashboard() {
  const nav = useNavigation<DashboardNavProp>();  
  const { steps, points } = useSelector((state: RootState) => state.vitality);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      console.log('*** Redux store:', store.getState());
    });
    return unsubscribe;
  }, []);

  const progress = Math.min(points / 100, 1); // 100 points = 100%


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text>👣 Steps: {steps}</Text>
      <Text>💎 Points: {points}</Text>
      <View style={styles.buttons}>
        <Button title="+ Add 100 Steps" onPress={() => dispatch(incrementSteps(100))}
        />
        <Button title="Reset" color="gray" onPress={() => dispatch(reset())} />
      </View>

       <Text style={styles.progressText}>Progress</Text>
      <Progress.Bar progress={progress} width={200} color="#4CAF50" />
      <View>
      <Button
        title="Go to Details"
        onPress={() => nav.navigate("Details", { id: 42 })}
      />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  buttons: { marginTop: 20, gap: 10 },
  progressText: {}
});


