import { AnimatedTabBar } from "@/components/AnimatedTabBar"
import { TabBarVisibilityProvider } from "@/context/TabBarVisibilityContext"
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons"
import { Tabs } from "expo-router"
import React from "react"
import { useTheme } from "react-native-paper"

export default function TabLayout() {
  const theme = useTheme()
  return (
    <TabBarVisibilityProvider>
      <Tabs
        screenOptions={() => ({
          tabBarActiveTintColor: theme.colors.background,
          tabBarInactiveTintColor: theme.colors.scrim,
          tabBarStyle: {
            backgroundColor: theme.colors.tertiary,
            borderTopWidth: 0,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          },
          headerShown: false,
        })}
        tabBar={(props) => <AnimatedTabBar {...props} />}
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
        <Tabs.Screen
          name="settings"
          options={{
            tabBarLabel: "",
            tabBarIcon: ({ color, size }) => <FontAwesome name="user" color={color} size={size || 24} />,
          }}
        />
      </Tabs>
    </TabBarVisibilityProvider>
  )
}
