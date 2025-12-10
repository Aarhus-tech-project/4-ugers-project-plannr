"use client"

import {
  Box,
  Toaster as ChakraToaster,
  HStack,
  Icon,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from "@chakra-ui/react"
import { FiZap } from "react-icons/fi"

export const toaster = createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
})

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
        {(toast) => {
          const isPro = toast.title === "Pro Tip"
          const duration = toast.duration || 5000

          return (
            <Toast.Root width={{ md: "sm" }}>
              {isPro && (
                <Box position="absolute" top={0} left={0} right={0} h="4px" bg="purple.200" overflow="hidden">
                  <Box
                    h="full"
                    bg="linear-gradient(90deg, #9333EA 0%, #C084FC 100%)"
                    animation={`countdownBar ${duration}ms linear forwards`}
                    transformOrigin="left"
                  />
                </Box>
              )}

              <HStack gap={3} pt={isPro ? 2 : 0}>
                {toast.type === "loading" ? (
                  <Spinner size="sm" color="blue.solid" />
                ) : isPro ? (
                  <Box p={2} bg="purple.500" borderRadius="lg" flexShrink={0}>
                    <Icon asChild boxSize={5} color="white">
                      <FiZap />
                    </Icon>
                  </Box>
                ) : (
                  <Toast.Indicator />
                )}
                <Stack gap="1" flex="1" maxWidth="100%">
                  {toast.title && (
                    <Toast.Title
                      fontSize={isPro ? "xs" : undefined}
                      fontWeight={isPro ? "bold" : undefined}
                      textTransform={isPro ? "uppercase" : undefined}
                      letterSpacing={isPro ? "wide" : undefined}
                    >
                      {toast.title}
                    </Toast.Title>
                  )}
                  {toast.description && <Toast.Description>{toast.description}</Toast.Description>}
                </Stack>
              </HStack>
              {toast.action && <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>}
              <Toast.CloseTrigger />
            </Toast.Root>
          )
        }}
      </ChakraToaster>
    </Portal>
  )
}
