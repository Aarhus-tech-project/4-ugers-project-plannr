import React from "react"
import { StyleSheet, View } from "react-native"
import MapView, { Marker, Region } from "react-native-maps"

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
  const region: Region = {
    latitude: location.latitude,
    longitude: location.longitude,
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
        <Marker coordinate={location} title={markerTitle} description={markerDescription} />
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
