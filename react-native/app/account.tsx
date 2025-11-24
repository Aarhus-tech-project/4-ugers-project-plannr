import KeyboardAwareScreen from "@/components/layout/KeyboardAwareScreen"
import BottomButtonBar from "@/components/navigation/BottomButtonBar"
import { api } from "@/config/api"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import { useEmailExists } from "@/hooks/useEmailExists"
import { useProfiles } from "@/hooks/useProfiles"
import { useSendPinEmail } from "@/hooks/useSendPinEmail"
import { useSession } from "@/hooks/useSession"
import { FontAwesome6 } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useEffect, useRef, useState } from "react"
import { TextInput as RNTextInput, TouchableOpacity, View } from "react-native"
import { Button, Text } from "react-native-paper"

export default function Account() {
  const theme = useCustomTheme()
  const router = useRouter()
  const { session, setProfile } = useSession()
  const { checkEmail } = useEmailExists()
  const { sendPinEmail, loading: sendingPin, error: sendPinSendError } = useSendPinEmail()
  const { updateProfile } = useProfiles()

  const [bio, setBio] = useState(session?.profile?.bio || "")
  const [phone, setPhone] = useState(session?.profile?.phone || "")
  const [name, setName] = useState(session?.profile?.name || "")
  const [email, setEmail] = useState(session?.profile?.email || "")
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // PIN state for email change
  const [pinStep, setPinStep] = useState(false)
  const [pinArray, setPinArray] = useState(["", "", "", "", "", ""])
  const [pinError, setPinError] = useState<string | null>(null)
  const [pinSentTime, setPinSentTime] = useState<number | null>(null)
  const [pinCountdown, setPinCountdown] = useState(300)
  const generatedPin = useRef<string | null>(null)
  const pinInputs = useRef<Array<RNTextInput | null>>([])

  // Countdown timer for PIN validity
  useEffect(() => {
    if (!pinStep || !pinSentTime) return
    setPinCountdown(300 - Math.floor((Date.now() - pinSentTime) / 1000))
    const interval = setInterval(() => {
      setPinCountdown(300 - Math.floor((Date.now() - pinSentTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [pinStep, pinSentTime])

  // PIN input handlers for 6-box UI
  function handlePinChange(val: string, idx: number) {
    if (idx === 0 && val.length > 1) {
      const chars = val
        .replace(/[^0-9]/g, "")
        .slice(0, 6)
        .split("")
      setPinArray([chars[0] || "", chars[1] || "", chars[2] || "", chars[3] || "", chars[4] || "", chars[5] || ""])
      setPinError(null)
      const nextIdx = chars.length >= 6 ? 5 : chars.length - 1
      if (nextIdx >= 0 && pinInputs.current[nextIdx]) pinInputs.current[nextIdx].focus()
      return
    }
    if (!/^[0-9]?$/.test(val)) return
    const newArr = [...pinArray]
    newArr[idx] = val
    setPinArray(newArr)
    setPinError(null)
    if (val && idx < 5) {
      pinInputs.current[idx + 1]?.focus()
    }
  }
  function handlePinKeyPress(e: any, idx: number) {
    if (e.nativeEvent.key === "Backspace" && !pinArray[idx] && idx > 0) {
      pinInputs.current[idx - 1]?.focus()
    }
  }

  // Save handler
  async function handleSave() {
    setError(null)
    setSuccess(false)
    const initialEmail = session?.profile?.email || ""
    const emailChanged = email.trim() !== initialEmail.trim()
    if (!emailChanged) {
      setError("You must enter a new email to change it.")
      return
    }
    if (emailChanged && !pinStep) {
      // Check if email exists
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
      // Send PIN
      const pinValue = Math.floor(100000 + Math.random() * 900000).toString()
      generatedPin.current = pinValue
      setPinSentTime(Date.now())
      setPinArray(["", "", "", "", "", ""])
      await sendPinEmail(email, pinValue)
      setPinStep(true)
      return
    }
    // If in PIN step, require valid PIN
    if (emailChanged && pinStep) {
      const pin = pinArray.join("")
      if (!generatedPin.current || !pinSentTime) {
        setPinError("No PIN requested.")
        return
      }
      if (Date.now() - pinSentTime > 5 * 60 * 1000) {
        setPinError("PIN expired. Please try again.")
        return
      }
      if (pin !== generatedPin.current) {
        setPinError("Invalid PIN.")
        return
      }
      setPinStep(false)
    }
    // Save profile
    setSaving(true)
    try {
      if (!session?.profile?.id) throw new Error("No profile ID")
      await updateProfile.run(session.profile.id, {
        ...session.profile,
        name: name.trim(),
        email: email.trim(),
        bio: bio.trim(),
        phone: phone.trim(),
      })
      // Always refetch profile to update session after save
      const profile = await api.profiles.get(session.profile.id)
      setProfile(profile)
      setSuccess(true)
    } catch (e: any) {
      setError(e?.message || "Failed to update profile.")
    } finally {
      setSaving(false)
    }
  }

  // UI
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
          style={{ color: theme.colors.onBackground, fontWeight: "bold", textAlign: "center", fontSize: 32, left: 40 }}
        >
          Account
        </Text>
      </View>
      <View
        style={{
          width: "92%",
          backgroundColor: theme.colors.secondary,
          borderRadius: 20,
          padding: 24,
          marginBottom: 24,
          shadowColor: theme.colors.shadow,
          shadowOpacity: 0.12,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
        }}
      >
        <Text
          style={{
            color: theme.colors.brand.red,
            fontWeight: "bold",
            fontSize: 22,
            marginBottom: 18,
            letterSpacing: 0.5,
          }}
        >
          Edit Profile
        </Text>
        <Text style={{ color: theme.colors.onBackground, fontWeight: "600", fontSize: 16, marginBottom: 4 }}>Name</Text>
        <RNTextInput
          style={{
            color: theme.colors.onBackground,
            fontSize: 17,
            padding: 14,
            backgroundColor: theme.colors.surface,
            borderRadius: 10,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: theme.colors.gray[200],
          }}
          placeholderTextColor={theme.colors.onSurface}
          value={name}
          onChangeText={setName}
          editable={!saving && !pinStep}
          maxLength={40}
        />
        <Text style={{ color: theme.colors.onBackground, fontWeight: "600", fontSize: 16, marginBottom: 4 }}>
          Email
        </Text>
        <RNTextInput
          style={{
            color: theme.colors.onBackground,
            fontSize: 17,
            padding: 14,
            backgroundColor: theme.colors.surface,
            borderRadius: 10,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: theme.colors.gray[200],
          }}
          placeholderTextColor={theme.colors.onSurface}
          value={email}
          onChangeText={(val) => {
            setEmail(val)
            setPinError(null)
            setPinStep(false)
            setPinArray(["", "", "", "", "", ""])
          }}
          editable={!saving && !pinStep}
          keyboardType="email-address"
          autoCapitalize="none"
          maxLength={60}
        />
        {pinStep && (
          <View style={{ marginBottom: 16, alignItems: "center", width: "100%" }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 8,
                color: theme.colors.onBackground,
                textAlign: "center",
              }}
            >
              Email Confirmation
            </Text>
            <Text style={{ color: theme.colors.onBackground, marginBottom: 6, fontSize: 15, textAlign: "center" }}>
              Enter the 6-digit PIN sent to your new email.{"\n"}
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
                  style={{
                    width: 36,
                    height: 48,
                    marginHorizontal: 4,
                    borderWidth: 1,
                    borderColor: pinError ? theme.colors.error : theme.colors.gray[200],
                    borderRadius: 8,
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.onBackground,
                    fontSize: 22,
                    textAlign: "center",
                  }}
                  value={digit}
                  onChangeText={(val) => handlePinChange(val, idx)}
                  onKeyPress={(e) => handlePinKeyPress(e, idx)}
                  ref={(ref) => {
                    pinInputs.current[idx] = ref
                  }}
                  keyboardType="number-pad"
                  maxLength={1}
                  editable={!saving && !sendingPin}
                  returnKeyType="next"
                  contextMenuHidden={idx !== 0}
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
            <Button
              mode="contained"
              onPress={handleSave}
              style={{ borderRadius: 24, marginTop: 12, width: 180, backgroundColor: theme.colors.brand.red }}
              disabled={pinArray.some((d) => d === "") || saving || sendingPin}
              labelStyle={{ color: theme.colors.white }}
            >
              {sendingPin ? "Sending..." : "Confirm Email"}
            </Button>
            {pinError && <Text style={{ color: theme.colors.error, marginTop: 6, fontSize: 15 }}>{pinError}</Text>}
            {sendPinSendError && <Text style={{ color: theme.colors.error, marginTop: 6 }}>{sendPinSendError}</Text>}
          </View>
        )}
        <Text style={{ color: theme.colors.onBackground, fontWeight: "600", fontSize: 16, marginBottom: 4 }}>Bio</Text>
        <RNTextInput
          style={{
            color: theme.colors.onBackground,
            fontSize: 17,
            padding: 14,
            backgroundColor: theme.colors.surface,
            borderRadius: 10,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: theme.colors.gray[200],
            minHeight: 60,
            textAlignVertical: "top",
          }}
          placeholderTextColor={theme.colors.onSurface}
          value={bio}
          onChangeText={setBio}
          editable={!saving && !pinStep}
          multiline
          maxLength={200}
        />
        <Text style={{ color: theme.colors.onBackground, fontWeight: "600", fontSize: 16, marginBottom: 4 }}>
          Phone
        </Text>
        <RNTextInput
          style={{
            color: theme.colors.onBackground,
            fontSize: 17,
            padding: 14,
            backgroundColor: theme.colors.surface,
            borderRadius: 10,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: theme.colors.gray[200],
          }}
          placeholderTextColor={theme.colors.onSurface}
          value={phone}
          onChangeText={setPhone}
          editable={!saving && !pinStep}
          keyboardType="phone-pad"
          maxLength={30}
        />
        {error && (
          <Text style={{ color: theme.colors.brand.error, marginTop: 8, marginBottom: 0, fontSize: 15 }}>{error}</Text>
        )}
        {success && (
          <Text style={{ color: theme.colors.brand.success, marginTop: 8, marginBottom: 0, fontSize: 15 }}>
            Profile updated!
          </Text>
        )}
      </View>
      <BottomButtonBar
        containerStyle={{ backgroundColor: theme.colors.gray[800], paddingVertical: 22 }}
        buttons={[
          {
            label: saving ? "Saving..." : pinStep ? "Enter PIN to Save" : "Save",
            onPress: handleSave,
            backgroundColor:
              name.trim().length > 1 &&
              email.trim().length > 3 &&
              email.includes("@") &&
              !saving &&
              (!pinStep || (pinStep && !pinArray.some((d) => d === "")))
                ? theme.colors.brand.red
                : theme.colors.gray[700],
            textColor: theme.colors.white,
            mode: "contained",
            disabled:
              saving ||
              !(
                name.trim().length > 1 &&
                email.trim().length > 3 &&
                email.includes("@") &&
                (!pinStep || (pinStep && !pinArray.some((d) => d === "")))
              ),
            style: !(
              name.trim().length > 1 &&
              email.trim().length > 3 &&
              email.includes("@") &&
              (!pinStep || (pinStep && !pinArray.some((d) => d === "")))
            )
              ? { opacity: 0.6 }
              : undefined,
          },
        ]}
      />
    </KeyboardAwareScreen>
  )
}
