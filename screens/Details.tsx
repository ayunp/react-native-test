import React from 'react'
import { RootStackParamList } from '../App'
import { RouteProp, useRoute } from '@react-navigation/native'
import { Text, View } from 'react-native';

type ProfileNavProp = RouteProp<RootStackParamList, 'Details'>;

export default function Details() {
    const route = useRoute<ProfileNavProp>();

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Details Screen</Text>
            <Text>Item ID: {route.params.id}</Text>
        </View>
    )
}