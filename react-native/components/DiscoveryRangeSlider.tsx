import Slider from "@react-native-community/slider"
import React from "react"
import { View } from "react-native"
import { Text, useTheme } from "react-native-paper"
interface DiscoveryRangeSliderProps {
  value: number
  onValueChange: (value: number) => void
  min?: number
  max?: number
}

const DiscoveryRangeSlider: React.FC<DiscoveryRangeSliderProps> = ({ value, onValueChange, min = 1, max = 100 }) => {
  const theme = useTheme()
  return (
    <View style={{ width: "100%" }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <Text style={{ color: theme.colors.onBackground, fontWeight: "600", fontSize: 18 }}>Discovery Range</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Slider
          minimumValue={min}
          maximumValue={max}
          value={value}
          step={1}
          onValueChange={onValueChange}
          style={{ flex: 1 }}
          minimumTrackTintColor={theme.colors.primary}
          maximumTrackTintColor={theme.colors.background}
          thumbTintColor={theme.colors.primary}
        />
        <Text style={{ color: theme.colors.onBackground, marginLeft: 12, fontWeight: "500" }}>{value} km</Text>
      </View>
    </View>
  )
}

export default DiscoveryRangeSlider
