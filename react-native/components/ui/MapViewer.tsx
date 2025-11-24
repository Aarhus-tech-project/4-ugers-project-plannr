import type { EventLocation } from "@/interfaces/event"
import React from "react"
import type { StyleProp, ViewStyle } from "react-native"
import { StyleSheet, View } from "react-native"
import MapView, { Marker, Region } from "react-native-maps"

interface MapViewerProps {
  location: Pick<EventLocation, "latitude" | "longitude">
  markerTitle?: string
  markerDescription?: string
  regionDelta?: number
  style?: StyleProp<ViewStyle>
}

const MapViewer: React.FC<MapViewerProps> = ({
  location,
  markerTitle,
  markerDescription,
  regionDelta = 0.05,
  style = {},
}) => {
  const lat = location.latitude ?? 0
  const lng = location.longitude ?? 0
  const region: Region = {
    latitude: lat,
    longitude: lng,
    latitudeDelta: regionDelta,
    longitudeDelta: regionDelta,
  }

  return (
    <View style={[styles.container, style]}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        region={region}
        scrollEnabled={true}
        zoomEnabled={true}
        rotateEnabled={true}
        pitchEnabled={true}
      >
        <Marker coordinate={{ latitude: lat, longitude: lng }} title={markerTitle} description={markerDescription} />
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
