import KeyboardAwareScreen from "@/components/layout/KeyboardAwareScreen"
import KeyboardDismissRoot from "@/components/layout/KeyboardDismissRoot"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import { useEmailExists } from "@/hooks/useEmailExists"
import { isNonEmptyString, isValidEmail, isValidPassword } from "@/utils/validation"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import { ActivityIndicator, View } from "react-native"
import { Button, Text, TextInput } from "react-native-paper"

export default function CreateAccountScreen() {
  const router = useRouter()
  const theme = useCustomTheme()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { checkEmail } = useEmailExists()

  const handleSubmit = async () => {
    setLoading(true)
    setError("")
    try {
      if (!isNonEmptyString(name) || !isValidEmail(email) || !isValidPassword(password)) {
        setError("Please fill all fields correctly.")
        setLoading(false)
        return
      }
      const emailAlreadyExists = await checkEmail(email)
      if (emailAlreadyExists) {
        setError("Unable to create account. Please try again or login.")
        setLoading(false)
        return
      }
      // Only create the account, do not log in or set session
      const res = await fetch("https://plannr.azurewebsites.net/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      if (!res.ok) throw new Error("Signup failed")
      // Show spinner while redirecting
      setTimeout(() => router.replace("/login"), 1200)
    } catch (err: any) {
      setError(err.message || "Sign up failed. Please try again.")
      setLoading(false)
    }
  }

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
            Create Account
          </Text>
          <TextInput
            label="First Name"
            value={name}
            onChangeText={setName}
            autoComplete={"name"}
            textContentType="name"
            style={{ width: 320, marginBottom: 12, height: 50 }}
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
            onChangeText={setEmail}
            style={{ width: 320, marginBottom: 12, height: 50 }}
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
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            style={{ width: 320, marginBottom: 12, height: 50 }}
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
            right={
              <TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword((v) => !v)} />
            }
          />
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.brand.red} style={{ marginTop: 32 }} />
          ) : (
            <>
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={{
                  borderRadius: 24,
                  marginTop: 12,
                  width: 320,
                  backgroundColor:
                    !isNonEmptyString(name) || !isValidEmail(email) || !isValidPassword(password) || loading
                      ? theme.colors.gray[300]
                      : theme.colors.brand.red,
                }}
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
              {error && <Text style={{ color: theme.colors.error, marginTop: 16 }}>{error}</Text>}
              <Button
                mode="text"
                onPress={() => router.replace("/login")}
                style={{ marginTop: 16 }}
                labelStyle={{ color: theme.colors.brand.red }}
              >
                Already have an account? Login
              </Button>
            </>
          )}
        </View>
      </KeyboardAwareScreen>
    </KeyboardDismissRoot>
  )
}
