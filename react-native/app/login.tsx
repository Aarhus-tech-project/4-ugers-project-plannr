import { useCustomTheme } from "@/hooks/useCustomTheme"
import { useSession } from "@/hooks/useSession"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import { Button, Surface, Text, TextInput } from "react-native-paper"

export default function Login() {
  const router = useRouter()
  const theme = useCustomTheme()
  const { login } = useSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Manual login
  const handleManualLogin = async () => {
    setLoading(true)
    setError("")
    try {
      await login(email, password)
      router.replace("/(tabs)")
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Login failed. User not found or credentials incorrect.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Surface
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        backgroundColor: theme.colors.background,
      }}
    >
      <Text style={{ fontSize: 32, fontWeight: "bold", marginBottom: 16, color: theme.colors.onBackground }}>
        Login
      </Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={{ width: 260, marginBottom: 8, height: 50 }}
        contentStyle={{ overflow: "hidden" }}
        keyboardType="email-address"
        autoCapitalize="none"
        mode="outlined"
        autoComplete="email"
        textContentType="emailAddress"
        outlineColor={theme.colors.gray[300]}
        activeOutlineColor={theme.colors.brand.red}
        outlineStyle={{ borderRadius: 12 }}
        left={
          <TextInput.Icon
            icon={() => <MaterialCommunityIcons name="email-outline" size={22} color={theme.colors.brand.red} />}
          />
        }
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        style={{ width: 260, marginBottom: 8, height: 50 }}
        contentStyle={{ overflow: "hidden" }}
        secureTextEntry={!showPassword}
        mode="outlined"
        autoComplete={"password"}
        textContentType="password"
        outlineColor={theme.colors.gray[300]}
        activeOutlineColor={theme.colors.brand.red}
        outlineStyle={{ borderRadius: 12 }}
        left={
          <TextInput.Icon
            icon={() => <MaterialCommunityIcons name="lock-outline" size={22} color={theme.colors.brand.red} />}
          />
        }
        right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword((v) => !v)} />}
      />

      <Button
        mode="contained"
        onPress={handleManualLogin}
        style={{
          borderRadius: 24,
          marginTop: 8,
          width: 260,
          backgroundColor: !email || !password || loading ? theme.colors.gray[300] : theme.colors.brand.red,
        }}
        loading={loading}
        disabled={!email || !password || loading}
        labelStyle={{
          color: !email || !password || loading ? theme.colors.gray[500] : theme.colors.white,
        }}
      >
        Login
      </Button>
      {error ? <Text style={{ color: theme.colors.error, marginTop: 12 }}>{error}</Text> : null}
      <Button
        mode="text"
        onPress={() => router.replace("/create-account")}
        style={{ marginTop: 16 }}
        labelStyle={{ color: theme.colors.brand.red }}
      >
        Don't have an account? Sign Up
      </Button>
    </Surface>
  )
}
