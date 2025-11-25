"use client"

import { Box, Button, Heading, Input, InputGroup, Text } from "@chakra-ui/react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FaEnvelope, FaLock } from "react-icons/fa"
import { FaEye, FaEyeSlash } from "react-icons/fa6"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const res = await signIn("credentials", {
      redirect: false,
      username: email,
      password,
      callbackUrl: "/",
    })
    setLoading(false)
    if (res?.error) {
      setError("Login failed. User not found or credentials incorrect.")
    } else if (res?.ok) {
      router.push("/")
    }
  }

  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
      <Box w="100%" maxW="md" p={8} borderRadius="2xl" boxShadow="lg" bg="white" display="flex" flexDirection="column" alignItems="center">
        <Heading mb={2} fontSize="2.5rem" fontWeight="bold" color="gray.900">Sign in to Plannr</Heading>
        <Text fontSize="lg" color="gray.500" mb={6}>Welcome back! Please enter your details.</Text>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <InputGroup mb={4} startElement={<FaEnvelope color="#f87171" size={22} />}>
            <Input
              size="lg"
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              borderRadius="lg"
              borderColor="gray.300"
              required
              autoComplete="email"
              height="50px"
            />
          </InputGroup>
          <InputGroup
            mb={2}
            startElement={<FaLock color="#f87171" size={22} />}
            endElement={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(v => !v)}
                p={0}
                minW={0}
                h="auto"
                zIndex={2}
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash size={22} color="#f87171" /> : <FaEye size={22} color="#f87171" />}
              </Button>
            }
          >
            <Input
              size="lg"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              borderRadius="lg"
              borderColor="gray.300"
              required
              autoComplete="current-password"
              height="50px"
            />
          </InputGroup>
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
          {error && <Text color="red.500" mt={3} fontWeight="semibold">{error}</Text>}
        </form>
        <Box display="flex" alignItems="center" w="100%" my={8}>
          <Box flex={1} height="1px" bg="gray.300" />
          <Text mx={4} color="gray.400" fontSize="md">or</Text>
          <Box flex={1} height="1px" bg="gray.300" />
        </Box>
        <Button
          variant="outline"
          borderColor="red.400"
          colorScheme="red"
          borderRadius="full"
          w="100%"
          fontWeight="bold"
          fontSize="lg"
          height="50px"
          onClick={() => router.push("/create-account")}
        >
          Create an account
        </Button>
      </Box>
    </Box>
  )
}
