"use client"

import { PasswordInput } from "@/components/ui/password-input"
import { PinInput } from "@/components/ui/pin-input"
import { Box, Button, Heading, Input, InputElement, Text } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { FaEnvelope, FaLock } from "react-icons/fa"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState<"form" | "pin">("form")
  const [pinArray, setPinArray] = useState(["", "", "", "", "", ""])
  const [pinError, setPinError] = useState<string | null>(null)
  const [pinSentTime, setPinSentTime] = useState<number | null>(null)
  const [pinCountdown, setPinCountdown] = useState(300)
  const generatedPin = useRef<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (step !== "pin" || !pinSentTime) return
    setPinCountdown(300 - Math.floor((Date.now() - pinSentTime) / 1000))
    const interval = setInterval(() => {
      setPinCountdown(300 - Math.floor((Date.now() - pinSentTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [step, pinSentTime])

  async function sendPinEmail(email: string) {
    setLoading(true)
    setPinError(null)
    try {
      const res = await fetch("/api/send-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!data.success) throw new Error("Failed to send PIN email")
      // Always update the generatedPin with the latest pin
      generatedPin.current = data.pin
      setPinSentTime(Date.now())
      setPinArray(["", "", "", "", "", ""])
      setStep("pin")
    } catch {
      setPinError("Failed to send verification email. Please try again.")
    }
    setLoading(false)
  }

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) throw new Error("Login failed")
      // Only send PIN if password is correct
      await sendPinEmail(email)
      setLoading(false)
    } catch {
      setLoading(false)
      setError("Login failed. User not found or credentials incorrect.")
    }
  }

  async function handlePinSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()
    setLoading(true)
    setPinError(null)
    const enteredPin = pinArray.join("")
    if (enteredPin.length !== 6) {
      setPinError("Please enter a 6-digit PIN")
      setLoading(false)
      return
    }
    // Validate PIN via login endpoint
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, pin: enteredPin }),
      })
      if (!res.ok) {
        setPinError("Incorrect PIN or credentials. Please try again.")
        setLoading(false)
        return
      }
      await res.json()
      setLoading(false)
      window.location.reload()
    } catch {
      setLoading(false)
      setPinError("Login failed. Please try again.")
    }
  }

  return (
    <Box
      minH="100vh"
      bg={{ base: "gray.50", _dark: "gray.900" }}
      color={{ base: "gray.900", _dark: "gray.50" }}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box bg={{ base: "white", _dark: "gray.800" }} boxShadow="lg" borderRadius="2xl" maxW="420px" w="100%" p={8}>
        <Heading mb={4} fontSize="2.5rem" fontWeight="bold" color={{ base: "gray.900", _dark: "gray.50" }}>
          Welcome back!
        </Heading>
        {step === "form" ? (
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Box mb={4} position="relative">
              <InputElement position="absolute" left="0.75em" top="50%" transform="translateY(-50%)">
                <FaEnvelope color="#e63946" />
              </InputElement>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                bg={{ base: "gray.50", _dark: "gray.700" }}
                borderColor={{ base: "gray.300", _dark: "gray.600" }}
                color={{ base: "gray.900", _dark: "gray.50" }}
                pl="2.5em"
                size="lg"
                height="50px"
                w="100%"
                fontSize="lg"
              />
            </Box>
            <Box mb={2} position="relative">
              <InputElement position="absolute" left="0.75em" top="50%" transform="translateY(-50%)">
                <FaLock color="#e63946" />
              </InputElement>
              <PasswordInput
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                bg={{ base: "gray.50", _dark: "gray.700" }}
                borderColor={{ base: "gray.300", _dark: "gray.600" }}
                color={{ base: "gray.900", _dark: "gray.50" }}
                pl="2.5em"
                size="lg"
                height="50px"
                w="100%"
                fontSize="lg"
              />
            </Box>
            <Text fontSize="sm" color={{ base: "gray.500", _dark: "gray.400" }} mb={2}>
              Forgot your password? Contact support for help.
            </Text>
            <Button
              type="submit"
              colorScheme="red"
              borderRadius="full"
              mt={4}
              w="100%"
              fontWeight="bold"
              fontSize="lg"
              height="50px"
              loading={loading}
              disabled={!email || !password || loading}
            >
              Sign in
            </Button>
            {error && (
              <Text color="red.500" mt={3} fontWeight="semibold">
                {error}
              </Text>
            )}
          </form>
        ) : (
          <form onSubmit={handlePinSubmit} style={{ width: "100%" }}>
            <Text fontSize="lg" fontWeight="semibold" mb={4}>
              Enter the 6-digit PIN sent to your email
            </Text>
            <Box display="flex" justifyContent="center" mb={4}>
              <PinInput
                value={pinArray}
                onValueChange={(e) => setPinArray(e.value)}
                count={6}
                inputProps={{
                  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => {
                    const paste = e.clipboardData
                      .getData("text")
                      .replace(/[^0-9]/g, "")
                      .slice(0, 6)
                    if (paste.length > 1) {
                      setPinArray(paste.split("").concat(Array(6).fill("")).slice(0, 6))
                      e.preventDefault()
                    }
                  },
                }}
                attached
              />
            </Box>
            {pinError && (
              <Text color="red.500" mb={4} fontWeight="semibold">
                {pinError}
              </Text>
            )}
            <Button
              type="submit"
              colorScheme="red"
              borderRadius="full"
              w="100%"
              fontWeight="bold"
              fontSize="lg"
              height="50px"
              loading={loading}
              disabled={loading}
            >
              Verify PIN
            </Button>
            <Text fontSize="sm" color={{ base: "gray.500", _dark: "gray.400" }} mt={4}>
              {pinCountdown > 0
                ? `Resend PIN in ${Math.floor(pinCountdown / 60)
                    .toString()
                    .padStart(2, "0")}:${(pinCountdown % 60).toString().padStart(2, "0")}`
                : "Didn't receive the PIN? Resend it now."}
            </Text>
          </form>
        )}
        <Box display="flex" alignItems="center" w="100%" my={8}>
          <Box flex={1} height="1px" bg={{ base: "gray.300", _dark: "gray.700" }} />
          <Text mx={4} color={{ base: "gray.400", _dark: "gray.500" }} fontSize="md">
            or
          </Text>
          <Box flex={1} height="1px" bg={{ base: "gray.300", _dark: "gray.700" }} />
        </Box>
        <Button
          variant="outline"
          borderColor={{ base: "red.400", _dark: "red.600" }}
          colorScheme="red"
          borderRadius="full"
          w="100%"
          fontWeight="bold"
          fontSize="lg"
          height="50px"
          onClick={() => router.push("/create-account")}
        >
          New to Plannr? <b>Create an account</b>
        </Button>
      </Box>
    </Box>
  )
}
