import { FontAwesome, FontAwesome6 } from "@expo/vector-icons"
import { Tabs } from "expo-router"
import React from "react"
import { useTheme } from "react-native-paper"

export default function TabLayout() {
  const theme = useTheme()
  const bg = theme.colors.background
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: bg,
          borderTopColor: bg,
          display: route.name === "finder" ? "none" : undefined,
        },
        headerStyle: {
          backgroundColor: bg,
        },
        headerShown: false,
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ color, size }) => <FontAwesome6 name="house" color={color} size={size || 24} />,
        }}
      />
      <Tabs.Screen
        name="finder"
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ color, size }) => <FontAwesome name="heart" color={color} size={size || 24} />,
        }}
      />
    </Tabs>
  )
}
