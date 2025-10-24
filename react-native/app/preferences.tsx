import { FontAwesome6 } from "@expo/vector-icons"
import Slider from "@react-native-community/slider"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import { TouchableOpacity, View } from "react-native"
import { Text, useTheme } from "react-native-paper"

export default function Preferences() {
  const theme = useTheme()
  const router = useRouter()
  const [rangeKm, setRangeKm] = useState(10)
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.secondary }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
          paddingTop: 80,
          paddingBottom: 16,
          paddingLeft: 20,
          backgroundColor: theme.colors.secondary,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ padding: 4, borderRadius: 20, position: "absolute", left: 20, top: 82 }}
          activeOpacity={0.6}
        >
          <FontAwesome6 name="chevron-left" size={24} color={theme.colors.onBackground} />
        </TouchableOpacity>
        <Text
          style={{
            color: theme.colors.onBackground,
            fontWeight: "bold",
            textAlign: "center",
            fontSize: 32,
            left: 40,
          }}
        >
          Preferences
        </Text>
      </View>
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.secondary }}
      >
        <View style={{ width: "90%", height: 1, backgroundColor: theme.colors.shadow, marginHorizontal: 0 }} />
        <View
          style={{
            width: "90%",
            backgroundColor: theme.colors.surface,
            borderRadius: 12,
            padding: 16,
            shadowColor: theme.colors.shadow,
            shadowOpacity: 0.08,
            shadowRadius: 8,
            marginTop: 40,
          }}
        >
          <Text style={{ color: theme.colors.onBackground, fontWeight: "600", fontSize: 16, marginBottom: 8 }}>
            Events Range
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Slider
              minimumValue={1}
              maximumValue={100}
              value={rangeKm}
              step={1}
              onValueChange={setRangeKm}
              style={{ flex: 1 }}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.background}
              thumbTintColor={theme.colors.onBackground}
            />
            <Text style={{ color: theme.colors.onBackground, marginLeft: 12, fontWeight: "500" }}>{rangeKm} km</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
