import Flag from "@/components/Flag"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import { useSession } from "@/hooks/useSession"
import { FontAwesome6 } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useState } from "react"
import { FlatList, ScrollView, TextInput, TouchableOpacity, View } from "react-native"
import Modal from "react-native-modal"
import { Text } from "react-native-paper"
import countries from "world-countries"

export default function Account() {
  const theme = useCustomTheme()
  const router = useRouter()
  const { session } = useSession()
  const [bio, setBio] = useState("")
  const [editMode, setEditMode] = useState(false)
  const [countryCode, setCountryCode] = useState<string>("DK")
  const [country, setCountry] = useState<any>(countries.find((c) => c.cca2 === "DK"))
  const [phone, setPhone] = useState("")
  const [showCountryModal, setShowCountryModal] = useState(false)

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
          Account
        </Text>
      </View>
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 100, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Name & Email Card */}
        <View
          style={{
            width: "90%",
            backgroundColor: theme.colors.secondary,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            shadowColor: theme.colors.shadow,
            shadowOpacity: 0.08,
            shadowRadius: 8,
          }}
        >
          <Text
            style={{
              color: theme.colors.onBackground,
              fontWeight: "600",
              fontSize: 16,
              marginBottom: 4,
            }}
          >
            Name
          </Text>
          {editMode ? (
            <TextInput
              style={{
                color: theme.colors.onBackground,
                fontSize: 16,
                flex: 1,
                padding: 12,
                backgroundColor: theme.colors.surface,
                borderRadius: 8,
                opacity: 0.7,
              }}
              placeholderTextColor={theme.colors.onSurface}
              value={session?.user?.name || ""}
              editable={editMode}
            />
          ) : (
            <Text
              style={{
                color: theme.colors.onSurface,
                fontSize: 16,
                flex: 1,
                padding: 12,
                backgroundColor: theme.colors.background,
                borderRadius: 8,
                opacity: 0.7,
              }}
            >
              {session?.user?.name}
            </Text>
          )}
          <Text
            style={{
              color: theme.colors.onBackground,
              fontWeight: "600",
              fontSize: 16,
              marginBottom: 4,
              marginTop: 12,
            }}
          >
            Email
          </Text>
          {editMode ? (
            <TextInput
              style={{
                color: theme.colors.onBackground,
                fontSize: 16,
                flex: 1,
                padding: 12,
                backgroundColor: theme.colors.surface,
                borderRadius: 8,
                opacity: 0.7,
              }}
              placeholderTextColor={theme.colors.onSurface}
              value={session?.user?.email || ""}
              editable={editMode}
            />
          ) : (
            <Text
              style={{
                color: theme.colors.onSurface,
                fontSize: 16,
                flex: 1,
                padding: 12,
                backgroundColor: theme.colors.background,
                borderRadius: 8,
                opacity: 0.7,
              }}
            >
              {session?.user?.email}
            </Text>
          )}
        </View>
        {/* Bio Card */}
        <View
          style={{
            width: "90%",
            backgroundColor: theme.colors.secondary,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            shadowColor: theme.colors.shadow,
            shadowOpacity: 0.08,
            shadowRadius: 8,
          }}
        >
          <Text
            style={{
              color: theme.colors.onBackground,
              fontWeight: "600",
              fontSize: 16,
              marginBottom: 4,
            }}
          >
            Bio
          </Text>
          {editMode ? (
            <TextInput
              style={{
                color: theme.colors.onBackground,
                fontSize: 16,
                flex: 1,
                padding: 12,
                backgroundColor: theme.colors.surface,
                borderRadius: 8,
                opacity: 0.7,
              }}
              placeholderTextColor={theme.colors.onSurface}
              value={bio}
              onChangeText={setBio}
              placeholder="Add your bio"
              editable={editMode}
            />
          ) : (
            <Text
              style={{
                color: theme.colors.onSurface,
                fontSize: 16,
                flex: 1,
                padding: 12,
                backgroundColor: theme.colors.background,
                borderRadius: 8,
                opacity: 0.7,
              }}
            >
              {bio || "-"}
            </Text>
          )}
        </View>
        {/* Phone & Country Card */}
        <View
          style={{
            width: "90%",
            backgroundColor: theme.colors.secondary,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            shadowColor: theme.colors.shadow,
            shadowOpacity: 0.08,
            shadowRadius: 8,
          }}
        >
          <Text
            style={{
              color: theme.colors.onBackground,
              fontWeight: "600",
              fontSize: 16,
              marginBottom: 4,
            }}
          >
            Country
          </Text>
          {editMode ? (
            <TouchableOpacity
              style={{
                borderRadius: 8,
                padding: 12,
                backgroundColor: theme.colors.surface,
                marginBottom: 8,
                flexDirection: "row",
                alignItems: "center",
                opacity: 1,
              }}
              activeOpacity={0.7}
              onPress={() => setShowCountryModal(true)}
            >
              <Flag cca2={country?.cca2 || countryCode || "DK"} style={{ marginRight: 12 }} />
              <Text style={{ color: theme.colors.onSurface, fontSize: 16 }}>
                {country ? (typeof country.name === "string" ? country.name : country.name.common) : "Select country"}
              </Text>
            </TouchableOpacity>
          ) : (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: theme.colors.background,
                borderRadius: 8,
                padding: 12,
                marginBottom: 8,
                opacity: 0.7,
              }}
            >
              <Flag cca2={country?.cca2 || countryCode || "DK"} style={{ marginRight: 12 }} />
              <Text style={{ color: theme.colors.onSurface, fontSize: 16 }}>
                {country ? (typeof country.name === "string" ? country.name : country.name.common) : "Select country"}
              </Text>
            </View>
          )}
          {/* Phone Section */}
          <Text
            style={{
              color: theme.colors.onBackground,
              fontWeight: "600",
              fontSize: 16,
              marginBottom: 4,
              marginTop: 12,
            }}
          >
            Phone
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                minWidth: 60,
                padding: 12,
                backgroundColor: theme.colors.surface,
                borderRadius: 8,
                marginRight: 8,
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.5,
              }}
            >
              <Text style={{ color: theme.colors.onSurface, fontSize: 16 }}>
                {(() => {
                  const fallback = countries.find((c) => c.cca2 === "DK")
                  const c = country || fallback
                  if (!c || !c.idd) return "+"
                  const root = c.idd.root || "+"
                  const suffix = c.idd.suffixes && c.idd.suffixes.length > 0 ? c.idd.suffixes[0] : ""
                  return `${root}${suffix}`
                })()}
              </Text>
            </View>
            {editMode ? (
              <TextInput
                style={{
                  color: theme.colors.onBackground,
                  fontSize: 16,
                  flex: 1,
                  padding: 12,
                  backgroundColor: theme.colors.surface,
                  borderRadius: 8,
                  opacity: 0.7,
                }}
                placeholderTextColor={theme.colors.onSurface}
                placeholder="Phone number"
                keyboardType="phone-pad"
                editable={editMode}
                value={phone}
                onChangeText={setPhone}
              />
            ) : (
              <Text
                style={{
                  color: theme.colors.onSurface,
                  fontSize: 16,
                  flex: 1,
                  padding: 12,
                  backgroundColor: theme.colors.background,
                  borderRadius: 8,
                  opacity: 0.7,
                }}
              >
                {phone || "Phone number"}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
      {/* Country Picker Modal */}
      <Modal
        isVisible={showCountryModal}
        onBackdropPress={() => setShowCountryModal(false)}
        style={{ margin: 0, justifyContent: "center", alignItems: "center" }}
      >
        <View
          style={{
            backgroundColor: theme.colors.secondary,
            borderRadius: 16,
            width: "90%",
            maxHeight: "70%",
            padding: 16,
            shadowColor: theme.colors.shadow,
            shadowOpacity: 0.08,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 18,
              paddingVertical: 22,
              paddingHorizontal: 12,
              color: theme.colors.onBackground,
            }}
          >
            Select Country
          </Text>
          <FlatList
            data={countries}
            keyExtractor={(item) => item.cca2}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 12,
                }}
                onPress={() => {
                  setCountry(item)
                  setCountryCode(item.cca2)
                  setShowCountryModal(false)
                }}
              >
                <Flag cca2={item.cca2} style={{ marginRight: 12 }} />
                <Text style={{ color: theme.colors.onSurface, fontSize: 16 }}>{item.name.common}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            onPress={() => setShowCountryModal(false)}
            style={{
              alignItems: "center",
              marginTop: 12,
              width: "100%",
              backgroundColor: theme.colors.gray.light,
              borderRadius: 16,
              paddingVertical: 12,
              paddingHorizontal: 12,
            }}
          >
            <Text style={{ color: theme.colors.onBackground, fontWeight: "bold" }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {/* Bottom Navbar for Edit, Reset & Save Buttons */}
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
          backgroundColor: theme.colors.gray.dark,
          borderTopWidth: 0,
          padding: 21.5,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            marginRight: 8,
            borderWidth: 0,
            backgroundColor: theme.colors.gray.light,
            borderRadius: 16,
            elevation: 0,
            alignItems: "center",
            padding: 12,
          }}
          onPress={() => {
            setBio("")
            setEditMode(false)
          }}
        >
          <Text style={{ color: theme.colors.white, fontWeight: "bold" }}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            marginLeft: 8,
            borderRadius: 16,
            borderWidth: 0,
            backgroundColor: theme.colors.brand.red,
            elevation: 0,
            alignItems: "center",
            padding: 12,
          }}
          onPress={() => setEditMode((e) => !e)}
        >
          <Text style={{ color: theme.colors.white, fontWeight: "bold" }}>{editMode ? "Save" : "Edit"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
