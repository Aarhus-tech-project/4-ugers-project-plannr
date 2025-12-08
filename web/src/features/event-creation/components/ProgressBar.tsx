import { Box, Center, Container, Text } from "@chakra-ui/react"

interface ProgressBarProps {
  completionPercent: number
  prevCompletionPercent: number
  showProgressBoost: boolean
}

export function ProgressBar({ completionPercent, prevCompletionPercent, showProgressBoost }: ProgressBarProps) {
  return (
    <Container maxW="container.xl">
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
  )
}
