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
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
          tabBarStyle: {
            backgroundColor: theme.colors.secondary,
            borderTopWidth: 0,
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
      </Tabs>
    </TabBarVisibilityProvider>
  )
}
