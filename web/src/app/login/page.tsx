"use client"

import { useAuthForm } from "@/features/auth/hooks/useAuthForm"
import { Button } from "@/shared/components/ui/Button"
import { Card } from "@/shared/components/ui/Card"
import { Input } from "@/shared/components/ui/Input"
import { useAuthenticatedRedirect } from "@/shared/hooks/useClientRedirect"
import type { LoginFormData } from "@/shared/types"
import { Box, Heading, Icon, Link, Text, VStack } from "@chakra-ui/react"
import { signIn } from "next-auth/react"
import NextLink from "next/link"
import { useRouter } from "next/navigation"
import { FiCalendar } from "react-icons/fi"

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
        callbackUrl: "/events",
      })

      if (res?.error) {
        setError(res.error || "Wrong credentials. Please try again.")
        return
      }

      if (res?.ok) {
        router.push("/events")
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
    <Box minH="100vh" bg="bg.canvas" display="flex" alignItems="center" justifyContent="center" p={4}>
      <Box maxW="420px" w="full">
        <VStack gap={8} align="stretch">
          {/* Logo */}
          <VStack gap={3} textAlign="center">
            <Box p={3} bg="brand.primary" borderRadius="xl">
              <Icon as={FiCalendar} boxSize={8} color="fg.inverted" />
            </Box>
            <Heading fontSize="4xl" fontWeight="extrabold" color="fg.default" letterSpacing="tight">
              Plannr
            </Heading>
            <Text fontSize="md" color="fg.muted">
              Sign in to discover events
            </Text>
          </VStack>

          {/* Card */}
          <Card variant="elevated" p={6}>
            <form onSubmit={handleSubmit}>
              <VStack gap={4} align="stretch">
                <Input
                  type="email"
                  label="Email"
                  placeholder="you@example.com"
                  value={values.email}
                  onChange={(e) => handleChange("email")(e)}
                  error={error?.includes("email") ? error : undefined}
                  required
                  autoComplete="email"
                />

                <Input
                  type="password"
                  label="Password"
                  placeholder="••••••••"
                  value={values.password}
                  onChange={(e) => handleChange("password")(e)}
                  error={error && !error.includes("email") ? error : undefined}
                  required
                  autoComplete="current-password"
                />

                <Button type="submit" width="full" size="lg" loading={isLoading} mt={2}>
                  Sign In
                </Button>
              </VStack>
            </form>
          </Card>

          {/* Footer */}
          <Box textAlign="center">
            <Text fontSize="sm" color="fg.muted">
              Don&apos;t have an account?{" "}
              <Link
                as={NextLink}
                href="/signup"
                color="brand.primary"
                fontWeight="semibold"
                _hover={{ textDecoration: "underline" }}
              >
                Sign up
              </Link>
            </Text>
          </Box>
        </VStack>
      </Box>
    </Box>
  )
}
