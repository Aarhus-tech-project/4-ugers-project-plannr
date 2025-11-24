import KeyboardAwareScreen from "@/components/layout/KeyboardAwareScreen"
import KeyboardDismissRoot from "@/components/layout/KeyboardDismissRoot"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import { useSession } from "@/hooks/useSession"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useEffect, useState } from "react"
import { View } from "react-native"
import { Button, Text, TextInput } from "react-native-paper"

export default function Login() {
  const router = useRouter()
  const theme = useCustomTheme()
  const { login, session } = useSession()
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
      await login.run(email, password)
      // Navigation will be handled by useEffect below
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Login failed. User not found or credentials incorrect.")
    } finally {
      setLoading(false)
    }
  }

  // Redirect when session is set
  useEffect(() => {
    if (session && session.token) {
      router.replace("/(tabs)")
    }
  }, [session])

  return (
    <KeyboardDismissRoot>
      <KeyboardAwareScreen
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}
      >
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
            elevation: 0,
          }}
        >
          <Text style={{ fontSize: 32, fontWeight: "bold", marginBottom: 16, color: theme.colors.onBackground }}>
            Sign in to Plannr
          </Text>
          <Text style={{ fontSize: 16, color: theme.colors.gray[600], marginBottom: 24 }}>
            Welcome back! Please enter your details.
          </Text>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={{ width: 320, marginBottom: 12, height: 50 }}
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
            style={{ width: 320, marginBottom: 8, height: 50 }}
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
            right={
              <TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword((v) => !v)} />
            }
          />
          <Button
            mode="contained"
            onPress={handleManualLogin}
            style={{
              borderRadius: 24,
              marginTop: 12,
              width: 320,
              backgroundColor: !email || !password || loading ? theme.colors.gray[300] : theme.colors.brand.red,
            }}
            loading={loading}
            disabled={!email || !password || loading}
            labelStyle={{
              fontWeight: "bold",
              fontSize: 16,
              color: !email || !password || loading ? theme.colors.gray[500] : theme.colors.white,
            }}
          >
            Sign in
          </Button>
          {error ? <Text style={{ color: theme.colors.error, marginTop: 12 }}>{error}</Text> : null}
          {/* Divider */}
          <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 32, width: 320 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: theme.colors.gray[300] }} />
            <Text style={{ marginHorizontal: 12, color: theme.colors.gray[500], fontSize: 14 }}>or</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: theme.colors.gray[300] }} />
          </View>
          <Button
            mode="outlined"
            onPress={() => router.replace("/create-account")}
            style={{
              borderRadius: 24,
              width: 320,
              borderColor: theme.colors.brand.red,
              borderWidth: 2,
            }}
            labelStyle={{ fontWeight: "bold", fontSize: 16, color: theme.colors.brand.red }}
          >
            Create an account
          </Button>
        </View>
      </KeyboardAwareScreen>
    </KeyboardDismissRoot>
  )
}
