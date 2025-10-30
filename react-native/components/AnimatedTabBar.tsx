import { useTabBarVisibility } from "@/context/TabBarVisibilityContext"
import { BottomTabBar, BottomTabBarProps } from "@react-navigation/bottom-tabs"
import { MotiView } from "moti"
import React, { useState } from "react"
import { LayoutChangeEvent, StyleSheet } from "react-native"

export function AnimatedTabBar(props: BottomTabBarProps) {
  const [tabBarHeight, setTabBarHeight] = useState(80)
  const { visible } = useTabBarVisibility()
  const routeName = props.state?.routeNames?.[props.state?.index] || ""
  const shouldAnimate = routeName === "finder" || routeName === "index"
  const onLayout = (e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout
    setTabBarHeight(height)
  }
  return (
    <MotiView
      style={[styles.tabBar]}
      animate={{ translateY: shouldAnimate ? (visible ? 0 : tabBarHeight) : 0 }}
      transition={{ type: "timing", duration: 150 }}
      onLayout={onLayout}
    >
      <BottomTabBar {...props} />
    </MotiView>
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
