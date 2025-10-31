import React from "react"
import { StyleSheet, Text, View, ViewStyle } from "react-native"
import { Button } from "react-native-paper"

interface BottomButtonBarProps {
  buttons: Array<{
    label: string
    onPress: () => void
    mode?: "text" | "outlined" | "contained"
    style?: ViewStyle
    disabled?: boolean
    icon?: string
    textColor?: string
    backgroundColor?: string
  }>
  containerStyle?: ViewStyle
}

const BottomButtonBar: React.FC<BottomButtonBarProps> = ({ buttons, containerStyle }) => {
  return (
    <View style={[styles.bottomBar, containerStyle]}>
      {buttons.map((btn, idx) => (
        <Button
          key={btn.label + idx}
          mode={btn.mode || "contained"}
          onPress={btn.onPress}
          style={[styles.button, btn.style, btn.backgroundColor ? { backgroundColor: btn.backgroundColor } : {}]}
          disabled={btn.disabled}
          icon={btn.icon}
        >
          <Text style={btn.textColor ? { color: btn.textColor, fontWeight: "bold" } : { fontWeight: "bold" }}>
            {btn.label}
          </Text>
        </Button>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    borderWidth: 0,
    padding: 14,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222", // default fallback
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 12,
    borderWidth: 0,
  },
})

export default BottomButtonBar
