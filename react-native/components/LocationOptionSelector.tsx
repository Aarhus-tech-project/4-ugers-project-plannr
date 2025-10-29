import { useCustomTheme } from "@/hooks/useCustomTheme"
import React from "react"
import { View } from "react-native"
import { Switch, Text } from "react-native-paper"
interface LocationOptionSelectorProps {
  useCurrentLocation: boolean
  onChange: (useCurrent: boolean) => void
}

const LocationOptionSelector: React.FC<LocationOptionSelectorProps> = ({ useCurrentLocation, onChange }) => {
  const theme = useCustomTheme()
  return (
    <View style={{ width: "100%" }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <Text style={{ color: theme.colors.onBackground, fontWeight: "600", fontSize: 18 }}>Location</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: theme.colors.onBackground,
              fontSize: 16,
            }}
          >
            {useCurrentLocation ? "Using current location" : "Using custom location"}
          </Text>
        </View>
        <Switch
          value={useCurrentLocation}
          onValueChange={() => onChange(!useCurrentLocation)}
          color={theme.colors.brand.red}
        />
      </View>
    </View>
  )
}

export default LocationOptionSelector
