import { useCustomTheme } from "@/hooks/useCustomTheme"
import React from "react"
import { StyleSheet, View } from "react-native"
import MapView, { Marker, Region } from "react-native-maps"
import CustomPin from "./CustomPin"

interface MapViewerProps {
  location: { latitude: number; longitude: number }
  markerTitle?: string
  markerDescription?: string
  regionDelta?: number
  style?: object
}

const MapViewer: React.FC<MapViewerProps> = ({
  location,
  markerTitle,
  markerDescription,
  regionDelta = 0.05,
  style = {},
}) => {
  const theme = useCustomTheme()
  const region: Region = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: regionDelta,
    longitudeDelta: regionDelta,
  }

  const customMapStyle = [
    {
      elementType: "geometry",
      stylers: [{ color: theme.colors.background }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: theme.colors.shadow }],
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [{ color: theme.colors.background }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: theme.colors.background }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: theme.colors.background }],
    },
    { featureType: "poi", stylers: [{ visibility: "off" }] },
  ]

  return (
    <View style={[styles.container, style]}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        region={region}
        scrollEnabled={true}
        zoomEnabled={true}
        rotateEnabled={true}
        pitchEnabled={true}
        customMapStyle={customMapStyle}
        provider="google"
      >
        <Marker coordinate={location} title={markerTitle} description={markerDescription}>
          <CustomPin color={theme.colors.brand.red} borderColor={theme.colors.background} />
        </Marker>
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 240,
    borderRadius: 16,
    overflow: "hidden",
  },
})

export default MapViewer
