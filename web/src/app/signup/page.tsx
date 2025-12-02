"use client"

import { AuthInput } from "@/components/forms/AuthInput"
import { ErrorState } from "@/components/ui/States"
import { useAuthForm } from "@/hooks/useAuthForm"
import { useAuthenticatedRedirect } from "@/hooks/useClientRedirect"
import { Box, Button, Heading, Link, Text } from "@chakra-ui/react"
import NextLink from "next/link"
import { useRouter } from "next/navigation"

interface SignupFormData {
  name: string
  email: string
  password: string
}

export default function SignupPage() {
  const { values, error, setError, isLoading, setIsLoading, handleChange } = useAuthForm<SignupFormData>({
    name: "",
    email: "",
    password: "",
  })
  const router = useRouter()
  const { isAuthenticated } = useAuthenticatedRedirect()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Registration failed")
        return
      }

      router.push("/login")
    } catch {
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <Box maxW="sm" mx="auto" mt={20} p={8} borderRadius="2xl" bg="brand.white" boxShadow="lg">
      <Heading mb={6} color="brand.red" fontWeight="extrabold">
        Sign Up
      </Heading>

      {error && <ErrorState message={error} />}

      <form onSubmit={handleSubmit}>
        <AuthInput
          id="name"
          label="Name"
          value={values.name}
          onChange={handleChange("name")}
          placeholder="Enter your name"
          required
          autoComplete="name"
        />

        <AuthInput
          id="email"
          label="Email"
          type="email"
          value={values.email}
          onChange={handleChange("email")}
          placeholder="Enter your email"
          required
          autoComplete="email"
        />

        <AuthInput
          id="password"
          label="Password"
          type="password"
          value={values.password}
          onChange={handleChange("password")}
          placeholder="Enter your password"
          required
          autoComplete="new-password"
        />

        <Button
          colorScheme="brand"
          bg="brand.red"
          color="white"
          type="submit"
          width="full"
          borderRadius="lg"
          fontWeight="bold"
          loading={isLoading}
          _hover={{ bg: "brand.red", opacity: 0.85 }}
        >
          Sign Up
        </Button>
      </form>

      <Box mt={4} textAlign="center">
        <Text as="span" color="gray.600">
          Already have an account?{" "}
        </Text>
        <Link as={NextLink} href="/login" color="brand.red" fontWeight="bold">
          Login
        </Link>
      </Box>
    </Box>
  )
}
