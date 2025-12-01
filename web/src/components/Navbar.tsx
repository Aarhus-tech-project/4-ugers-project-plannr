"use client"
import { Box, Button, Flex, Heading, Icon, IconButton, Menu, Portal } from "@chakra-ui/react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { FiMenu } from "react-icons/fi"

export default function Navbar({ show }: { show?: boolean }) {
  const router = useRouter()
  const pathname = typeof window !== "undefined" ? window.location.pathname : ""
  // Hide navbar on login and signup pages
  const hiddenRoutes = ["/login", "/signup", "/create-user"]
  const shouldShow = show !== false && !hiddenRoutes.includes(pathname)
  if (!shouldShow) return null
  const handleLogout = async () => {
    await signOut({ redirect: false })
    // Clear any local/session storage if used
    if (typeof window !== "undefined") {
      localStorage.clear()
      sessionStorage.clear()
    }
    router.push("/login")
  }
  return (
    <Box as="nav" bg="brand.white" boxShadow="sm" py={3} px={6}>
      <Flex align="center" justify="space-between">
        <Heading size="md" color="brand.red" fontWeight="extrabold">
          Plannr
        </Heading>
        <Flex align="center" gap={4}>
          <Button
            colorScheme="brand"
            bg="brand.red"
            color="white"
            borderRadius="lg"
            fontWeight="bold"
            _hover={{ bg: "brand.red", opacity: 0.85 }}
            onClick={() => router.push("/events")}
          >
            Events
          </Button>
          <Menu.Root>
            <Menu.Trigger asChild>
              <IconButton variant="ghost" color="brand.red" aria-label="Open menu" _hover={{ bg: "gray.100" }}>
                <Icon as={FiMenu} boxSize={6} />
              </IconButton>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content bg="brand.white" borderRadius="xl" boxShadow="lg">
                  <Menu.Item
                    value="account"
                    color="gray.900"
                    _hover={{ bg: "gray.100" }}
                    onClick={() => router.push("/account")}
                  >
                    Account
                  </Menu.Item>
                  <Menu.Item value="logout" color="brand.red" _hover={{ bg: "gray.100" }} onClick={handleLogout}>
                    Logout
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Flex>
      </Flex>
    </Box>
  )
}
