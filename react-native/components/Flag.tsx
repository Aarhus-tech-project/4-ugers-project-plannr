import React from "react"
import CountryFlag from "react-native-country-flag"

export default function Flag({ cca2, style }: { cca2: string; style?: any }) {
  return <CountryFlag isoCode={cca2} size={18} style={style} />
}
