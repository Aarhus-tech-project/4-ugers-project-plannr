"use client"
import { Box, Button, Flex, Heading, HStack, Icon, Image, Text, VStack } from "@chakra-ui/react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { FiCalendar, FiCheckCircle, FiUsers } from "react-icons/fi"

export default function LandingPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  if (status === "loading") return null
  if (!session) {
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
    return null
  }
  return (
    <Box minH="100vh" bg="brand.white" display="flex" flexDirection="column">
      <Flex direction="column" align="center" justify="center" flex={1} py={16} px={4}>
        <Image src="/logo.svg" alt="Plannr Logo" boxSize="80px" mb={6} />
        <Heading as="h1" size="2xl" color="brand.red" fontWeight="extrabold" textAlign="center" mb={4}>
          Welcome, {session.user?.name || "Plannr User"}!
        </Heading>
        <Text fontSize="xl" color="gray.700" textAlign="center" mb={8}>
          Discover new events, connect with friends, and make every moment memorable.
        </Text>
        <Button
          size="lg"
          bg="brand.red"
          color="white"
          borderRadius="xl"
          fontWeight="bold"
          px={8}
          py={6}
          fontSize="xl"
          boxShadow="lg"
          _hover={{ bg: "brand.red", opacity: 0.85 }}
          onClick={() => router.push("/events")}
        >
          Explore Events
        </Button>
        <VStack mt={12} gap={8} align="center">
          <HStack gap={6}>
            <Feature
              icon={<Icon as={FiCalendar} boxSize={8} color="brand.red" />}
              title="Find Events"
              description="Browse curated events and discover what's happening nearby."
            />
            <Feature
              icon={<Icon as={FiUsers} boxSize={8} color="brand.red" />}
              title="Connect"
              description="Invite friends, join groups, and make plans together."
            />
            <Feature
              icon={<Icon as={FiCheckCircle} boxSize={8} color="brand.red" />}
              title="Easy RSVP"
              description="RSVP in one click and get instant updates."
            />
          </HStack>
        </VStack>
      </Flex>
      <Box as="footer" textAlign="center" py={6} color="gray.400" fontSize="sm">
        &copy; {new Date().getFullYear()} Plannr. All rights reserved.
      </Box>
    </Box>
  )
}

function Feature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <VStack gap={2} align="center" maxW="180px">
      {icon}
      <Text fontWeight="bold" color="gray.900" fontSize="lg">
        {title}
      </Text>
      <Text color="gray.600" fontSize="md" textAlign="center">
        {description}
      </Text>
    </VStack>
  )
}