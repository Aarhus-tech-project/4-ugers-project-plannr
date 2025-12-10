import type { AIFeedbackItem } from "@/features/event-creation/hooks"
import { Card } from "@/shared/components/ui/Card"
import { Box, HStack, Icon, Text, VStack } from "@chakra-ui/react"
import { FiAward } from "react-icons/fi"

interface AIFeedbackPanelProps {
  prioritizedFeedback: AIFeedbackItem[]
  onSectionClick: (section: number) => void
}

export function AIFeedbackPanel({ prioritizedFeedback, onSectionClick }: AIFeedbackPanelProps) {
  return (
    <Card p={4} bg="bg.surface" shadow="sm">
      <VStack align="stretch" gap={4}>
        <HStack gap={2}>
          <Icon as={FiAward} boxSize={4} color="brand.primary" />
          <Text fontSize="sm" fontWeight="bold" color="fg.default">
            AI Event Coach
          </Text>
        </HStack>

        <Box h="1px" bg="border.default" />

        {/* Live AI Feedback */}
        <VStack align="stretch" gap={2}>
          {prioritizedFeedback.length === 0 && (
            <Box p={4} bg={{ base: "gray.50", _dark: "gray.800" }} borderRadius="md" textAlign="center">
              <Text fontSize="xs" color="fg.muted">
                Start adding event details to get personalized suggestions
              </Text>
            </Box>
          )}

          {prioritizedFeedback.map((item, index) => (
            <Box
              key={index}
              position="relative"
              p={4}
              bg={
                item.type === "critical"
                  ? { base: "rgba(254, 226, 226, 0.6)", _dark: "rgba(127, 29, 29, 0.3)" }
                  : item.type === "important"
                  ? { base: "rgba(255, 237, 213, 0.6)", _dark: "rgba(124, 45, 18, 0.3)" }
                  : item.type === "suggestion"
                  ? { base: "rgba(219, 234, 254, 0.6)", _dark: "rgba(30, 58, 138, 0.3)" }
                  : { base: "rgba(220, 252, 231, 0.6)", _dark: "rgba(20, 83, 45, 0.3)" }
              }
              backdropFilter="blur(10px)"
              borderRadius="xl"
              borderWidth="1px"
              borderColor={
                item.type === "critical"
                  ? { base: "rgba(252, 165, 165, 0.5)", _dark: "rgba(185, 28, 28, 0.5)" }
                  : item.type === "important"
                  ? { base: "rgba(253, 186, 116, 0.5)", _dark: "rgba(194, 65, 12, 0.5)" }
                  : item.type === "suggestion"
                  ? { base: "rgba(147, 197, 253, 0.5)", _dark: "rgba(37, 99, 235, 0.5)" }
                  : { base: "rgba(134, 239, 172, 0.5)", _dark: "rgba(21, 128, 61, 0.5)" }
              }
              boxShadow={
                item.type === "critical"
                  ? {
                      base: "0 4px 6px -1px rgba(239, 68, 68, 0.1), 0 2px 4px -1px rgba(239, 68, 68, 0.06)",
                      _dark: "0 4px 6px -1px rgba(185, 28, 28, 0.2), 0 2px 4px -1px rgba(185, 28, 28, 0.1)",
                    }
                  : item.type === "important"
                  ? {
                      base: "0 4px 6px -1px rgba(249, 115, 22, 0.1), 0 2px 4px -1px rgba(249, 115, 22, 0.06)",
                      _dark: "0 4px 6px -1px rgba(194, 65, 12, 0.2), 0 2px 4px -1px rgba(194, 65, 12, 0.1)",
                    }
                  : item.type === "suggestion"
                  ? {
                      base: "0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.06)",
                      _dark: "0 4px 6px -1px rgba(37, 99, 235, 0.2), 0 2px 4px -1px rgba(37, 99, 235, 0.1)",
                    }
                  : {
                      base: "0 4px 6px -1px rgba(34, 197, 94, 0.1), 0 2px 4px -1px rgba(34, 197, 94, 0.06)",
                      _dark: "0 4px 6px -1px rgba(21, 128, 61, 0.2), 0 2px 4px -1px rgba(21, 128, 61, 0.1)",
                    }
              }
              transition="all 0.3s ease"
              overflow="hidden"
              cursor={item.type !== "success" && item.section !== undefined ? "pointer" : "default"}
              onClick={() => {
                if (item.type !== "success" && item.section !== undefined) {
                  onSectionClick(item.section)
                }
              }}
              _hover={
                item.type !== "success" && item.section !== undefined
                  ? {
                      transform: "translateY(-2px)",
                      boxShadow:
                        item.type === "critical"
                          ? {
                              base: "0 10px 15px -3px rgba(239, 68, 68, 0.15), 0 4px 6px -2px rgba(239, 68, 68, 0.08)",
                              _dark: "0 10px 15px -3px rgba(185, 28, 28, 0.3), 0 4px 6px -2px rgba(185, 28, 28, 0.15)",
                            }
                          : item.type === "important"
                          ? {
                              base: "0 10px 15px -3px rgba(249, 115, 22, 0.15), 0 4px 6px -2px rgba(249, 115, 22, 0.08)",
                              _dark: "0 10px 15px -3px rgba(194, 65, 12, 0.3), 0 4px 6px -2px rgba(194, 65, 12, 0.15)",
                            }
                          : {
                              base: "0 10px 15px -3px rgba(59, 130, 246, 0.15), 0 4px 6px -2px rgba(59, 130, 246, 0.08)",
                              _dark: "0 10px 15px -3px rgba(37, 99, 235, 0.3), 0 4px 6px -2px rgba(37, 99, 235, 0.15)",
                            },
                    }
                  : {}
              }
              animation={index === 0 ? "fadeIn 0.5s ease" : undefined}
            >
              {/* Large background icon */}
              <Icon
                as={item.icon}
                position="absolute"
                right={-2}
                top="50%"
                transform="translateY(-50%)"
                boxSize={20}
                color={
                  item.type === "critical"
                    ? { base: "rgba(239, 68, 68, 0.08)", _dark: "rgba(185, 28, 28, 0.15)" }
                    : item.type === "important"
                    ? { base: "rgba(249, 115, 22, 0.08)", _dark: "rgba(194, 65, 12, 0.15)" }
                    : item.type === "suggestion"
                    ? { base: "rgba(59, 130, 246, 0.08)", _dark: "rgba(37, 99, 235, 0.15)" }
                    : { base: "rgba(34, 197, 94, 0.08)", _dark: "rgba(21, 128, 61, 0.15)" }
                }
                pointerEvents="none"
              />

              {/* Content */}
              <HStack gap={3} align="start" position="relative" zIndex={1}>
                <Icon
                  as={item.icon}
                  boxSize={5}
                  color={
                    item.type === "critical"
                      ? { base: "red.600", _dark: "red.400" }
                      : item.type === "important"
                      ? { base: "orange.600", _dark: "orange.400" }
                      : item.type === "suggestion"
                      ? { base: "blue.600", _dark: "blue.400" }
                      : { base: "green.600", _dark: "green.400" }
                  }
                  flexShrink={0}
                  mt={0.5}
                />
                <VStack align="start" gap={0} flex={1}>
                  <Text
                    fontSize="xs"
                    fontWeight={item.type === "success" ? "semibold" : "medium"}
                    color={
                      item.type === "critical"
                        ? { base: "red.700", _dark: "red.200" }
                        : item.type === "important"
                        ? { base: "orange.700", _dark: "orange.200" }
                        : item.type === "suggestion"
                        ? { base: "blue.700", _dark: "blue.200" }
                        : { base: "green.700", _dark: "green.200" }
                    }
                  >
                    {item.message}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          ))}
        </VStack>
      </VStack>
    </Card>
  )
}
