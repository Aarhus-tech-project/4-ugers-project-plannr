"use client"

import { Box, Button, Heading, Input } from "@chakra-ui/react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const [user, setUser] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: user.email,
        password: user.password,
        callbackUrl: "/",
      })
      if (res?.error) {
        setError(res.error || "Wrong credentials. Please try again.")
        return
      }
      if (res?.ok) {
        router.push("/")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("Login failed. Please try again.")
    }
  }

  return (
    <>
      <Box maxW="sm" mx="auto" mt={20} p={8} borderWidth={0} borderRadius="2xl" bg="brand.white" boxShadow="lg">
        <Heading mb={6} color="brand.red" fontWeight="extrabold">
          Login
        </Heading>
        {error && (
          <Box mb={4} p={3} bg="brand.red" color="white" borderRadius="md" fontWeight="bold">
            {error}
          </Box>
        )}
        <form onSubmit={handleSubmit}>
          <Box mb={4}>
            <label
              htmlFor="email"
              style={{ fontWeight: "bold", marginBottom: 4, display: "block", color: "#434343ff" }}
            >
              Email
            </label>
            <Input
              id="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
              bg="gray.50"
              borderRadius="md"
            />
          </Box>
          <Box mb={6}>
            <label
              htmlFor="password"
              style={{ fontWeight: "bold", marginBottom: 4, display: "block", color: "#434343ff" }}
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
              bg="gray.50"
              borderRadius="md"
            />
          </Box>
          <Button
            colorScheme="brand"
            bg="brand.red"
            color="white"
            type="submit"
            width="full"
            borderRadius="lg"
            fontWeight="bold"
            _hover={{ bg: "brand.red", opacity: 0.85 }}
          >
            Login
          </Button>
        </form>
        <Box mt={4} textAlign="center">
          <span style={{ color: "#757575ff" }}>Don't have an account? </span>
          <Button variant="ghost" colorScheme="brand" color="brand.red" onClick={() => router.push("/signup")}>
            Sign up
          </Button>
        </Box>
      </Box>
    </>
  )
}
