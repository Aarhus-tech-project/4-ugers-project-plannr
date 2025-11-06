import * as Haptics from "expo-haptics"
import { Platform } from "react-native"

export function vibrateWheelChange() {
  // Use haptic feedback for wheel change
  if (Platform.OS === "ios" || Platform.OS === "android") {
    Haptics.selectionAsync()
  }
}
