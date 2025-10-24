import { useTabBarVisibility } from "@/context/TabBarVisibilityContext"
import { FontAwesome6 } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useRef, useState } from "react"
import { Image, TouchableOpacity, View } from "react-native"
import { Text, useTheme } from "react-native-paper"
import { useLiveLocation } from "../../hooks/useLiveLocation"
import { useSession } from "../../hooks/useSession"

function Accordion({
  title,
  children,
  dividerColor,
  iconName,
  expanded,
  onPress,
}: {
  title: string
  children: React.ReactNode
  dividerColor: string
  iconName?: string
  expanded: boolean
  onPress: () => void
}) {
  const theme = useTheme()
  return (
    <View style={{ width: "90%", marginBottom: 0 }}>
      <View style={{ width: "100%", height: 1, backgroundColor: dividerColor, marginHorizontal: 0 }} />
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 12 }}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text
          style={{
            borderRadius: 8,
            color: theme.colors.onBackground,
          }}
        >
          {title}
        </Text>
        {iconName && <FontAwesome6 name={iconName} size={16} />}
      </TouchableOpacity>
      {expanded && <View style={{ marginTop: 8 }}>{children}</View>}
    </View>
  )
}

export default function Settings() {
  const router = useRouter()
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

  // Accordion state: only one open at a time
  const [openAccordion, setOpenAccordion] = useState<"preferences" | "account" | null>(null)

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
          <View
            style={{
              flex: 1,
              paddingTop: 40,
              alignItems: "center",
              width: "100%",
              backgroundColor: theme.colors.secondary,
            }}
          >
            <View style={{ width: "90%", marginBottom: 0 }}>
              <View style={{ width: "100%", height: 1, backgroundColor: theme.colors.shadow, marginHorizontal: 0 }} />
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 12 }}
                activeOpacity={0.7}
                onPress={() => router.push("/preferences")}
              >
                <Text
                  style={{
                    borderRadius: 8,
                    color: theme.colors.onBackground,
                  }}
                >
                  Preferences
                </Text>
                <FontAwesome6 name={"sliders"} size={16} />
              </TouchableOpacity>
            </View>
            <View style={{ width: "90%", marginBottom: 0 }}>
              <View style={{ width: "100%", height: 1, backgroundColor: theme.colors.shadow, marginHorizontal: 0 }} />
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 12 }}
                activeOpacity={0.7}
                onPress={() => router.push("/account")}
              >
                <Text
                  style={{
                    borderRadius: 8,
                    color: theme.colors.onBackground,
                  }}
                >
                  Account
                </Text>
                <FontAwesome6 name={"gear"} size={16} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </>
  )
}
