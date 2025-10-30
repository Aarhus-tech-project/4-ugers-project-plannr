import { useTabBarVisibility } from "@/context/TabBarVisibilityContext"
import { BottomTabBar, BottomTabBarProps } from "@react-navigation/bottom-tabs"
import React, { useState } from "react"
import { Animated, LayoutChangeEvent, StyleSheet } from "react-native"

export function AnimatedTabBar(props: BottomTabBarProps) {
  const [tabBarHeight, setTabBarHeight] = useState(80)
  const { visible, scrollY } = useTabBarVisibility()
  const routeName = props.state?.routeNames?.[props.state?.index] || ""
  const shouldAnimate = routeName === "finder" || routeName === "index"
  const onLayout = (e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout
    setTabBarHeight(height)
  }
  let translateY: number | Animated.AnimatedInterpolation<any> = 0
  let opacity: number | Animated.AnimatedInterpolation<any> = 1
  if (shouldAnimate && scrollY) {
    translateY = scrollY.interpolate({
      inputRange: [0, 80],
      outputRange: [0, tabBarHeight],
      extrapolate: "clamp",
    })
    opacity = scrollY.interpolate({
      inputRange: [0, 80],
      outputRange: [1, 0],
      extrapolate: "clamp",
    })
  } else {
    translateY = visible ? 0 : tabBarHeight
    opacity = visible ? 1 : 0
  }
  return (
    <Animated.View style={[styles.tabBar, { transform: [{ translateY }], opacity }]} onLayout={onLayout}>
      <BottomTabBar {...props} />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
})
