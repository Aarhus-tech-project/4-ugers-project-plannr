import React from "react"
import { View } from "react-native"
import { Button, Text } from "react-native-paper"

export default function Home() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        elevation: 0,
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 32,
          marginBottom: 16,
          textAlign: "center",
          letterSpacing: 0.5,
        }}
      >
        Welcome to Plannr
      </Text>
      <Button
        mode="contained"
        onPress={() => {}}
        style={{
          marginTop: 8,
          borderRadius: 24,
          minWidth: 200,
        }}
        labelStyle={{ fontWeight: "bold", fontSize: 18, color: "#fff" }}
      >
        Get Started
      </Button>
    </View>
  )
}
