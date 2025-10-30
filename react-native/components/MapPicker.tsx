import { useCustomTheme } from "@/hooks/useCustomTheme"
import type { EventLocation } from "@/interfaces/event"
import { FontAwesome6 } from "@expo/vector-icons"
import * as Location from "expo-location"
import React, { useEffect, useRef, useState } from "react"
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import MapView, { Circle, MapPressEvent, Marker, Region } from "react-native-maps"

interface MapPickerProps {
  location: Pick<EventLocation, "latitude" | "longitude"> | null
  onLocationChange?: (location: Pick<EventLocation, "latitude" | "longitude">) => void
  range?: number
  disableSelection?: boolean
  onAddressChange?: (address: string) => void
}

const MapPicker: React.FC<MapPickerProps> = ({
  location,
  onLocationChange,
  range = 500,
  disableSelection = false,
  onAddressChange,
}) => {
  const [address, setAddress] = useState<string>("")
  const mapRef = useRef<MapView>(null)
  const theme = useCustomTheme()
  // Calculate initial delta based on range (in meters)
  const initialDelta = (range / 1000 / 111) * 2.2 // 1 degree ~111km, 2.2 for padding
  const initialRegion: Region = {
    latitude: location?.latitude || 56.162939,
    longitude: location?.longitude || 10.203921,
    latitudeDelta: initialDelta,
    longitudeDelta: initialDelta,
  }

  const handlePress = async (e: MapPressEvent) => {
    if (disableSelection || !onLocationChange) return
    const { latitude, longitude } = e.nativeEvent.coordinate
    onLocationChange({ latitude, longitude })
    await fetchAddress(latitude, longitude)
  }

  const fetchAddress = async (latitude: number, longitude: number) => {
    try {
      const geo = await Location.reverseGeocodeAsync({ latitude, longitude })
      let addr = ""
      if (geo && geo.length > 0) {
        const g = geo[0]
        const hasStreet = g.street || g.streetNumber
        addr = `${g.street || ""}${g.streetNumber ? " " + g.streetNumber : ""}${
          g.city ? (hasStreet ? ", " : "") + g.city : ""
        }`.trim()
        setAddress(addr)
      } else {
        setAddress("")
      }
      if (onAddressChange) onAddressChange(addr)
    } catch {
      setAddress("")
      if (onAddressChange) onAddressChange("")
    }
  }

  useEffect(() => {
    if (location) {
      const lat = location.latitude ?? 0
      const lng = location.longitude ?? 0
      fetchAddress(lat, lng)
    } else {
      setAddress("")
    }
  }, [location])

  // Automatically zoom to fit range unless user manually zooms
  useEffect(() => {
    if (location && mapRef.current) {
      // Calculate latitudeDelta/longitudeDelta to fit the range
      // 1 degree latitude ~= 111km
      const delta = (range / 1000 / 111) * 2.2 // 2.2 for padding
      const lat = location.latitude ?? 0
      const lng = location.longitude ?? 0
      mapRef.current.animateToRegion(
        {
          latitude: lat,
          longitude: lng,
          latitudeDelta: delta,
          longitudeDelta: delta,
        },
        500
      )
    }
  }, [range, location])

  const moveToCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Location Error", "Permission to access location was denied.")
        return
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest })
      const { latitude, longitude } = loc.coords
      // Calculate latitudeDelta/longitudeDelta to fit the range
      const delta = (range / 1000 / 111) * 2.2
      const region = {
        latitude,
        longitude,
        latitudeDelta: delta,
        longitudeDelta: delta,
      }
      if (mapRef.current) {
        mapRef.current.animateToRegion(region, 1000)
      } else {
        Alert.alert("Map Error", "Map reference not found.")
      }
      if (onLocationChange) {
        onLocationChange({ latitude, longitude })
      }
      // oxlint-disable-next-line no-unused-vars
    } catch (err) {
      Alert.alert("Location Error", "Could not get current location. Please check permissions and try again.")
    }
  }

  return (
    <View style={{ height: 340, borderRadius: 16, overflow: "hidden", marginVertical: 12 }}>
      <View
        style={{
          padding: 10,
          backgroundColor: theme.colors.secondary,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <Text style={{ color: theme.colors.brand.red, fontWeight: "bold", fontSize: 15 }}>
          {address ? address : ""}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialRegion={initialRegion}
          onPress={handlePress}
          scrollEnabled={!disableSelection}
          zoomEnabled={!disableSelection}
          rotateEnabled={!disableSelection}
          pitchEnabled={!disableSelection}
        >
          {location && (
            <>
              <Marker
                coordinate={{ latitude: location.latitude ?? 0, longitude: location.longitude ?? 0 }}
                draggable={!disableSelection && !!onLocationChange}
                onDragEnd={
                  disableSelection || !onLocationChange
                    ? undefined
                    : (e) => {
                        const { latitude, longitude } = e.nativeEvent.coordinate
                        onLocationChange({ latitude, longitude })
                      }
                }
              />
              <Circle
                center={{ latitude: location.latitude ?? 0, longitude: location.longitude ?? 0 }}
                radius={range}
                strokeColor={theme.colors.brand.red + "100"}
                fillColor={theme.colors.brand.red + "40"}
              />
            </>
          )}
        </MapView>
        {/* Range label absolutely positioned over the map */}
        {location && (
          <View
            style={{
              position: "absolute",
              left: 16,
              top: 16,
              backgroundColor: theme.colors.brand.red,
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 4,
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 4,
              zIndex: 10,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>{`Range: ${(range / 1000).toFixed(0)} km`}</Text>
          </View>
        )}
        {disableSelection && (
          <>
            <View style={styles.lockIconWrap} pointerEvents="none">
              <FontAwesome6 name="lock" size={22} color={theme.colors.brand.red} />
            </View>
          </>
        )}
      </View>
      <TouchableOpacity
        style={{ ...styles.fab, backgroundColor: theme.colors.brand.red }}
        onPress={moveToCurrentLocation}
        activeOpacity={0.8}
      >
        <FontAwesome6 name="crosshairs" size={22} color={"#FFFFFF"} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 40,
    height: 40,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  lockIconWrap: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
  },
})

export default MapPicker
