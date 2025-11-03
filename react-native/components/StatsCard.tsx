import { useCustomTheme } from "@/hooks/useCustomTheme"
import { FontAwesome6 } from "@expo/vector-icons"
import * as Location from "expo-location"
import React from "react"
import { Platform, View } from "react-native"
import { Text } from "react-native-paper"

export interface StatsCardProps {
  liveAddress?: Location.LocationGeocodedAddress | null
  liveLocation?: { coords: { latitude: number; longitude: number } }
  statsNearby?: {
    count: number
    totalInterested: number
    closest?: { title: string }
    minDist: number
  } | null
  loading?: boolean
}

export const StatsCard: React.FC<StatsCardProps> = ({
  liveAddress,
  liveLocation: _liveLocation,
  statsNearby,
  loading = true,
}) => {
  const theme = useCustomTheme()
  return (
    <View
      style={{
        borderRadius: 18,
        padding: 16,
        marginHorizontal: 12,
        marginBottom: 4,
        minWidth: 280,
        alignItems: "center",
        width: "100%",
        backgroundColor: theme.colors.secondary,
        overflow: "hidden",
        ...(Platform.OS === "web" ? { backdropFilter: "blur(22px)" } : {}),
      }}
    >
      {/* Street badge absolutely positioned top right */}
      {liveAddress && (
        <Text
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            color: theme.colors.brand.blue,
            backgroundColor: theme.colors.brand.blue + "22",
            borderRadius: 8,
            paddingHorizontal: 7,
            fontSize: 12,
            fontWeight: "bold",
            overflow: "hidden",
            zIndex: 10,
            maxWidth: "60%",
          }}
          numberOfLines={1}
        >
          {liveAddress.street
            ? liveAddress.streetNumber
              ? `${liveAddress.street} ${liveAddress.streetNumber}`
              : liveAddress.street
            : liveAddress.city
            ? liveAddress.city
            : liveAddress.region
            ? liveAddress.region
            : liveAddress.subregion
            ? liveAddress.subregion
            : liveAddress.district
            ? liveAddress.district
            : ""}
        </Text>
      )}
      <View
        style={{
          width: "100%",
          zIndex: 1,
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "row",
          marginBottom: 12,
        }}
      >
        <FontAwesome6 name="location-dot" size={22} color={theme.colors.brand.red} style={{ marginRight: 8 }} />
        <Text
          style={{
            fontSize: 19,
            fontWeight: "bold",
            color: theme.colors.brand.red,
            letterSpacing: 0.2,
            textAlign: "left",
            alignSelf: "flex-start",
          }}
        >
          Events Near You
        </Text>
      </View>
      {/* All content below is now left-aligned and spaced from the title */}
      {loading ? (
        <Text style={{ color: theme.colors.gray[300], marginTop: 8, alignSelf: "flex-start" }}>Loading...</Text>
      ) : statsNearby?.count === 0 ? (
        <View style={{ alignItems: "flex-start", marginTop: 8, marginBottom: 2 }}>
          <Text
            style={{
              color: theme.colors.onBackground,
              fontSize: 15,
              marginBottom: 2,
              opacity: 0.8,
              textAlign: "left",
            }}
          >
            No events found nearby.
          </Text>
        </View>
      ) : (
        <View style={{ width: "100%", zIndex: 1, alignItems: "flex-start" }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
            <FontAwesome6 name="map-pin" size={15} color={theme.colors.brand.red} style={{ marginRight: 4 }} />
            <Text style={{ color: theme.colors.onBackground, fontSize: 15, textAlign: "left" }}>
              <Text style={{ fontWeight: "bold" }}>
                {statsNearby?.count ?? 0} event{statsNearby?.count === 1 ? "" : "s"}
              </Text>{" "}
              within 100km
            </Text>
            <Text
              style={{
                backgroundColor: theme.colors.brand.red + "22",
                color: theme.colors.brand.red,
                borderRadius: 8,
                paddingHorizontal: 7,
                fontSize: 12,
                fontWeight: "bold",
                marginLeft: 8,
                overflow: "hidden",
              }}
            >
              {statsNearby?.totalInterested?.toLocaleString() ?? 0} interested
            </Text>
          </View>
          {statsNearby?.closest && (
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
              <FontAwesome6 name="bolt" size={15} color={theme.colors.brand.red} style={{ marginRight: 4 }} />
              <Text style={{ color: theme.colors.onBackground, fontSize: 15, textAlign: "left" }}>
                Closest: <Text style={{ fontWeight: "bold" }}>{statsNearby.closest.title}</Text>
              </Text>
              <Text
                style={{
                  backgroundColor: theme.colors.brand.blue + "22",
                  color: theme.colors.brand.blue,
                  borderRadius: 8,
                  paddingHorizontal: 7,
                  fontSize: 12,
                  fontWeight: "bold",
                  marginLeft: 8,
                  overflow: "hidden",
                }}
              >
                {statsNearby.minDist.toFixed(1)} km
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  )
}
