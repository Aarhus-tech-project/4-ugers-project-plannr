"use client"
import { Box, Button, Heading, Input } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
// import Navbar from "@/components/Navbar"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Registration failed")
        return
      }
      setTimeout(() => router.push("/login"), 1500)
    } catch (err) {
      console.error("Registration error:", err)
      setError("Registration failed")
    }
  }

  return (
    <>
      <Box maxW="sm" mx="auto" mt={20} p={8} borderWidth={0} borderRadius="2xl" bg="brand.white" boxShadow="lg">
        <Heading mb={6} color="brand.red" fontWeight="extrabold">
          Sign Up
        </Heading>
        {error && (
          <Box mb={4} p={3} bg="brand.red" color="white" borderRadius="md" fontWeight="bold">
            {error}
          </Box>
        )}
        <form onSubmit={handleSubmit}>
          <Box mb={4}>
            <label htmlFor="name" style={{ fontWeight: "bold", marginBottom: 4, display: "block", color: "#434343ff" }}>
              Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              bg="gray.50"
              borderRadius="md"
            />
          </Box>
          <Box mb={4}>
            <label
              htmlFor="email"
              style={{ fontWeight: "bold", marginBottom: 4, display: "block", color: "#434343ff" }}
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              bg="gray.50"
              borderRadius="md"
            />
          </Box>
          <Box mb={4}>
            <label
              htmlFor="password"
              style={{ fontWeight: "bold", marginBottom: 4, display: "block", color: "#434343ff" }}
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            Sign Up
          </Button>
        </form>
        <Box mt={4} textAlign="center">
          <span style={{ color: "#757575ff" }}>Already have an account? </span>
          <Button variant="ghost" colorScheme="brand" color="brand.red" onClick={() => router.push("/login")}>
            Login
          </Button>
        </Box>
      </Box>
    </>
  )
}
