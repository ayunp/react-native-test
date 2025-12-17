import React, { useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function SyncGarmin() {
    const [token, setToken] = useState<string | null>(null);


  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          {!token ? (
            <>
             <Image source={require("../../assets/garmin-logo.png")}
                style={{ width: 200, height: 200, resizeMode: "contain", alignSelf: "center"}}
                />
              <TouchableOpacity style={styles.button} >
                <Text style={styles.buttonText}>Connect with Garmin</Text>
              </TouchableOpacity>
            </>
          ) : (
            <></>
          )
        }
    </View>
  )
}

const styles = StyleSheet.create({
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
})
