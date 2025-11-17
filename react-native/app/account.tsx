import KeyboardAwareScreen from "@/components/layout/KeyboardAwareScreen"
import BottomButtonBar from "@/components/navigation/BottomButtonBar"
import Flag from "@/components/ui/Flag"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import { useSession } from "@/hooks/useSession"
import { FontAwesome6 } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useMemo, useState } from "react"
import { FlatList, TextInput, TouchableOpacity, View } from "react-native"
import Modal from "react-native-modal"
import { Text } from "react-native-paper"
import type { Country } from "world-countries"
import countries from "world-countries"

export default function Account() {
  const theme = useCustomTheme()
  const router = useRouter()
  const { session } = useSession()
  const [bio, setBio] = useState("")
  const [countryCode, setCountryCode] = useState<string>("DK")
  const [country, setCountry] = useState<Country | undefined>(countries.find((c) => c.cca2 === "DK"))
  const [phone, setPhone] = useState("")
  const [name, setName] = useState(session?.profile?.name || "")
  const [email, setEmail] = useState(session?.profile?.email || "")
  const [showCountryModal, setShowCountryModal] = useState(false)

  return (
    <KeyboardAwareScreen
      style={{ flex: 1, backgroundColor: theme.colors.secondary }}
      contentContainerStyle={{ alignItems: "center", paddingBottom: 100, paddingTop: 16 }}
    >
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
      {/* Name & Email Card */}
      <View
        style={{
          width: "90%",
          backgroundColor: theme.colors.secondary,
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
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
          value={name}
          onChangeText={setName}
          editable={true}
        />
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
          value={email}
          onChangeText={setEmail}
          editable={true}
        />
      </View>
      {/* Bio Card */}
      <View
        style={{
          width: "90%",
          backgroundColor: theme.colors.secondary,
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
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
          editable={true}
        />
      </View>
      {/* Phone & Country Card */}
      <View
        style={{
          width: "90%",
          backgroundColor: theme.colors.secondary,
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
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
            editable={true}
            value={phone}
            onChangeText={setPhone}
          />
        </View>
      </View>
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
              backgroundColor: theme.colors.gray[700],
              borderRadius: 16,
              paddingVertical: 12,
              paddingHorizontal: 12,
            }}
          >
            <Text style={{ color: theme.colors.onBackground, fontWeight: "bold" }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {/* Bottom Navbar for Save Button only, shown if changes were made */}
      {useMemo(() => {
        const initialName = session?.profile?.name || ""
        const initialEmail = session?.profile?.email || ""
        const initialCountryCode = "DK"
        const initialCountry = countries.find((c) => c.cca2 === "DK")
        const initialPhone = ""
        const initialBio = ""
        const changed =
          name !== initialName ||
          email !== initialEmail ||
          countryCode !== initialCountryCode ||
          country?.cca2 !== initialCountry?.cca2 ||
          phone !== initialPhone ||
          bio !== initialBio
        return changed ? (
          <BottomButtonBar
            containerStyle={{ backgroundColor: theme.colors.gray[800], paddingVertical: 22 }}
            buttons={[
              {
                label: "Save",
                onPress: () => {
                  // TODO: Implement save logic here
                },
                backgroundColor: theme.colors.brand.red,
                textColor: theme.colors.white,
                mode: "contained",
              },
            ]}
          />
        ) : null
      }, [name, email, countryCode, country, phone, bio, session])}
    </KeyboardAwareScreen>
  )
}
