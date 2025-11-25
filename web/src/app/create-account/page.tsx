"use client"
import { PasswordInput } from "@/components/ui/password-input"
import { PinInput } from "@/components/ui/pin-input"
import { Box, Button, Heading, Input, InputElement, Text } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa"

export default function CreateAccountPage() {
  const [step, setStep] = useState<"form" | "pin">("form")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [pinArray, setPinArray] = useState(["", "", "", "", "", ""])
  const [pinError, setPinError] = useState<string | null>(null)
  const [pinSentTime, setPinSentTime] = useState<number | null>(null)
  const [pinCountdown, setPinCountdown] = useState(300)
  const [mounted, setMounted] = useState(false)
  const generatedPin = useRef<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || step !== "pin" || !pinSentTime) return
    setPinCountdown(300 - Math.floor((Date.now() - pinSentTime) / 1000))
    const interval = setInterval(() => {
      setPinCountdown(300 - Math.floor((Date.now() - pinSentTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [mounted, step, pinSentTime])

  async function checkEmailExists(email: string) {
    try {
      const res = await fetch(`/api/profiles/by-email/${encodeURIComponent(email)}`)
      if (!res.ok) return false
      const profile = await res.json()
      return !!profile?.email
    } catch {
      return false
    }
  }

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
      generatedPin.current = data.pin
      setPinSentTime(Date.now())
      setPinArray(["", "", "", "", "", ""])
      setStep("pin")
    } catch (err) {
      console.error(err)
      setPinError("Failed to send verification email. Please try again.")
    }
    setLoading(false)
  }

  async function handleFormNext() {
    setError("")
    if (!name || !email || !password) {
      setError("Please fill all fields correctly.")
      return
    }
    setPinError(null)
    const emailAlreadyExists = await checkEmailExists(email)
    if (emailAlreadyExists) {
      setError("Invalid email or password.")
      return
    }
    await sendPinEmail(email)
  }

  async function handleCreateAccount() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      if (!res.ok) throw new Error("Unable to create account")
      await res.json()
      setLoading(false)
      window.location.reload()
    } catch {
      setLoading(false)
      setError("Unable to create account. Please try again or login.")
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
        {step === "form" && (
          <>
            <Heading mb={4} fontSize="2.5rem" fontWeight="bold" color={{ base: "gray.900", _dark: "gray.50" }}>
              Sign up
            </Heading>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleFormNext()
              }}
              style={{ width: "100%" }}
            >
              <Box mb={4}>
                <Box position="relative">
                  <InputElement position="absolute" left="0.75em" top="50%" transform="translateY(-50%)">
                    <FaUser color="var(--chakra-colors-brand-500) " />
                  </InputElement>
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
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
              </Box>
              <Box mb={4}>
                <Box position="relative">
                  <InputElement position="absolute" left="0.75em" top="50%" transform="translateY(-50%)">
                    <FaEnvelope color="var(--chakra-colors-brand-500) " />
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
              </Box>
              <Box mb={2}>
                <Box position="relative">
                  <InputElement position="absolute" left="0.75em" top="50%" transform="translateY(-50%)">
                    <FaLock color="var(--chakra-colors-brand-500) " />
                  </InputElement>
                  <PasswordInput
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
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
              </Box>
              <Text fontSize="sm" color={{ base: "gray.500", _dark: "gray.400" }} mb={2} textAlign="left">
                Password must be at least 8 characters and contain a number.
              </Text>
              {error && (
                <Text color="red.500" fontWeight="semibold" mb={2}>
                  {error}
                </Text>
              )}
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
                disabled={!name || !email || !password || loading}
              >
                Continue
              </Button>
            </form>
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
              onClick={() => router.replace("/login")}
            >
              Already have an account? <b>Sign in</b>
            </Button>
          </>
        )}
        {step === "pin" && (
          <>
            <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={2}>
              Verify your email
            </Text>
            <Text fontSize="md" color="gray.600" textAlign="center" mb={2}>
              We’ve sent a 6-digit code to <b>{email}</b>. Enter it below to confirm your account.
            </Text>
            {mounted && (
              <Text fontSize="sm" color="gray.400" textAlign="center" mb={4}>
                Code expires in:{" "}
                <b>
                  {pinCountdown > 0
                    ? `${Math.floor(pinCountdown / 60)}:${(pinCountdown % 60).toString().padStart(2, "0")}`
                    : "00:00"}
                </b>
              </Text>
            )}
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
              <Text color="red.500" fontWeight="semibold" textAlign="center" mb={2}>
                {pinError}
              </Text>
            )}
            {mounted && pinSentTime && Date.now() - pinSentTime > 5 * 60 * 1000 && (
              <Text color="red.500" fontWeight="semibold" textAlign="center" mb={2}>
                Your code has expired. Please request a new one above.
              </Text>
            )}
            <Button
              colorScheme="red"
              borderRadius="full"
              w="100%"
              fontWeight="bold"
              fontSize="lg"
              size="lg"
              loading={loading}
              disabled={pinArray.some((d) => d === "") || loading}
              mb={4}
              onClick={async () => {
                setPinError(null)
                const pin = pinArray.join("")
                if (!generatedPin.current || !pinSentTime) {
                  setPinError("No code requested. Please try again.")
                  return
                }
                if (mounted && Date.now() - pinSentTime > 5 * 60 * 1000) {
                  setPinError("Your code has expired. Please request a new one above.")
                  return
                }
                if (pin !== generatedPin.current) {
                  setPinError("Incorrect code. Please check and try again.")
                  return
                }
                await handleCreateAccount()
              }}
            >
              Verify & Create Account
            </Button>
            <Button
              variant="outline"
              borderColor="red.400"
              colorScheme="red"
              borderRadius="full"
              w="100%"
              fontWeight="bold"
              fontSize="lg"
              size="lg"
              onClick={() => setStep("form")}
            >
              Back
            </Button>
          </>
        )}
      </Box>
    </Box>
  )
}
