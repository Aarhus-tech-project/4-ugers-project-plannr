import { ColorModeToggle } from "@/shared/components/layout/ColorModeToggle"
import { Button } from "@/shared/components/ui/Button"
import {
  Avatar,
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  Link,
  Menu,
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
  Portal,
} from "@chakra-ui/react"
import { signOut, useSession } from "next-auth/react"
import NextLink from "next/link"
import { useRouter } from "next/navigation"
import { FiCalendar, FiLogOut, FiPlus, FiUser } from "react-icons/fi"

export function Navigation() {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex={50}
      bg={{ base: "white", _dark: "gray.900" }}
      backdropFilter="blur(12px)"
      borderBottomWidth="1px"
      borderColor="border.muted"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgGradient: "linear(to-r, brand.red.500/5, brand.red.600/5, brand.red.500/5)",
        pointerEvents: "none",
        zIndex: -1,
      }}
    >
      <Container maxW="container.xl">
        <Flex align="center" justify="space-between" h={16}>
          {/* Logo */}
          <Link as={NextLink} href={session ? "/events" : "/"} _hover={{ textDecoration: "none" }}>
            <HStack gap={2}>
              <Icon as={FiCalendar} boxSize={6} color="brand.primary" />
              <Heading fontSize="xl" fontWeight="bold" color="fg.default" letterSpacing="tight">
                Plannr
              </Heading>
            </HStack>
          </Link>

          {/* Right Actions */}
          <HStack gap={3}>
            {session ? (
              <>
                {/* Create Event Button */}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => router.push("/events/create")}
                  display={{ base: "none", sm: "flex" }}
                >
                  <Icon as={FiPlus} mr={1} />
                  Create
                </Button>

                {/* Color Mode Toggle */}
                <ColorModeToggle />

                {/* Profile Menu */}
                <MenuRoot positioning={{ placement: "bottom-end" }}>
                  <MenuTrigger asChild>
                    <Box cursor="pointer">
                      <Avatar.Root size="sm" colorPalette="red" shape="full">
                        <Avatar.Fallback name={session.user?.name || "User"} />
                        {session.user?.avatarUrl ? <Avatar.Image src={session.user.avatarUrl} /> : null}
                      </Avatar.Root>
                    </Box>
                  </MenuTrigger>
                  <Portal>
                    <Menu.Positioner>
                      <MenuContent>
                        <MenuItem value="profile" onClick={() => router.push("/account")}>
                          <Icon as={FiUser} mr={2} />
                          Profile
                        </MenuItem>
                        <MenuItem value="events" onClick={() => router.push("/events")}>
                          <Icon as={FiCalendar} mr={2} />
                          My Events
                        </MenuItem>
                        <MenuItem value="logout" onClick={() => signOut({ callbackUrl: "/" })} color="state.error.fg">
                          <Icon as={FiLogOut} mr={2} />
                          Sign Out
                        </MenuItem>
                      </MenuContent>
                    </Menu.Positioner>
                  </Portal>
                </MenuRoot>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>
                  Sign In
                </Button>
                <Button variant="primary" size="sm" onClick={() => router.push("/signup")}>
                  Sign Up
                </Button>
              </>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}
