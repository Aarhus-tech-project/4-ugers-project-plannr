import { useCustomTheme } from "@/hooks/useCustomTheme"
import React, { useEffect, useRef } from "react"
import { Animated, Easing, StyleSheet, View } from "react-native"

const EARTH_SIZE = 100
const ROCKET_SIZE = 40
const ORBIT_RADIUS = 90
export default function RocketOrbitAnimation() {
  const STAR_COUNT = 80
  const BG_SIZE = 2 * (180 + 110) // match the outermost container size
  const bgStars = Array.from({ length: STAR_COUNT }).map((_, i) => {
    const left = Math.random() * BG_SIZE
    const top = Math.random() * BG_SIZE
    const size = 1 + Math.random() * 2.5
    const opacity = 0.5 + Math.random() * 0.5
    return (
      <View
        key={i}
        style={{
          position: "absolute",
          left,
          top,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: "#fff",
          opacity,
          zIndex: 0,
          shadowColor: "#fff",
          shadowOpacity: 0.2,
          shadowRadius: 2,
          shadowOffset: { width: 0, height: 0 },
        }}
      />
    )
  })
  const theme = useCustomTheme()
  const spinAnim = useRef(new Animated.Value(0)).current
  // Start the animation loop only once after mount
  useEffect(() => {
    spinAnim.setValue(0)
    const anim = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear, // linear for perfect loop
        useNativeDriver: true,
      })
    )
    anim.start()
    return () => anim.stop()
  }, [spinAnim])

  // Animate rocket in a true circular orbit, with a trailing confetti effect
  // Make the globe much larger and the rocket smaller
  const BIG_EARTH = 180
  const SMALL_ROCKET = 24
  const BIG_ORBIT = 110
  const center = BIG_EARTH / 2 + BIG_ORBIT

  // Angle in radians (0 to 2π)
  //interpolate to map the animated value to x/y positions for a circular orbit
  const steps = 100
  const inputRange = Array.from({ length: steps + 1 }, (_, i) => i / steps)
  // The rocket's true center position (no offset)
  const outputRangeX = inputRange.map((t) => center + BIG_ORBIT * Math.sin(2 * Math.PI * t))
  const outputRangeY = inputRange.map((t) => center - BIG_ORBIT * Math.cos(2 * Math.PI * t))

  // Center point for orbit
  const containerCenter = BIG_EARTH / 2 + BIG_ORBIT
  // Use transform for rocket position
  const rocketTranslateX = spinAnim.interpolate({
    inputRange,
    outputRange: outputRangeX.map((x) => x - containerCenter),
  })
  const rocketTranslateY = spinAnim.interpolate({
    inputRange,
    outputRange: outputRangeY.map((y) => y - containerCenter),
  })
  const rocketStyle = {
    position: "absolute" as const,
    zIndex: 3,
    left: containerCenter - SMALL_ROCKET / 2,
    top: containerCenter - SMALL_ROCKET / 2,
    transform: [{ translateX: rocketTranslateX }, { translateY: rocketTranslateY }],
  }

  // Confetti thrust trail: colored particles follow the rocket, fade out behind, never overlap the front
  const confettiColors = [
    "#fff", // white
    "#ffe066", // yellow
    "#ffb300", // orange
    "#ff6666", // red
    "#ffd700", // gold
    "#ff9800", // deep orange
    "#fffbe6", // pale yellow
    "#ffecb3", // light gold
    "#ffd1a9", // light orange
  ]
  const confettiCount = 400
  // Memoize random confetti properties for stable appearance
  const confettiProps = React.useMemo(
    () =>
      Array.from({ length: confettiCount }).map(() => ({
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        size: 1 + Math.random() * 2, // 1-3px for tiny sparks
        shape: Math.random() > 0.4 ? "circle" : "rect",
        jitter: (Math.random() - 0.5) * 18 + (Math.random() - 0.5) * 8, // more random, -13 to +13 px
        lag: Math.random() * 0.85 + Math.random() * 0.15, // more random lag, 0-1
        opacity: 0.5 + Math.random() * 0.5, // 0.5-1
      })),
    []
  )
  // Thrust particles: always originate from just behind the rocket, perfectly following the orbit
  const confettiTrail = confettiProps.map((props, i) => {
    const { color, size, shape, jitter, lag, opacity } = props
    // Each confetti lags behind the rocket by a random fraction
    // The rocket's current angle is 2π * t, so the thrust comes from a slightly earlier angle
    const confettiInputRange = inputRange
    const confettiOutputRangeX = inputRange.map(
      (t) => center + BIG_ORBIT * Math.sin(2 * Math.PI * ((t - lag + 1) % 1)) + jitter - containerCenter
    )
    const confettiOutputRangeY = inputRange.map(
      (t) => center - BIG_ORBIT * Math.cos(2 * Math.PI * ((t - lag + 1) % 1)) + jitter - containerCenter
    )
    const confettiTranslateX = spinAnim.interpolate({
      inputRange: confettiInputRange,
      outputRange: confettiOutputRangeX,
    })
    const confettiTranslateY = spinAnim.interpolate({
      inputRange: confettiInputRange,
      outputRange: confettiOutputRangeY,
    })
    // Place the confetti at the rocket's center, so the thrust always comes from the rocket
    return (
      <Animated.View
        key={i}
        style={[
          {
            position: "absolute",
            left: containerCenter - size / 2,
            top: containerCenter - size / 2,
            width: size,
            height: size,
            borderRadius: shape === "circle" ? size / 2 : 1,
            backgroundColor: color,
            opacity,
            zIndex: 1,
            transform: [{ translateX: confettiTranslateX }, { translateY: confettiTranslateY }],
            shadowColor: color,
            shadowOpacity: 0.3,
            shadowRadius: 2,
            shadowOffset: { width: 0, height: 0 },
            elevation: 1,
          },
        ]}
      />
    )
  })

  return (
    <View
      style={{
        width: BIG_EARTH + BIG_ORBIT * 2,
        height: BIG_EARTH + BIG_ORBIT * 2,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "visible",
      }}
    >
      {/* Space background: radial gradient using nested Views */}
      <View
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: BG_SIZE,
          height: BG_SIZE,
          borderRadius: BG_SIZE / 2,
          backgroundColor: "#0a1026", // deep space blue-black
          zIndex: -2,
          overflow: "hidden",
        }}
      >
        {/* Simulate a radial gradient with nested semi-transparent overlays */}
        <View
          style={{
            position: "absolute",
            left: BG_SIZE * 0.1,
            top: BG_SIZE * 0.1,
            width: BG_SIZE * 0.8,
            height: BG_SIZE * 0.8,
            borderRadius: BG_SIZE * 0.4,
            backgroundColor: "#1a1f3a",
            opacity: 0.7,
          }}
        />
        <View
          style={{
            position: "absolute",
            left: BG_SIZE * 0.2,
            top: BG_SIZE * 0.2,
            width: BG_SIZE * 0.6,
            height: BG_SIZE * 0.6,
            borderRadius: BG_SIZE * 0.3,
            backgroundColor: "#232a4d",
            opacity: 0.5,
          }}
        />
        <View
          style={{
            position: "absolute",
            left: BG_SIZE * 0.3,
            top: BG_SIZE * 0.3,
            width: BG_SIZE * 0.4,
            height: BG_SIZE * 0.4,
            borderRadius: BG_SIZE * 0.2,
            backgroundColor: "#2d375f",
            opacity: 0.3,
          }}
        />
        {/* Stars */}
        {bgStars}
      </View>
      {/* Confetti thrust trail */}
      {confettiTrail}
      {/* Earth */}
      <View
        style={[
          styles.earth,
          {
            width: BIG_EARTH,
            height: BIG_EARTH,
            borderRadius: BIG_EARTH / 2,
            backgroundColor: theme.colors.brand.red,
            borderColor: theme.colors.secondary,
            left: BIG_ORBIT,
            top: BIG_ORBIT,
            position: "absolute",
          },
        ]}
      >
        <Animated.Text style={[styles.earthEmoji, { fontSize: 60 }]}>🌍</Animated.Text>
      </View>
      {/* Rocket on orbit */}
      <Animated.View style={rocketStyle}>
        <Animated.Text style={[styles.rocketEmoji, { fontSize: SMALL_ROCKET }]}>🚀</Animated.Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: EARTH_SIZE + ORBIT_RADIUS * 2,
    height: EARTH_SIZE + ORBIT_RADIUS * 2,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: "transparent",
  },
  sparkle: {
    position: "absolute",
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  earth: {
    width: EARTH_SIZE,
    height: EARTH_SIZE,
    borderRadius: EARTH_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    zIndex: 2,
    backgroundColor: "#2d8cff",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  earthEmoji: {
    fontSize: 38,
    textAlign: "center",
  },
  // rocketContainer style is now in rocketTranslate
  rocketEmoji: {
    fontSize: ROCKET_SIZE,
    textAlign: "center",
    textShadowColor: "#ffb300",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
})
