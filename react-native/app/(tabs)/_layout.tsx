import { AnimatedTabBar } from "@/components/AnimatedTabBar"
import { TabBarVisibilityProvider } from "@/context/TabBarVisibilityContext"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons"
import { Tabs } from "expo-router"
import React from "react"
import { View } from "react-native"

export default function TabLayout() {
  const theme = useCustomTheme()
  return (
    <TabBarVisibilityProvider>
      <Tabs
        screenOptions={() => ({
          tabBarActiveTintColor: theme.colors.brand.red,
          tabBarInactiveTintColor: theme.colors.gray[700],
          tabBarStyle: {
            backgroundColor: theme.colors.gray[900],
            borderTopWidth: 0,
            paddingTop: 10,
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
            height: 80,
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
                }}
              >
                <FontAwesome6 name="plus" color={theme.colors.gray[900]} size={size || 28} />
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
