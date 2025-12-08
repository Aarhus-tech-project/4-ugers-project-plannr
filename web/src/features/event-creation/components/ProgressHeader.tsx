import { Box, Center, Container, Flex, HStack, Icon, Text, VStack } from "@chakra-ui/react"
import { FiAward, FiCheckCircle, FiEdit3, FiStar, FiTrendingUp } from "react-icons/fi"

interface ProgressHeaderProps {
  title: string
  currentSectionTitle: string
  requiredComplete: boolean
  requiredFieldsCount: number
  requiredFieldsTotal: number
  highImpactCount: number
  highImpactTotal: number
  qualityScore: string
  qualityPoints: number
  completionPercent: number
  completedFieldsCount: number
  totalFieldsCount: number
  prevCompletionPercent: number
  showProgressBoost: boolean
}

export function ProgressHeader({
  title,
  currentSectionTitle,
  requiredComplete,
  requiredFieldsCount,
  requiredFieldsTotal,
  highImpactCount,
  highImpactTotal,
  qualityScore,
  qualityPoints,
  completionPercent,
  completedFieldsCount,
  totalFieldsCount,
  prevCompletionPercent,
  showProgressBoost,
}: ProgressHeaderProps) {
  return (
    <Box
      position="sticky"
      top={0}
      zIndex={100}
      bg="bg.surface"
      borderBottomWidth="1px"
      borderColor="border.default"
      shadow="md"
      backdropFilter="blur(8px)"
    >
      <Container maxW="container.xl" py={4}>
        <Flex align="center" justify="space-between" gap={6}>
          <HStack gap={3} flex={1}>
            <Box p={2} bg="brand.primary" borderRadius="lg">
              <Icon as={FiEdit3} boxSize={5} color="white" />
            </Box>
            <VStack align="start" gap={0}>
              <Text fontSize="sm" fontWeight="bold" color="fg.default">
                {title || "Untitled Event"}
              </Text>
              <Text fontSize="xs" color="fg.muted">
                {currentSectionTitle}
              </Text>
            </VStack>
          </HStack>

          <HStack gap={3}>
            {/* Required Fields Badge */}
            <HStack
              gap={2}
              px={3}
              py={2}
              borderRadius="lg"
              bg={
                requiredComplete ? { base: "green.50", _dark: "green.900/20" } : { base: "red.50", _dark: "red.900/20" }
              }
              borderWidth="1px"
              borderColor={
                requiredComplete ? { base: "green.200", _dark: "green.700" } : { base: "red.200", _dark: "red.700" }
              }
              transition="all 0.3s ease"
            >
              <Icon
                as={FiCheckCircle}
                boxSize={4}
                color={
                  requiredComplete ? { base: "green.600", _dark: "green.400" } : { base: "red.600", _dark: "red.400" }
                }
              />
              <VStack gap={0} align="start">
                <Text
                  fontSize="10px"
                  fontWeight="medium"
                  color={
                    requiredComplete ? { base: "green.600", _dark: "green.400" } : { base: "red.600", _dark: "red.400" }
                  }
                  lineHeight="1"
                >
                  Required
                </Text>
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color={
                    requiredComplete ? { base: "green.700", _dark: "green.200" } : { base: "red.700", _dark: "red.200" }
                  }
                  lineHeight="1"
                >
                  {requiredFieldsCount}/{requiredFieldsTotal}
                </Text>
              </VStack>
            </HStack>

            {/* High Impact Badge */}
            <HStack
              gap={2}
              px={3}
              py={2}
              borderRadius="lg"
              bg={
                highImpactCount === highImpactTotal
                  ? { base: "blue.50", _dark: "blue.900/20" }
                  : highImpactCount >= highImpactTotal / 2
                  ? { base: "cyan.50", _dark: "cyan.900/20" }
                  : highImpactCount > 0
                  ? { base: "orange.50", _dark: "orange.900/20" }
                  : { base: "gray.50", _dark: "gray.800" }
              }
              borderWidth="1px"
              borderColor={
                highImpactCount === highImpactTotal
                  ? { base: "blue.300", _dark: "blue.700" }
                  : highImpactCount >= highImpactTotal / 2
                  ? { base: "cyan.300", _dark: "cyan.700" }
                  : highImpactCount > 0
                  ? { base: "orange.300", _dark: "orange.700" }
                  : { base: "gray.300", _dark: "gray.600" }
              }
              transition="all 0.3s ease"
            >
              <Icon
                as={FiStar}
                boxSize={4}
                color={
                  highImpactCount === highImpactTotal
                    ? { base: "blue.700", _dark: "blue.200" }
                    : highImpactCount >= highImpactTotal / 2
                    ? { base: "cyan.700", _dark: "cyan.200" }
                    : highImpactCount > 0
                    ? { base: "orange.700", _dark: "orange.200" }
                    : { base: "gray.600", _dark: "gray.400" }
                }
              />
              <VStack gap={0} align="start">
                <Text
                  fontSize="10px"
                  fontWeight="medium"
                  color={
                    highImpactCount === highImpactTotal
                      ? { base: "blue.700", _dark: "blue.200" }
                      : highImpactCount >= highImpactTotal / 2
                      ? { base: "cyan.700", _dark: "cyan.200" }
                      : highImpactCount > 0
                      ? { base: "orange.700", _dark: "orange.200" }
                      : { base: "gray.600", _dark: "gray.400" }
                  }
                  lineHeight="1"
                >
                  Visual Appeal
                </Text>
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color={
                    highImpactCount === highImpactTotal
                      ? { base: "blue.800", _dark: "blue.100" }
                      : highImpactCount >= highImpactTotal / 2
                      ? { base: "cyan.800", _dark: "cyan.100" }
                      : highImpactCount > 0
                      ? { base: "orange.800", _dark: "orange.100" }
                      : { base: "gray.700", _dark: "gray.300" }
                  }
                  lineHeight="1"
                >
                  {highImpactCount}/{highImpactTotal}
                </Text>
              </VStack>
            </HStack>

            {/* Quality Score Badge */}
            <HStack
              gap={2}
              px={3}
              py={2}
              borderRadius="lg"
              bg={
                qualityPoints >= 70
                  ? { base: "purple.50", _dark: "purple.900/20" }
                  : qualityPoints >= 40
                  ? { base: "violet.50", _dark: "violet.900/20" }
                  : qualityPoints > 0
                  ? { base: "pink.50", _dark: "pink.900/20" }
                  : { base: "gray.50", _dark: "gray.800" }
              }
              borderWidth="1px"
              borderColor={
                qualityPoints >= 70
                  ? { base: "purple.200", _dark: "purple.700" }
                  : qualityPoints >= 40
                  ? { base: "violet.200", _dark: "violet.700" }
                  : qualityPoints > 0
                  ? { base: "pink.300", _dark: "pink.700" }
                  : { base: "gray.300", _dark: "gray.600" }
              }
              transition="all 0.3s ease"
            >
              <Icon
                as={FiAward}
                boxSize={4}
                color={
                  qualityPoints >= 70
                    ? { base: "purple.600", _dark: "purple.400" }
                    : qualityPoints >= 40
                    ? { base: "violet.600", _dark: "violet.400" }
                    : qualityPoints > 0
                    ? { base: "pink.600", _dark: "pink.400" }
                    : { base: "gray.600", _dark: "gray.400" }
                }
              />
              <VStack gap={0} align="start">
                <Text
                  fontSize="10px"
                  fontWeight="medium"
                  color={
                    qualityPoints >= 70
                      ? { base: "purple.600", _dark: "purple.300" }
                      : qualityPoints >= 40
                      ? { base: "violet.600", _dark: "violet.300" }
                      : qualityPoints > 0
                      ? { base: "pink.600", _dark: "pink.300" }
                      : { base: "gray.600", _dark: "gray.400" }
                  }
                  lineHeight="1"
                >
                  Polish
                </Text>
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color={
                    qualityPoints >= 70
                      ? { base: "purple.700", _dark: "purple.200" }
                      : qualityPoints >= 40
                      ? { base: "violet.700", _dark: "violet.200" }
                      : qualityPoints > 0
                      ? { base: "pink.700", _dark: "pink.200" }
                      : { base: "gray.700", _dark: "gray.300" }
                  }
                  lineHeight="1"
                >
                  {qualityScore}
                </Text>
              </VStack>
            </HStack>

            {/* Overall Progress Badge */}
            <HStack
              gap={2}
              px={3}
              py={2}
              borderRadius="lg"
              bg={
                completionPercent >= 75
                  ? { base: "teal.50", _dark: "teal.900/20" }
                  : completionPercent >= 50
                  ? { base: "blue.50", _dark: "blue.900/20" }
                  : completionPercent > 0
                  ? { base: "orange.50", _dark: "orange.900/20" }
                  : { base: "gray.50", _dark: "gray.800" }
              }
              borderWidth="1px"
              borderColor={
                completionPercent >= 75
                  ? { base: "teal.200", _dark: "teal.700" }
                  : completionPercent >= 50
                  ? { base: "blue.200", _dark: "blue.700" }
                  : completionPercent > 0
                  ? { base: "orange.200", _dark: "orange.700" }
                  : { base: "gray.300", _dark: "gray.600" }
              }
              transition="all 0.3s ease"
            >
              <Icon
                as={FiTrendingUp}
                boxSize={4}
                color={
                  completionPercent >= 75
                    ? { base: "teal.600", _dark: "teal.400" }
                    : completionPercent >= 50
                    ? { base: "blue.600", _dark: "blue.400" }
                    : completionPercent > 0
                    ? { base: "orange.600", _dark: "orange.400" }
                    : { base: "gray.600", _dark: "gray.400" }
                }
              />
              <VStack gap={0} align="start">
                <Text
                  fontSize="10px"
                  fontWeight="medium"
                  color={
                    completionPercent >= 75
                      ? { base: "teal.600", _dark: "teal.300" }
                      : completionPercent >= 50
                      ? { base: "blue.600", _dark: "blue.300" }
                      : completionPercent > 0
                      ? { base: "orange.600", _dark: "orange.300" }
                      : { base: "gray.600", _dark: "gray.400" }
                  }
                  lineHeight="1"
                >
                  Overall
                </Text>
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color={
                    completionPercent >= 75
                      ? { base: "teal.700", _dark: "teal.200" }
                      : completionPercent >= 50
                      ? { base: "blue.700", _dark: "blue.200" }
                      : completionPercent > 0
                      ? { base: "orange.700", _dark: "orange.200" }
                      : { base: "gray.700", _dark: "gray.300" }
                  }
                  lineHeight="1"
                >
                  {completedFieldsCount}/{totalFieldsCount}
                </Text>
              </VStack>
            </HStack>
          </HStack>
        </Flex>

        {/* Progress Bar */}
        <Box mt={4} position="relative">
          {/* Fixed height container to prevent layout shift */}
          <Box position="relative" minH="20px">
            <Box h="4" bg="bg.muted" borderRadius="full" overflow="visible" position="relative">
              <Box
                h="full"
                bg={
                  completionPercent >= 75
                    ? "linear-gradient(135deg, #4CAF50 0%, #8BC34A 50%, #CDDC39 100%)"
                    : completionPercent >= 50
                    ? "linear-gradient(135deg, #2196F3 0%, #03A9F4 50%, #00BCD4 100%)"
                    : "linear-gradient(135deg, #E63946 0%, #FF6B6B 50%, #FF8E53 100%)"
                }
                borderRadius="full"
                transition={
                  completionPercent > prevCompletionPercent
                    ? "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
                    : "all 0.3s ease-in"
                }
                w={`${completionPercent}%`}
                position="relative"
                overflow="visible"
                boxShadow={
                  completionPercent >= 75
                    ? showProgressBoost
                      ? "0 0 25px rgba(76, 175, 80, 0.8), 0 0 50px rgba(76, 175, 80, 0.4)"
                      : "0 0 15px rgba(76, 175, 80, 0.5), 0 0 30px rgba(76, 175, 80, 0.2)"
                    : completionPercent >= 50
                    ? showProgressBoost
                      ? "0 0 20px rgba(33, 150, 243, 0.7), 0 0 40px rgba(33, 150, 243, 0.3)"
                      : "0 0 10px rgba(33, 150, 243, 0.4)"
                    : showProgressBoost
                    ? "0 0 15px rgba(230, 57, 70, 0.6)"
                    : "none"
                }
                css={{
                  "--shimmer-width": "60px",
                }}
                animation={
                  completionPercent >= 75
                    ? "progressPulse 2s ease-in-out infinite"
                    : completionPercent >= 50
                    ? "progressPulse 3s ease-in-out infinite"
                    : "none"
                }
              >
                {/* Shimmer effect - adapts to filled progress width */}
                {completionPercent > 0 && completionPercent < 100 && (
                  <Box position="absolute" top={0} left={0} right={0} bottom={0} pointerEvents="none" overflow="hidden">
                    <Box
                      position="absolute"
                      top={0}
                      bottom={0}
                      width="var(--shimmer-width)"
                      background="linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)"
                      animation="shimmerProgress 2.5s infinite"
                      css={{
                        left: "calc(-1 * var(--shimmer-width))",
                      }}
                    />
                  </Box>
                )}

                {/* Floating Progress Badge - Fixed at end of progress bar */}
                <Center
                  position="absolute"
                  right="-30px"
                  top="50%"
                  transform="translateY(-50%)"
                  zIndex={10}
                  w="60px"
                  h="24px"
                  borderRadius="full"
                  bg={completionPercent >= 75 ? "green.500" : completionPercent >= 50 ? "blue.500" : "brand.primary"}
                  boxShadow={
                    completionPercent >= 75
                      ? "0 0 0 3px rgba(76, 175, 80, 0.15), 0 0 20px rgba(76, 175, 80, 0.6), 0 4px 12px rgba(0, 0, 0, 0.15)"
                      : completionPercent >= 50
                      ? "0 0 0 3px rgba(33, 150, 243, 0.15), 0 0 20px rgba(33, 150, 243, 0.6), 0 4px 12px rgba(0, 0, 0, 0.15)"
                      : "0 0 0 3px rgba(230, 57, 70, 0.15), 0 0 20px rgba(230, 57, 70, 0.6), 0 4px 12px rgba(0, 0, 0, 0.15)"
                  }
                  transition="all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
                  animation={showProgressBoost ? "pulse 0.6s ease-in-out" : "none"}
                  overflow="hidden"
                >
                  {/* Inner gradient overlay */}
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    borderRadius="full"
                    background={
                      completionPercent >= 75
                        ? "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 100%)"
                        : completionPercent >= 50
                        ? "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 100%)"
                        : "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 100%)"
                    }
                    pointerEvents="none"
                  />

                  {/* Percentage text */}
                  <Text
                    fontSize="xs"
                    fontWeight="black"
                    color="white"
                    letterSpacing="-0.5px"
                    position="relative"
                    zIndex={1}
                    lineHeight="1"
                    css={{
                      textShadow: "0 1px 3px rgba(0,0,0,0.3)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {completionPercent}%
                  </Text>
                </Center>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
