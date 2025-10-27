import { AnimatedTabBar } from "@/components/AnimatedTabBar"
import { TabBarVisibilityProvider } from "@/context/TabBarVisibilityContext"
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons"
import { Tabs } from "expo-router"
import React from "react"
import { View } from "react-native"
import { useTheme } from "react-native-paper"

export default function TabLayout() {
  const theme = useTheme()
  return (
    <TabBarVisibilityProvider>
      <Tabs
        screenOptions={() => ({
          tabBarActiveTintColor: theme.colors.primary,
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
          name="create"
          options={{
            tabBarLabel: "",
            tabBarIcon: ({ color, size }) => (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: color,
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  shadowColor: color,
                  shadowOpacity: 0.18,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 4,
                }}
              >
                <FontAwesome6 name="plus" color={theme.colors.onBackground} size={size || 28} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="groups"
          options={{
            tabBarLabel: "",
            tabBarIcon: ({ color, size }) => <FontAwesome6 name="users" color={color} size={size || 24} />,
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
