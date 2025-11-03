import React from "react"
import type { StyleProp, ViewStyle } from "react-native"
import CountryFlag from "react-native-country-flag"

interface FlagProps {
  cca2: string
  style?: StyleProp<ViewStyle>
  size?: number
}

export default function Flag({ cca2, style, size }: FlagProps) {
  return <CountryFlag isoCode={cca2} size={size || 18} style={style} />
}
