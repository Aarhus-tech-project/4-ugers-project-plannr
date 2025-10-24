import { useTabBarVisibility } from "@/context/TabBarVisibilityContext"
import { FontAwesome6 } from "@expo/vector-icons"
import Slider from "@react-native-community/slider"
import React, { useRef } from "react"
import { Image, ScrollView, TextInput, View } from "react-native"
import { Text, useTheme } from "react-native-paper"
import { useLiveLocation } from "../../hooks/useLiveLocation"
import { useSession } from "../../hooks/useSession"

export default function Settings() {
  const theme = useTheme()
  const [rangeKm, setRangeKm] = React.useState(10)
  const { location, address, error: locationError } = useLiveLocation()
  const { session, setSession } = useSession()
  const bg = theme.colors.background
  const [bio, setBio] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [editMode, setEditMode] = React.useState(false)
  const [showSaveModal, setShowSaveModal] = React.useState(false)
  const { setVisible } = useTabBarVisibility()
  const lastScrollY = useRef(0)

  return (
    <>
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
        <Text
          style={{
            color: theme.colors.onBackground,
            fontWeight: "bold",
            textAlign: "center",
            fontSize: 32,
          }}
        >
          Settings
        </Text>
      </View>
      {/* Cards */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.secondary,
        }}
      >
        <View style={{ width: "90%", height: 1, backgroundColor: theme.colors.shadow, marginHorizontal: 0 }} />
        <View
          style={{
            flex: 1,
            width: "100%",
          }}
        >
          <View
            style={{
              flex: 1,
              width: "100%",
              paddingTop: 40,
              marginBottom: -150,
              alignItems: "center",
            }}
          >
            {/* Outer border circle with transparent gap */}
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: 184,
                height: 184,
                borderRadius: 100,
                borderColor: theme.colors.primary,
                borderWidth: 6,
                backgroundColor: "transparent",
                position: "relative",
              }}
            >
              {/* Transparent gap between border and image */}
              <View
                style={{
                  width: 170,
                  height: 170,
                  borderRadius: 100,
                  backgroundColor: "transparent",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: session?.user?.avatarUrl || "" }}
                  style={{
                    width: 164,
                    height: 164,
                    borderRadius: 100,
                  }}
                />
              </View>
              <View
                style={{
                  top: 140,
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  backgroundColor: theme.colors.secondary,
                  borderRadius: 100,
                  width: 120,
                  height: 120,
                  zIndex: 1,
                }}
              >
                <FontAwesome6
                  name="pencil"
                  size={24}
                  color={theme.colors.onBackground}
                  style={{ marginBottom: 8, marginTop: -24 }}
                />
                <Text
                  style={{
                    color: theme.colors.onBackground,
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: 24,
                  }}
                >
                  {"Daniel"}
                </Text>
                <Text
                  style={{
                    color: theme.colors.onBackground,
                    position: "absolute",
                    bottom: 16,
                    textAlign: "center",
                    fontSize: 14,
                  }}
                >
                  {"Plannr member"}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: "90%",
                top: 26,
                height: 1,
                backgroundColor: theme.colors.shadow,
                marginHorizontal: 0,
                zIndex: 0,
              }}
            />
          </View>
          <ScrollView
            style={{ flex: 1, width: "100%" }}
            contentContainerStyle={{ alignItems: "center", paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={8}
            onScroll={(e) => {
              const currentY = e.nativeEvent.contentOffset.y
              if (currentY > lastScrollY.current + 10) {
                setVisible(false) // scrolling down
              } else if (currentY < lastScrollY.current - 10) {
                setVisible(true) // scrolling up
              }
              lastScrollY.current = currentY
            }}
          >
            {/* Profile Card */}
            <View
              style={{
                width: "90%",
                borderRadius: 16,
                backgroundColor: theme.colors.secondary,
                marginBottom: 24,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 32,
                position: "relative",
                elevation: 2,
              }}
            >
              <View style={{ width: "100%", paddingHorizontal: 16 }}>
                {/* Name Field */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                  <FontAwesome6 name="id-card" size={18} color={theme.colors.onBackground} style={{ marginRight: 8 }} />
                  <TextInput
                    style={{
                      flex: 1,
                      borderRadius: 5,
                      padding: 10,
                      marginTop: 5,
                      backgroundColor: editMode ? theme.colors.surface : theme.colors.background,
                      color: theme.colors.onSurface,
                    }}
                    value={session?.user?.name || ""}
                    editable={false}
                  />
                </View>
                {/* Email Field */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                  <FontAwesome6
                    name="envelope"
                    size={18}
                    color={theme.colors.onBackground}
                    style={{ marginRight: 8 }}
                  />
                  <TextInput
                    style={{
                      flex: 1,
                      borderRadius: 5,
                      padding: 10,
                      marginTop: 5,
                      backgroundColor: editMode ? theme.colors.surface : theme.colors.background,
                      color: theme.colors.onSurface,
                    }}
                    value={session?.user?.email || ""}
                    editable={false}
                  />
                </View>
                {/* Bio Field */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                  <FontAwesome6 name="comment" size={18} color={theme.colors.onBackground} style={{ marginRight: 8 }} />
                  <TextInput
                    style={{
                      flex: 1,
                      borderRadius: 5,
                      padding: 10,
                      marginTop: 5,
                      backgroundColor: editMode ? theme.colors.surface : theme.colors.background,
                      color: theme.colors.onSurface,
                    }}
                    value={bio}
                    onChangeText={setBio}
                    placeholder="Add your bio"
                    placeholderTextColor={editMode ? theme.colors.onBackground : theme.colors.onSurface}
                    editable={editMode}
                  />
                </View>
                {/* Phone Field */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                  <FontAwesome6 name="phone" size={18} color={theme.colors.onBackground} style={{ marginRight: 8 }} />
                  <TextInput
                    style={{
                      flex: 1,
                      borderRadius: 5,
                      padding: 10,
                      marginTop: 5,
                      backgroundColor: editMode ? theme.colors.surface : theme.colors.background,
                      color: theme.colors.onSurface,
                    }}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Phone number"
                    placeholderTextColor={editMode ? theme.colors.onBackground : theme.colors.onSurface}
                    keyboardType="phone-pad"
                    editable={editMode}
                  />
                </View>
              </View>
            </View>
            {/* Location Card - placeholder */}
            <View
              style={{
                width: "90%",
                borderRadius: 16,
                backgroundColor: theme.colors.secondary,
                marginBottom: 24,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 32,
                position: "relative",
                elevation: 2,
              }}
            >
              <View style={{ width: "100%", paddingHorizontal: 16 }}>
                {locationError ? (
                  <Text style={{ color: theme.colors.error }}>{locationError}</Text>
                ) : location ? (
                  <>
                    <Text style={{ color: theme.colors.onBackground, fontSize: 16, marginBottom: 8 }}>
                      <FontAwesome6 name="location-crosshairs" size={16} color={theme.colors.onBackground} /> Address:{" "}
                      {address || "Loading address..."}
                    </Text>
                    <Text style={{ color: theme.colors.onBackground, fontSize: 16, marginBottom: 8 }}>
                      <FontAwesome6 name="arrow-up" size={16} color={theme.colors.onBackground} /> Latitude:{" "}
                      {location.coords.latitude.toFixed(5)}
                    </Text>
                    <Text style={{ color: theme.colors.onBackground, fontSize: 16, marginBottom: 8 }}>
                      <FontAwesome6 name="arrow-right" size={16} color={theme.colors.onBackground} /> Longitude:{" "}
                      {location.coords.longitude.toFixed(5)}
                    </Text>
                  </>
                ) : (
                  <Text style={{ color: theme.colors.onBackground }}>Fetching location...</Text>
                )}
              </View>
            </View>
            {/* Range Card - placeholder */}
            <View
              style={{
                width: "90%",
                borderRadius: 16,
                backgroundColor: theme.colors.secondary,
                marginBottom: 24,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 32,
                position: "relative",
                elevation: 2,
              }}
            >
              <View style={{ width: "100%", paddingHorizontal: 16 }}>
                <Text style={{ color: theme.colors.onBackground, fontSize: 16, marginBottom: 8 }}>
                  <FontAwesome6 name="location-arrow" size={16} color={theme.colors.onBackground} /> Search Radius:{" "}
                  {rangeKm} km
                </Text>
                <View style={{ width: "100%", alignItems: "center", marginVertical: 8 }}>
                  <Text style={{ color: theme.colors.onBackground, marginBottom: 4 }}>
                    <FontAwesome6 name="sliders" size={16} color={theme.colors.onBackground} /> Adjust range:
                  </Text>
                  <Slider
                    minimumValue={1}
                    maximumValue={100}
                    value={rangeKm}
                    step={1}
                    onValueChange={setRangeKm}
                    style={{ width: "80%" }}
                    minimumTrackTintColor={theme.colors.onBackground}
                    maximumTrackTintColor={theme.colors.outline}
                    thumbTintColor={theme.colors.onBackground}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  )
}
