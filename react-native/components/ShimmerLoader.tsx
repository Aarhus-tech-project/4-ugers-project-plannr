import React from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"

export default function ShimmerLoader({ style }: { style?: any }) {
  return (
    <View style={[styles.shimmer, style]}>
      <ActivityIndicator size="small" color="#ffe5e5" />
    </View>
  )
}

const styles = StyleSheet.create({
  shimmer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 18,
    width: 180,
    marginVertical: 6,
  },
})
