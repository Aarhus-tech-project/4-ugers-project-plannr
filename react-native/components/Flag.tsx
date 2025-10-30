import React from "react"
import type { StyleProp, ViewStyle } from "react-native"
import CountryFlag from "react-native-country-flag"

interface FlagProps {
  cca2: string
  style?: StyleProp<ViewStyle>
}

export default function Flag({ cca2, style }: FlagProps) {
  return <CountryFlag isoCode={cca2} size={18} style={style} />
}
