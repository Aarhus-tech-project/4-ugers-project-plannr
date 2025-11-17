import { useCustomTheme } from "@/hooks/useCustomTheme"
import { useSession } from "@/hooks/useSession"
import React from "react"
import { TouchableOpacity } from "react-native"
import { Text } from "react-native-paper"

export default function LogoutButton() {
  const { logout } = useSession()
  const theme = useCustomTheme()

  const handleLogout = async () => {
    await logout.run()
    // No need to navigate; layout will show login screen automatically
  }

  return (
    <TouchableOpacity
      style={{
        width: "90%",
        backgroundColor: theme.colors.brand.red,
        borderRadius: 16,
        padding: 16,
        marginTop: 8,
        marginBottom: 32,
        alignItems: "center",
      }}
      activeOpacity={0.8}
      onPress={handleLogout}
    >
      <Text style={{ color: theme.colors.white, fontWeight: "bold", fontSize: 18 }}>Log out</Text>
    </TouchableOpacity>
  )
}
