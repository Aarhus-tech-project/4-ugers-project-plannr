import { AnimatedTabBar } from "@/components/AnimatedTabBar"
import { TabBarVisibilityProvider } from "@/context/TabBarVisibilityContext"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons"
import { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import { Tabs } from "expo-router"
import React from "react"
import { View } from "react-native"

export default function TabLayout() {
  const theme = useCustomTheme()
  const customTabBar = (props: BottomTabBarProps) => {
    const routeName = props.state?.routeNames?.[props.state?.index] || ""
    if (routeName === "create") {
      // Hide the tab bar for the create tab; it will be rendered in create.tsx
      return null
    }
    return <AnimatedTabBar {...props} />
  }
  return (
    <TabBarVisibilityProvider>
      <Tabs
        screenOptions={() => ({
          tabBarActiveTintColor: theme.colors.brand.red,
          tabBarInactiveTintColor: theme.colors.gray[700],
          tabBarStyle: {
            backgroundColor: theme.colors.gray[900],
            borderTopWidth: 0,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          },
          headerShown: false,
        })}
        tabBar={customTabBar}
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
                  width: 30,
                  height: 30,
                  borderRadius: 10,
                }}
              >
                <FontAwesome6 name="plus" color={theme.colors.gray[900]} size={size || 24} />
              </View>
            ),
            // Show tab bar for create, but content is context-driven
            tabBarStyle: {},
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
