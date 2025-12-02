"use client"

import { AuthInput } from "@/components/forms/AuthInput"
import { ErrorState } from "@/components/ui/States"
import { useAuthForm } from "@/hooks/useAuthForm"
import { useAuthenticatedRedirect } from "@/hooks/useClientRedirect"
import type { LoginFormData } from "@/lib/types"
import { Box, Button, Heading, Link, Text } from "@chakra-ui/react"
import { signIn } from "next-auth/react"
import NextLink from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const { values, error, setError, isLoading, setIsLoading, handleChange } = useAuthForm<LoginFormData>({
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
      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        callbackUrl: "/",
      })

      if (res?.error) {
        setError(res.error || "Wrong credentials. Please try again.")
        return
      }

      if (res?.ok) {
        router.push("/")
      }
    } catch {
      setError("Login failed. Please try again.")
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
        Login
      </Heading>

      {error && <ErrorState message={error} />}

      <form onSubmit={handleSubmit}>
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
          autoComplete="current-password"
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
          Login
        </Button>
      </form>

      <Box mt={4} textAlign="center">
        <Text as="span" color="gray.600">
          Don&apos;t have an account?{" "}
        </Text>
        <Link as={NextLink} href="/signup" color="brand.red" fontWeight="bold">
          Sign up
        </Link>
      </Box>
    </Box>
  )
}
