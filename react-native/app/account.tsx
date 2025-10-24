import { FontAwesome6 } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import { TextInput, TouchableOpacity, View } from "react-native"
import { Text, useTheme } from "react-native-paper"

export default function Account() {
  const theme = useTheme()
  const router = useRouter()
  const [bio, setBio] = useState("")
  const [phone, setPhone] = useState("")
  const [editMode, setEditMode] = useState(false)
  // Replace with your session hook
  const session = { user: { name: "Daniel", email: "daniel@email.com" } }
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
          <Text style={{ color: theme.colors.onBackground, fontWeight: "600", fontSize: 16, marginBottom: 4 }}>
            Name
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <FontAwesome6 name="user" size={18} color={theme.colors.primary} style={{ marginRight: 8 }} />
            <TextInput
              style={{
                flex: 1,
                borderRadius: 8,
                padding: 12,
                backgroundColor: theme.colors.background,
                color: theme.colors.onSurface,
                fontSize: 15,
              }}
              value={session.user.name}
              editable={false}
            />
          </View>
          <Text style={{ color: theme.colors.onBackground, fontWeight: "600", fontSize: 16, marginBottom: 4 }}>
            Email
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <FontAwesome6 name="envelope" size={18} color={theme.colors.primary} style={{ marginRight: 8 }} />
            <TextInput
              style={{
                flex: 1,
                borderRadius: 8,
                padding: 12,
                backgroundColor: theme.colors.background,
                color: theme.colors.onSurface,
                fontSize: 15,
              }}
              value={session.user.email}
              editable={false}
            />
          </View>
          <Text style={{ color: theme.colors.onBackground, fontWeight: "600", fontSize: 16, marginBottom: 4 }}>
            Bio
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <FontAwesome6 name="pen" size={18} color={theme.colors.primary} style={{ marginRight: 8 }} />
            <TextInput
              style={{
                flex: 1,
                borderRadius: 8,
                padding: 12,
                backgroundColor: editMode ? theme.colors.surface : theme.colors.background,
                color: theme.colors.onSurface,
                fontSize: 15,
              }}
              value={bio}
              onChangeText={setBio}
              placeholder="Add your bio"
              placeholderTextColor={editMode ? theme.colors.onBackground : theme.colors.onSurface}
              editable={editMode}
            />
          </View>
          <Text style={{ color: theme.colors.onBackground, fontWeight: "600", fontSize: 16, marginBottom: 4 }}>
            Phone
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <FontAwesome6 name="phone" size={18} color={theme.colors.primary} style={{ marginRight: 8 }} />
            <TextInput
              style={{
                flex: 1,
                borderRadius: 8,
                padding: 12,
                backgroundColor: editMode ? theme.colors.surface : theme.colors.background,
                color: theme.colors.onSurface,
                fontSize: 15,
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
    </View>
  )
}
