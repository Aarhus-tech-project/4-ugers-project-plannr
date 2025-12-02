import { Box } from "@chakra-ui/react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet"
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
})

interface MapPickerProps {
  lat: number
  lng: number
  onPick: (coords: { lat: number; lng: number }) => void
}

function LocationMarker({ onPick }: { onPick: (coords: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click(e: any) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}

export default function MapPicker({ lat, lng, onPick }: MapPickerProps) {
  // No imperative map control needed for initial render
  return (
    <Box w="100%" h="300px" borderRadius="xl" overflow="hidden" position="relative">
      <MapContainer
        {...({
          center: [lat, lng],
          zoom: 13,
          style: { height: "100%", width: "100%" },
        } as any)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]} />
        <LocationMarker onPick={onPick} />
      </MapContainer>
    </Box>
  )
}
