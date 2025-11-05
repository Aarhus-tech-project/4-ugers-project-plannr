import { useCustomTheme } from "@/hooks/useCustomTheme"
import { useSession } from "@/hooks/useSession"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import { Animated } from "react-native"
import { Button, Surface, Text, TextInput } from "react-native-paper"

export default function CreateAccountScreen() {
  const router = useRouter()
  const theme = useCustomTheme()
  const { signup, login } = useSession()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [, setTouched] = useState<{
    name?: boolean
    email?: boolean
    password?: boolean
    confirmPassword?: boolean
  }>({})
  const [showPassword, setShowPassword] = useState(false)
  const [errorAnim] = useState(new Animated.Value(0))

  const handleSubmit = async () => {
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      if (!email || !name || !password || password.length < 6 || !email.includes("@")) {
        setError("Please fill all fields correctly.")
        Animated.timing(errorAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          Animated.timing(errorAnim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }).start()
        })
        setLoading(false)
        return
      }
      await signup(name, email, password)
      await login(email, password)
      setSuccess("Account created! Redirecting...")
      setTimeout(() => router.replace("/(tabs)"), 1200)
    } catch (err: any) {
      setError(err.message || "Sign up failed. Please try again.")
      Animated.timing(errorAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(errorAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }).start()
      })
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
        Create Account
      </Text>
      <TextInput
        label="First Name"
        value={name}
        onChangeText={(v) => {
          setName(v)
          setTouched((t) => ({ ...t, name: true }))
        }}
        autoComplete={"name"}
        textContentType="name"
        style={{ width: 260, marginBottom: 8 }}
        mode="outlined"
        outlineColor={theme.colors.gray[300]}
        activeOutlineColor={theme.colors.brand.red}
        outlineStyle={{ borderRadius: 12 }}
        left={
          <TextInput.Icon
            icon={() => <MaterialCommunityIcons name="account-outline" size={22} color={theme.colors.brand.red} />}
          />
        }
        onBlur={() => setTouched((t) => ({ ...t, name: true }))}
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={(v) => {
          setEmail(v)
          setTouched((t) => ({ ...t, email: true }))
        }}
        style={{ width: 260, marginBottom: 8 }}
        keyboardType="email-address"
        autoComplete={"email"}
        textContentType="emailAddress"
        autoCapitalize="none"
        mode="outlined"
        outlineColor={theme.colors.gray[300]}
        activeOutlineColor={theme.colors.brand.red}
        outlineStyle={{ borderRadius: 12 }}
        left={
          <TextInput.Icon
            icon={() => <MaterialCommunityIcons name="email-outline" size={22} color={theme.colors.brand.red} />}
          />
        }
        onBlur={() => setTouched((t) => ({ ...t, email: true }))}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={(v) => {
          setPassword(v)
          setTouched((t) => ({ ...t, password: true }))
        }}
        style={{ width: 260, marginBottom: 8 }}
        secureTextEntry={!showPassword}
        autoComplete={"password"}
        textContentType="password"
        mode="outlined"
        outlineColor={theme.colors.gray[300]}
        activeOutlineColor={theme.colors.brand.red}
        outlineStyle={{ borderRadius: 12 }}
        left={
          <TextInput.Icon
            icon={() => <MaterialCommunityIcons name="lock-outline" size={22} color={theme.colors.brand.red} />}
          />
        }
        right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword((v) => !v)} />}
        onBlur={() => setTouched((t) => ({ ...t, password: true }))}
      />
      <Button
        mode="contained"
        onPress={handleSubmit}
        style={{ borderRadius: 24, marginTop: 8, width: 260, backgroundColor: theme.colors.brand.red }}
        loading={loading}
        disabled={!email || !name || !password || password.length < 6 || !email.includes("@") || loading}
        labelStyle={{ color: theme.colors.white }}
      >
        Create Account
      </Button>
      {success && <Text style={{ color: theme.colors.brand.success, marginTop: 16 }}>{success}</Text>}
      <Animated.View
        style={{
          opacity: errorAnim,
          transform: [{ scale: errorAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] }) }],
        }}
      >
        {error ? (
          <Text
            style={{ color: theme.colors.error, marginTop: 12, fontWeight: "bold", fontSize: 16, textAlign: "center" }}
          >
            <MaterialCommunityIcons name="alert-circle-outline" size={18} color={theme.colors.error} /> {error}
          </Text>
        ) : null}
      </Animated.View>
      <Button
        mode="text"
        onPress={() => router.replace("/login")}
        style={{ marginTop: 16 }}
        labelStyle={{ color: theme.colors.brand.red }}
      >
        Already have an account? Login
      </Button>
    </Surface>
  )
}
