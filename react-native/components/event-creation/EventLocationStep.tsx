import MapPicker from "@/components/MapPicker"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import React from "react"
import { Text, View } from "react-native"

interface EventLocationStepProps {
  selectedLocation: { latitude: number; longitude: number } | null
  setSelectedLocation: (val: { latitude: number; longitude: number } | null) => void
}

const EventLocationStep: React.FC<EventLocationStepProps> = ({ selectedLocation, setSelectedLocation }) => {
  const theme = useCustomTheme()
  return (
    <View
      style={{
        width: "90%",
        backgroundColor: theme.colors.secondary,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        alignSelf: "center",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <Text style={{ color: theme.colors.onBackground, fontWeight: "600", fontSize: 18 }}>Location</Text>
      </View>
      <MapPicker
        location={selectedLocation}
        onLocationChange={(loc) => {
          if (typeof loc.latitude === "number" && typeof loc.longitude === "number") {
            setSelectedLocation({ latitude: loc.latitude, longitude: loc.longitude })
          }
        }}
        disableSelection={false}
      />
    </View>
  )
}

export default EventLocationStep
