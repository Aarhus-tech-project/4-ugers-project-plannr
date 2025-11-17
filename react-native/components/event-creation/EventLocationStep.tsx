import { useCustomTheme } from "@/hooks/useCustomTheme"
import { EventLocation } from "@/interfaces/event"
import React from "react"
import { Text, View } from "react-native"
import MapPicker from "../ui/MapPicker"

interface EventLocationStepProps {
  selectedLocation: EventLocation | null
  setSelectedLocation: (val: EventLocation | null) => void
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
          setSelectedLocation(loc)
        }}
        disableSelection={false}
      />
    </View>
  )
}

export default EventLocationStep
