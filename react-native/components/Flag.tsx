import React from "react"
import type { StyleProp, ViewStyle } from "react-native"

import { getCountryCode } from "@/utils/countryCode"
import CountryFlag from "react-native-country-flag"

interface FlagProps {
  cca2: string // can be code or name
  style?: StyleProp<ViewStyle>
  size?: number
}

export default function Flag({ cca2, style, size }: FlagProps) {
  const code = getCountryCode(cca2)
  if (!code) return null
  return <CountryFlag isoCode={code} size={size || 18} style={style} />
}
