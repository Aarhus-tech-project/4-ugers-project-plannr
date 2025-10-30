import { useCustomTheme } from "@/hooks/useCustomTheme"
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6"
import React from "react"
import { View } from "react-native"
import { Chip, Text } from "react-native-paper"

interface LocationOptionSelectorProps {
  useCurrentLocation: boolean
  onChange: (useCurrent: boolean) => void
}

const LocationOptionSelector: React.FC<LocationOptionSelectorProps> = ({ useCurrentLocation, onChange }) => {
  const theme = useCustomTheme()
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Text style={{ color: theme.colors.onBackground, fontWeight: "600", fontSize: 18 }}>Location</Text>
      <View style={{ flexDirection: "row" }}>
        {["Current", "Custom"].map((label, idx) => {
          const selected = (label === "Current" && useCurrentLocation) || (label === "Custom" && !useCurrentLocation)
          return (
            <Chip
              key={label}
              selected={selected}
              onPress={() => onChange(label === "Current")}
              style={{
                margin: 4,
                backgroundColor: selected ? theme.colors.brand.red : theme.colors.background,
                minWidth: 100,
                justifyContent: "center",
              }}
              textStyle={{
                color: selected ? theme.colors.background : theme.colors.onBackground,
                fontWeight: "bold",
              }}
              icon={() => (
                <FontAwesome6
                  name={idx === 0 ? "location-dot" : "map-location"}
                  size={16}
                  color={selected ? theme.colors.background : theme.colors.brand.red}
                />
              )}
            >
              {label}
            </Chip>
          )
        })}
      </View>
    </View>
  )
}

export default LocationOptionSelector
