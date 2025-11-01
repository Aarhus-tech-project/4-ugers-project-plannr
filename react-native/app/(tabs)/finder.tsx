import { useTabBarVisibility } from "@/context/TabBarVisibilityContext"
import mockEvents from "@/data/mockEvents.data"
import { useScrollDrivenAnimation } from "@/hooks/useScrollDrivenAnimation"

import EventPage from "@/components/EventPage"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import { FontAwesome6 } from "@expo/vector-icons"
import { useFocusEffect } from "@react-navigation/native"
import React, { useState } from "react"
import { Animated, TouchableOpacity, View } from "react-native"
import { Text } from "react-native-paper"

export default function Finder() {
  const theme = useCustomTheme()
  const { setScrollY } = useTabBarVisibility()

  // Track current event index
  const [current, setCurrent] = useState(0)
  const event = mockEvents[current]

  // Navigation logic
  const nextEvent = () => {
    setCurrent((prev) => (prev + 1 < mockEvents.length ? prev + 1 : 0))
  }
  const denyEvent = () => nextEvent()
  const acceptEvent = () => nextEvent()

  // Use scroll-driven animation hook
  const { scrollY, onScroll } = useScrollDrivenAnimation({ hideDistance: 80, fade: true })
  // Set scrollY in context and reset to 0 when page is focused
  useFocusEffect(
    React.useCallback(() => {
      setScrollY(scrollY)
      scrollY.setValue(0)
    }, [scrollY, setScrollY])
  )

  return (
    <View style={{ flex: 1 }}>
      {event ? (
        <EventPage event={event} onScroll={onScroll} scrollY={scrollY} showHeader={true} />
      ) : (
        <Text>No more events</Text>
      )}
      {/* Bottom Like/Dislike Buttons, always visible and move up to fill bar space */}
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 114,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 24,
          zIndex: 10,
          transform: [
            {
              translateY: scrollY.interpolate({
                inputRange: [0, 80],
                outputRange: [0, 80],
                extrapolate: "clamp",
              }),
            },
          ],
          opacity: 1,
        }}
      >
        <TouchableOpacity onPress={denyEvent} activeOpacity={0.9}>
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: theme.colors.secondary,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FontAwesome6 name="xmark" size={32} color={theme.colors.brand.red} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={acceptEvent} activeOpacity={0.9}>
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: theme.colors.brand.red,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FontAwesome6 name="heart" size={32} color={theme.colors.secondary} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}
