import { Box } from "@chakra-ui/react"
import L from "leaflet"
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"
import "leaflet/dist/leaflet.css"
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet"

// Configure Leaflet default marker icons
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
})

interface MapPickerProps {
  lat: number
  lng: number
  onPick: (coords: { lat: number; lng: number }) => void
}

interface LeafletMouseEvent {
  latlng: {
    lat: number
    lng: number
  }
}

function LocationMarker({ onPick }: { onPick: (coords: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}

export default function MapPicker({ lat, lng, onPick }: MapPickerProps) {
  // No imperative map control needed for initial render
  return (
    <Box w="100%" h="300px" borderRadius="xl" overflow="hidden" position="relative">
      <MapContainer center={[lat, lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]} />
        <LocationMarker onPick={onPick} />
      </MapContainer>
    </Box>
  )
}
