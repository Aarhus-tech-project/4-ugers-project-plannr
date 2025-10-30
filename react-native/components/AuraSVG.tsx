import React from "react"
import { View } from "react-native"
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg"

interface AuraSVGProps {
  size: number
  color?: string // e.g. '#FF5F6D'
  opacity?: number // 0-1
}

/**
 * Renders a radial gradient aura (smoke/dust) effect as an SVG.
 * Center is transparent, border is colored and diffused.
 */
const AuraSVG: React.FC<AuraSVGProps> = ({ size, color = "#FF5F6D", opacity = 0.7 }) => (
  <View style={{ position: "absolute", width: size, height: size }} pointerEvents="none">
    <Svg width={size} height={size}>
      <Defs>
        <RadialGradient id="auraGradient" cx="50%" cy="50%" rx="50%" ry="50%" fx="50%" fy="50%">
          <Stop offset="0%" stopColor={color} stopOpacity={0} />
          <Stop offset="75%" stopColor={color} stopOpacity={0} />
          <Stop offset="82%" stopColor={color} stopOpacity={opacity} />
          <Stop offset="95%" stopColor={color} stopOpacity={opacity * 0.3} />
          <Stop offset="100%" stopColor={color} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Circle cx={size / 2} cy={size / 2} r={size / 2} fill="url(#auraGradient)" />
    </Svg>
  </View>
)

export default AuraSVG
