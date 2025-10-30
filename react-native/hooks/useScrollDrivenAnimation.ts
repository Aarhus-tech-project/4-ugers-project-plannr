import { useRef } from "react"
import { Animated } from "react-native"

interface UseScrollDrivenAnimationOptions {
  hideDistance?: number
  fade?: boolean
  onScroll?: (event: any) => void
}

export function useScrollDrivenAnimation({
  hideDistance = 80,
  fade = true,
  onScroll: userOnScroll,
}: UseScrollDrivenAnimationOptions = {}) {
  const scrollY = useRef(new Animated.Value(0)).current
  const lastScrollY = useRef(0)
  const lastTimestamp = useRef(Date.now())

  // Interpolated values
  const translateY = scrollY.interpolate({
    inputRange: [0, hideDistance],
    outputRange: [0, hideDistance],
    extrapolate: "clamp",
  })
  const opacity = fade
    ? scrollY.interpolate({
        inputRange: [0, hideDistance],
        outputRange: [1, 0],
        extrapolate: "clamp",
      })
    : 1

  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
    useNativeDriver: true,
    listener: (event: any) => {
      const currentY = event.nativeEvent.contentOffset.y
      const now = Date.now()
      lastScrollY.current = currentY
      lastTimestamp.current = now
      // You can use velocity here if you want to trigger something
      if (typeof userOnScroll === "function") userOnScroll(event)
    },
  })

  return { scrollY, translateY, opacity, onScroll }
}
