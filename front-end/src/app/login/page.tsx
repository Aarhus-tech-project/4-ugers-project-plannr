"use client"

import { Box, Button, Heading, Input } from "@chakra-ui/react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const [user, setUser] = useState({ username: "", password: "" })
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    const res = await signIn("credentials", {
      redirect: false,
      username: user.username,
      password: user.password,
      callbackUrl: "/",
    })
    if (res?.error) {
      setError("Wrong credentials. Please try again.")
    } else if (res?.ok) {
      router.push("/")
    }
  }

  return (
    <Box maxW="sm" mx="auto" mt={20} p={8} borderWidth={1} borderRadius="lg">
      <Heading mb={6}>Login</Heading>
      {error && (
        <Box mb={4} p={3} bg="red.500" color="white" borderRadius="md">
          {error}
        </Box>
      )}
      <form onSubmit={handleSubmit}>
        <Box mb={4}>
          <label htmlFor="username" style={{ fontWeight: "bold", marginBottom: 4, display: "block" }}>
            Username
          </label>
          <Input
            id="username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            required
          />
        </Box>
        <Box mb={6}>
          <label htmlFor="password" style={{ fontWeight: "bold", marginBottom: 4, display: "block" }}>
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            required
          />
        </Box>
        <Button colorScheme="teal" type="submit" width="full">
          Login
        </Button>
      </form>
    </Box>
  )
}
