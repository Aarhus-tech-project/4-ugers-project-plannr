"use client"
import { Box, Button, Heading, Text } from "@chakra-ui/react"
import { signOut, useSession } from "next-auth/react"

export default function WelcomePage() {
  const { data: session, status } = useSession()
  if (status === "loading") {
    return null
  }
  if (!session) {
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
    return null
  }
  return (
    <Box maxW="md" mx="auto" mt={20} p={8} borderWidth={1} borderRadius="lg">
      <Heading mb={4}>Welcome!</Heading>
      <Text mb={6}>You're logged in as {session.user?.name || "User"}.</Text>
      <Button colorScheme="red" onClick={() => signOut({ callbackUrl: "/login" })}>
        Log out
      </Button>
    </Box>
  )
}
