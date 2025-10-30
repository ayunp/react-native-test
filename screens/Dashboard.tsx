import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React from 'react'
import { RootStackParamList } from '../App'
import { useNavigation } from '@react-navigation/native';
import { Button, Text, View } from 'react-native';

type DashboardNavProp = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

export default function Dashboard() {
    const nav = useNavigation<DashboardNavProp>();

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Dashboard</Text>
        <Button
            title="Go to Details"
            onPress={() => nav.navigate('Details', { id: 42 })}
        />
        </View>
    )
}