import { Button, Surface, Text, useTheme } from "react-native-paper"

import React from "react"

export default function Home() {
  const theme = useTheme()
  const bg = theme.colors.background
  return (
    <Surface
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: bg,
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
      <Text
        style={{
          fontStyle: "italic",
          textAlign: "center",
          marginTop: 8,
          marginBottom: 32,
          fontSize: 18,
          color: "#A0A0A0",
          letterSpacing: 0.2,
        }}
      >
        "The best way to get things done is to begin."
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
    </Surface>
  )
}
