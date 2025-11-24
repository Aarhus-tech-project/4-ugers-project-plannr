import KeyboardAwareScreen from "@/components/layout/KeyboardAwareScreen"
import KeyboardDismissRoot from "@/components/layout/KeyboardDismissRoot"
import { api } from "@/config/api"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import { useEmailExists } from "@/hooks/useEmailExists"
import { useSendPinEmail } from "@/hooks/useSendPinEmail"
import { isNonEmptyString, isValidEmail, isValidPassword } from "@/utils/validation"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useEffect, useRef, useState } from "react"
import { TextInput as RNTextInput, StyleSheet, View } from "react-native"
import { Button, Text, TextInput } from "react-native-paper"

export default function CreateAccountScreen() {
  // Step state: 'form' or 'pin'
  const [step, setStep] = useState<"form" | "pin">("form")
  // Form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { checkEmail } = useEmailExists()
  const router = useRouter()
  const theme = useCustomTheme()
  // PIN state
  const [pinArray, setPinArray] = useState(["", "", "", "", "", ""])
  const [pinError, setPinError] = useState<string | null>(null)
  const [pinSentTime, setPinSentTime] = useState<number | null>(null)
  const [pinCountdown, setPinCountdown] = useState(300) // 5 min in seconds
  // Countdown timer for PIN validity
  useEffect(() => {
    if (step !== "pin" || !pinSentTime) return
    setPinCountdown(300 - Math.floor((Date.now() - pinSentTime) / 1000))
    const interval = setInterval(() => {
      setPinCountdown(300 - Math.floor((Date.now() - pinSentTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [step, pinSentTime])
  const generatedPin = useRef<string | null>(null)
  const pinInputs = useRef<Array<RNTextInput | null>>([])
  const { sendPinEmail, loading: sendingPin, error: sendPinSendError } = useSendPinEmail()

  // Step 1: Submit form, go to PIN step
  const handleFormNext = async () => {
    setError("")
    if (!isNonEmptyString(name) || !isValidEmail(email) || !isValidPassword(password)) {
      setError("Please fill all fields correctly.")
      return
    }
    setPinError(null)
    // Check if email already exists before sending PIN
    try {
      const emailAlreadyExists = await checkEmail(email)
      if (emailAlreadyExists) {
        setError("Invalid email or password.")
        return
      }
    } catch {
      setError("Invalid email or password.")
      return
    }
    // FE: generate a random 6-digit PIN and store it
    const pinValue = Math.floor(100000 + Math.random() * 900000).toString()
    generatedPin.current = pinValue
    setPinSentTime(Date.now())
    setPinArray(["", "", "", "", "", ""])
    try {
      await sendPinEmail(email, pinValue)
      setStep("pin")
    } catch (e: any) {
      console.error("Error sending PIN email:", e)
      setError("Failed to send PIN email. Please try again.")
    }
  }

  // Step 2: After PIN is verified, create account
  const handleCreateAccount = async () => {
    setLoading(true)
    setError("")
    try {
      const emailAlreadyExists = await checkEmail(email)
      if (emailAlreadyExists) {
        setError("Unable to create account. Please try again or login.")
        setLoading(false)
        return
      }
      // Use api.auth.register (uses apiFetch)
      try {
        await api.auth.register({ name, email, password })
        setTimeout(() => router.replace("/login"), 1200)
      } catch {
        throw new Error("Signup failed")
      }
    } catch (err: any) {
      setError(err.message || "Sign up failed. Please try again.")
      setLoading(false)
    }
  }

  // PIN input handlers
  // Handles both normal input and paste for first box
  const handlePinChange = (val: string, idx: number) => {
    if (idx === 0 && val.length > 1) {
      // Handle paste in first box: fill all boxes
      const chars = val
        .replace(/[^0-9]/g, "")
        .slice(0, 6)
        .split("")
      setPinArray([chars[0] || "", chars[1] || "", chars[2] || "", chars[3] || "", chars[4] || "", chars[5] || ""])
      setPinError(null)
      // Focus last box if 6 digits, else next empty
      const nextIdx = chars.length >= 6 ? 5 : chars.length - 1
      if (nextIdx >= 0 && pinInputs.current[nextIdx]) pinInputs.current[nextIdx].focus()
      return
    }
    if (!/^[0-9]?$/.test(val)) return
    const newArr = [...pinArray]
    newArr[idx] = val
    setPinArray(newArr)
    setPinError(null)
    // Auto-focus next
    if (val && idx < 5) {
      pinInputs.current[idx + 1]?.focus()
    }
  }
  const handlePinKeyPress = (e: any, idx: number) => {
    if (e.nativeEvent.key === "Backspace" && !pinArray[idx] && idx > 0) {
      pinInputs.current[idx - 1]?.focus()
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
          {step === "form" && (
            <>
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
                    icon={() => (
                      <MaterialCommunityIcons name="account-outline" size={22} color={theme.colors.brand.red} />
                    )}
                  />
                }
              />
              <TextInput
                label="Email"
                value={email}
                onChangeText={(val) => {
                  setEmail(val)
                  setPinError(null)
                }}
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
                    icon={() => (
                      <MaterialCommunityIcons name="email-outline" size={22} color={theme.colors.brand.red} />
                    )}
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
              <Button
                mode="contained"
                onPress={handleFormNext}
                style={{
                  borderRadius: 24,
                  marginTop: 12,
                  width: 320,
                  backgroundColor:
                    !isNonEmptyString(name) ||
                    !isValidEmail(email) ||
                    !isValidPassword(password) ||
                    loading ||
                    sendingPin
                      ? theme.colors.gray[300]
                      : theme.colors.brand.red,
                }}
                disabled={
                  !isNonEmptyString(name) || !isValidEmail(email) || !isValidPassword(password) || loading || sendingPin
                }
                labelStyle={{
                  color:
                    !isNonEmptyString(name) ||
                    !isValidEmail(email) ||
                    !isValidPassword(password) ||
                    loading ||
                    sendingPin
                      ? theme.colors.gray[500]
                      : theme.colors.white,
                }}
              >
                {sendingPin ? "Sending PIN..." : "Next"}
              </Button>
              {sendPinSendError && <Text style={{ color: theme.colors.error, marginTop: 8 }}>{sendPinSendError}</Text>}
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
          {step === "pin" && (
            <>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "bold",
                  marginBottom: 12,
                  color: theme.colors.onBackground,
                  textAlign: "center",
                  width: "100%",
                }}
              >
                Email Confirmation
              </Text>
              <Text
                style={{
                  color: theme.colors.onBackground,
                  marginBottom: 10,
                  fontSize: 16,
                  textAlign: "center",
                  width: "90%",
                  alignSelf: "center",
                }}
              >
                Enter the 6-digit PIN sent to your email.
                {"\n"}
                <Text style={{ color: theme.colors.gray[600], fontSize: 15 }}>
                  Valid for:{" "}
                  {pinCountdown > 0
                    ? `${Math.floor(pinCountdown / 60)}:${(pinCountdown % 60).toString().padStart(2, "0")}`
                    : "00:00"}
                </Text>
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 6, width: "100%" }}>
                {pinArray.map((digit, idx) => (
                  <RNTextInput
                    key={idx}
                    style={[styles.pinBox, pinError ? { borderColor: theme.colors.error, borderWidth: 2 } : {}]}
                    value={digit}
                    onChangeText={(val) => handlePinChange(val, idx)}
                    onKeyPress={(e) => handlePinKeyPress(e, idx)}
                    ref={(ref) => {
                      pinInputs.current[idx] = ref
                    }}
                    keyboardType="number-pad"
                    maxLength={1}
                    editable={!loading}
                    returnKeyType="next"
                    contextMenuHidden={idx !== 0}
                    // For iOS/Android: also handle paste via onSelectionChange and onChange for first box
                    {...(idx === 0
                      ? {
                          onSelectionChange: () => {
                            const text = pinArray[0]
                            if (text.length > 1) handlePinChange(text, 0)
                          },
                          onChange: (e: any) => {
                            const text = e.nativeEvent.text
                            if (text && text.length > 1) handlePinChange(text, 0)
                          },
                        }
                      : {})}
                  />
                ))}
              </View>
              {pinError && <Text style={{ color: theme.colors.error, marginTop: 6, fontSize: 15 }}>{pinError}</Text>}
              {pinSentTime && Date.now() - pinSentTime > 5 * 60 * 1000 && (
                <Text style={{ color: theme.colors.error, marginTop: 6, fontSize: 15 }}>
                  PIN expired. Please request a new one.
                </Text>
              )}
              <Button
                mode="contained"
                onPress={async () => {
                  setPinError(null)
                  const pin = pinArray.join("")
                  // FE-only: check PIN and expiry before creating account
                  if (!generatedPin.current || !pinSentTime) {
                    setPinError("No PIN requested.")
                    console.warn("No PIN requested.")
                    return
                  }
                  if (Date.now() - pinSentTime > 5 * 60 * 1000) {
                    setPinError("PIN expired. Please request a new one.")
                    console.warn("PIN expired.")
                    return
                  }
                  if (pin !== generatedPin.current) {
                    setPinError("Invalid PIN.")
                    console.warn("Invalid PIN entered.")
                    return
                  }
                  // PIN is valid, proceed to create account
                  try {
                    await handleCreateAccount()
                  } catch (err) {
                    setError("Network or server error. Please try again later.")
                    console.error("Create account error:", err)
                  }
                }}
                style={{
                  borderRadius: 24,
                  marginTop: 18,
                  width: 220,
                  backgroundColor:
                    pinArray.some((d) => d === "") || loading ? theme.colors.gray[300] : theme.colors.brand.red,
                }}
                disabled={pinArray.some((d) => d === "") || loading}
                labelStyle={{
                  color: pinArray.some((d) => d === "") || loading ? theme.colors.gray[500] : theme.colors.white,
                }}
              >
                Create Account
              </Button>
              <Button
                mode="text"
                onPress={() => setStep("form")}
                style={{ marginTop: 16 }}
                labelStyle={{ color: theme.colors.brand.red }}
              >
                Back to form
              </Button>
              {error && <Text style={{ color: theme.colors.error, marginTop: 16 }}>{error}</Text>}
            </>
          )}
        </View>
      </KeyboardAwareScreen>
    </KeyboardDismissRoot>
  )
}

const styles = StyleSheet.create({
  pinBox: {
    width: 36,
    height: 48,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: "#fff",
    color: "#222",
    fontSize: 22,
    textAlign: "center",
  },
})
