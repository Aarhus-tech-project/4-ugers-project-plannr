"use client"
import { Box, Button, Heading, Input } from "@chakra-ui/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess(false)
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
      setSuccess(true)
      setTimeout(() => router.push("/login"), 1500)
    } catch (err) {
      console.error("Registration error:", err)
      setError("Registration failed")
    }
  }

  return (
    <Box maxW="sm" mx="auto" mt={20} p={8} borderWidth={1} borderRadius="lg">
      <Heading mb={6}>Sign Up</Heading>
      {error && (
        <Box mb={4} p={3} bg="red.500" color="white" borderRadius="md">
          {error}
        </Box>
      )}
      {success && (
        <Box mb={4} p={3} bg="green.500" color="white" borderRadius="md">
          Registration successful! Redirecting...
        </Box>
      )}
      <form onSubmit={handleSubmit}>
        <Box mb={4}>
          <label htmlFor="name" style={{ fontWeight: "bold", marginBottom: 4, display: "block" }}>
            Name
          </label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </Box>
        <Box mb={4}>
          <label htmlFor="email" style={{ fontWeight: "bold", marginBottom: 4, display: "block" }}>
            Email
          </label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Box>
        <Box mb={6}>
          <label htmlFor="password" style={{ fontWeight: "bold", marginBottom: 4, display: "block" }}>
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Box>
        <Button colorScheme="teal" type="submit" width="full">
          Sign Up
        </Button>
      </form>
      <Box mt={4} textAlign="center">
        <span>Already have an account? </span>
        <Link href="/login">
          <Button variant="ghost" colorScheme="blue">
            Login
          </Button>
        </Link>
      </Box>
    </Box>
  )
}
