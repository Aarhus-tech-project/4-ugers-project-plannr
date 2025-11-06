import { useCustomTheme } from "@/hooks/useCustomTheme"
import { useEmailExists } from "@/hooks/useEmailExists"
import { useSession } from "@/hooks/useSession"
import { isNonEmptyString, isValidEmail, isValidPassword } from "@/utils/validation"
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
  const [showPassword, setShowPassword] = useState(false)
  const [errorAnim] = useState(new Animated.Value(0))
  const { checkEmail } = useEmailExists()

  const handleSubmit = async () => {
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      if (!isNonEmptyString(name) || !isValidEmail(email) || !isValidPassword(password)) {
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
      // Check if email already exists using hook
      const emailAlreadyExists = await checkEmail(email)
      if (emailAlreadyExists) {
        setError("This email is already registered. Please use another email or login.")
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
        }}
        autoComplete={"name"}
        textContentType="name"
        style={{ width: 260, marginBottom: 8, height: 50 }}
        contentStyle={{ overflow: "hidden" }}
        mode="outlined"
        outlineColor={theme.colors.gray[300]}
        activeOutlineColor={theme.colors.brand.red}
        outlineStyle={{ borderRadius: 12 }}
        left={
          <TextInput.Icon
            icon={() => <MaterialCommunityIcons name="account-outline" size={22} color={theme.colors.brand.red} />}
          />
        }
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={(v) => {
          setEmail(v)
        }}
        style={{ width: 260, marginBottom: 8, height: 50 }}
        contentStyle={{ overflow: "hidden" }}
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
      />
      {/* Show email already in use error below email input */}
      {error === "This email is already registered. Please use another email or login." && (
        <Text
          style={{
            color: theme.colors.error,
            fontSize: 13,
            marginBottom: 16,
            marginLeft: 4,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons name="alert-circle-outline" size={15} color={theme.colors.error} /> This email is
          already registered.
          <Text style={{ textDecorationLine: "underline" }} onPress={() => router.replace("/login")}>
            Login?
          </Text>
        </Text>
      )}
      <TextInput
        label="Password"
        value={password}
        onChangeText={(v) => {
          setPassword(v)
        }}
        style={{ width: 260, marginBottom: 8, height: 50 }}
        contentStyle={{ overflow: "hidden" }}
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
      />
      <Button
        mode="contained"
        onPress={handleSubmit}
        style={{
          borderRadius: 24,
          marginTop: 8,
          width: 260,
          backgroundColor:
            !isNonEmptyString(name) || !isValidEmail(email) || !isValidPassword(password) || loading
              ? theme.colors.gray[300]
              : theme.colors.brand.red,
        }}
        loading={loading}
        disabled={!isNonEmptyString(name) || !isValidEmail(email) || !isValidPassword(password) || loading}
        labelStyle={{
          color:
            !isNonEmptyString(name) || !isValidEmail(email) || !isValidPassword(password) || loading
              ? theme.colors.gray[500]
              : theme.colors.white,
        }}
      >
        Create Account
      </Button>
      {success && <Text style={{ color: theme.colors.brand.success, marginTop: 16 }}>{success}</Text>}
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
