import React from "react"
import { View } from "react-native"
import { useTheme } from "react-native-paper"
import { Circle, Path, Svg } from "react-native-svg"

interface CustomPinProps {
  color?: string
  size?: number
  borderColor?: string
}

const CustomPin: React.FC<CustomPinProps> = ({ color, size = 40, borderColor }) => {
  const theme = useTheme()
  const pinColor = color || theme.colors.primary
  const pinBorder = borderColor || theme.colors.background
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <Path
          d="M20 2C12.268 2 6 8.268 6 16c0 7.732 12.5 21.5 13.1 22.2a2 2 0 0 0 2.8 0C21.5 37.5 34 23.732 34 16c0-7.732-6.268-14-14-14z"
          fill={pinColor}
          stroke={pinBorder}
          strokeWidth={2}
        />
        <Circle cx={20} cy={16} r={6} fill={pinBorder} stroke={pinColor} strokeWidth={2} />
      </Svg>
    </View>
  )
}

export default CustomPin
