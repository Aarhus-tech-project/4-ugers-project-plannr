import React from "react"
import { Keyboard, Pressable, StyleSheet } from "react-native"

export default function GlobalKeyboardDismiss({ children }: { children: React.ReactNode }) {
  return (
    <Pressable style={styles.overlay} onPress={Keyboard.dismiss} pointerEvents="box-none">
      {children}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
})
