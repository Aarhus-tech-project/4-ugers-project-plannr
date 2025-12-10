"use client"

import { ALL_THEMES, THEME_ICON_MAP } from "@/shared/constants/event-themes"
import type { EventThemeName } from "@/shared/types"
import { Badge, Box, Flex, Grid, HStack, Icon, Input, Text, VStack } from "@chakra-ui/react"
import { useState } from "react"
import { FiSearch, FiX, FiZap } from "react-icons/fi"

interface ThemeSelectorProps {
  selectedThemes: EventThemeName[]
  onToggle: (theme: EventThemeName) => void
  maxSelections?: number
  columns?: { base?: number; md?: number; lg?: number }
  themeColor?: string
  themeBorderColor?: string | { base: string; _dark: string }
  themeIconColor?: string | { base: string; _dark: string }
  themeBgLight?: string | { base: string; _dark: string }
}

// Most commonly used themes
const POPULAR_THEMES: EventThemeName[] = [
  "Music",
  "Art",
  "Sports",
  "Tech",
  "Food",
  "Networking",
  "Business",
  "Education",
  "Festival",
  "Party",
  "Workshop",
  "Conference",
]

export function ThemeSelector({
  selectedThemes,
  onToggle,
  maxSelections,
  columns = { base: 2, md: 4, lg: 6 },
  themeColor: _themeColor,
  themeBorderColor,
  themeIconColor,
  themeBgLight,
}: ThemeSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const canSelectMore = !maxSelections || selectedThemes.length < maxSelections

  const selectedBg = themeBgLight || "bg.selected"
  const selectedBorder = themeIconColor || "brand.red.500"
  const selectedTextColor = themeIconColor || "brand.red.500"
  const hoverBorder = themeIconColor || "brand.red.500"
  const badgeBg = themeIconColor || "brand.red.500"

  // Filter themes based on search (minimum 3 characters)
  const isSearching = searchQuery.trim().length >= 3
  const filteredThemes = isSearching
    ? ALL_THEMES.filter((theme) => theme.toLowerCase().includes(searchQuery.toLowerCase()))
    : POPULAR_THEMES

  // Always show selected themes even if not in popular list
  const themesToShow = [
    ...new Set([...selectedThemes.filter((theme) => !filteredThemes.includes(theme)), ...filteredThemes]),
  ]

  const hasNoResults = isSearching && filteredThemes.length === 0

  return (
    <VStack align="stretch" gap={4}>
      {/* Selected Themes Pills */}
      {selectedThemes.length > 0 && (
        <Box>
          <Flex gap={2} flexWrap="wrap" align="center">
            <HStack gap={1} px={2} py={1} bg={themeBgLight || "purple.50"} borderRadius="md">
              <Icon as={FiZap} boxSize={3} color={themeIconColor || "purple.600"} />
              <Text fontSize="xs" fontWeight="bold" color={themeIconColor || "purple.600"}>
                Selected ({selectedThemes.length}/{maxSelections || "∞"})
              </Text>
            </HStack>
            {selectedThemes.map((theme) => (
              <Badge
                key={theme}
                px={3}
                py={1.5}
                bg={themeBgLight || "purple.50"}
                color={themeIconColor || "purple.700"}
                borderRadius="full"
                borderWidth="1px"
                borderColor={themeBorderColor || "purple.200"}
                display="flex"
                alignItems="center"
                gap={2}
                fontSize="xs"
                fontWeight="semibold"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{
                  bg: themeBorderColor || "purple.100",
                  transform: "scale(1.05)",
                }}
                onClick={() => onToggle(theme)}
              >
                {theme}
                <Icon as={FiX} boxSize={3} />
              </Badge>
            ))}
          </Flex>
        </Box>
      )}

      {/* Search Bar */}
      <Box position="relative">
        <Icon
          as={FiSearch}
          position="absolute"
          left={3}
          top="50%"
          transform="translateY(-50%)"
          color="fg.muted"
          boxSize={4}
        />
        <Input
          placeholder="Type to explore 64 themes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          pl={10}
          pr={searchQuery ? 10 : 3}
          bg="bg.surface"
          borderColor={themeBorderColor || "border.default"}
          _focus={{
            borderColor: themeIconColor || "brand.primary",
            boxShadow: `0 0 0 1px ${themeIconColor || "brand.primary"}`,
          }}
        />
        {searchQuery && (
          <Icon
            as={FiX}
            position="absolute"
            right={3}
            top="50%"
            transform="translateY(-50%)"
            color="fg.muted"
            boxSize={4}
            cursor="pointer"
            onClick={() => setSearchQuery("")}
            _hover={{ color: "fg.default" }}
            transition="color 0.2s"
          />
        )}
      </Box>

      {/* No results state */}
      {hasNoResults && (
        <VStack gap={3} py={8} px={4}>
          <Box
            w={16}
            h={16}
            borderRadius="full"
            bg={{ base: "gray.100", _dark: "gray.800" }}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={FiSearch} boxSize={8} color={{ base: "gray.400", _dark: "gray.600" }} />
          </Box>
          <VStack gap={1}>
            <Text fontSize="md" fontWeight="bold" color="fg.default">
              No themes found
            </Text>
            <Text fontSize="sm" color="fg.muted" textAlign="center">
              Try searching for "{searchQuery.slice(0, -1)}" or explore popular themes below
            </Text>
          </VStack>
          <Box
            as="button"
            px={4}
            py={2}
            bg={themeBgLight || "purple.50"}
            color={themeIconColor || "purple.600"}
            borderRadius="md"
            borderWidth="1px"
            borderColor={themeBorderColor || "purple.200"}
            fontWeight="semibold"
            fontSize="sm"
            onClick={() => setSearchQuery("")}
            _hover={{ bg: themeBorderColor || "purple.100" }}
            transition="all 0.2s"
          >
            Clear search
          </Box>
        </VStack>
      )}

      {/* Theme Grid - only show if we have results */}
      {!hasNoResults && (
        <>
          <Grid
            templateColumns={{
              base: `repeat(${columns.base || 2}, 1fr)`,
              md: `repeat(${columns.md || 4}, 1fr)`,
              lg: `repeat(${columns.lg || 6}, 1fr)`,
            }}
            gap={3}
          >
            {themesToShow.map((theme, index) => {
              const isSelected = selectedThemes.includes(theme)
              const ThemeIcon = THEME_ICON_MAP[theme]
              const isDisabled = !isSelected && !canSelectMore

              return (
                <Box
                  key={theme}
                  as="button"
                  onClick={() => !isDisabled && onToggle(theme)}
                  p={4}
                  bg={isSelected ? selectedBg : "bg.surface"}
                  borderWidth="2px"
                  borderColor={isSelected ? selectedBorder : themeBorderColor || "border.default"}
                  borderRadius="lg"
                  cursor={isDisabled ? "not-allowed" : "pointer"}
                  opacity={isDisabled ? 0.5 : 1}
                  transition="all 0.2s"
                  animation={isSearching ? `fadeIn 0.3s ease ${index * 0.03}s both` : undefined}
                  _hover={
                    !isDisabled
                      ? {
                          borderColor: hoverBorder,
                          transform: "translateY(-2px)",
                          boxShadow: "md",
                        }
                      : {}
                  }
                  _active={
                    !isDisabled
                      ? {
                          transform: "translateY(0)",
                        }
                      : {}
                  }
                  position="relative"
                >
                  <VStack gap={2}>
                    <Icon
                      as={ThemeIcon}
                      boxSize={6}
                      color={isSelected ? selectedTextColor : "fg.muted"}
                      transition="color 0.2s"
                    />
                    <Text
                      fontSize="sm"
                      fontWeight={isSelected ? "semibold" : "medium"}
                      color={isSelected ? selectedTextColor : "fg.default"}
                      textAlign="center"
                      lineHeight="tight"
                      transition="all 0.2s"
                    >
                      {theme}
                    </Text>
                  </VStack>
                  {isSelected && (
                    <Badge
                      position="absolute"
                      top={1}
                      right={1}
                      size="sm"
                      bg={badgeBg}
                      color="fg.inverted"
                      borderRadius="full"
                      px={2}
                      py={0.5}
                      animation="scaleIn 0.2s ease"
                    >
                      ✓
                    </Badge>
                  )}
                </Box>
              )
            })}
          </Grid>

          {/* Helper text */}
          {!searchQuery && (
            <Box
              p={3}
              bg={themeBgLight || "purple.50"}
              borderRadius="md"
              borderWidth="1px"
              borderColor={themeBorderColor || "purple.200"}
            >
              <Text fontSize="xs" color="fg.muted" textAlign="center">
                ✨ Showing {POPULAR_THEMES.length} popular themes • Type to search all {ALL_THEMES.length} themes
              </Text>
            </Box>
          )}

          {isSearching && (
            <Box
              p={3}
              bg={{ base: "green.50", _dark: "rgba(20, 83, 45, 0.2)" }}
              borderRadius="md"
              borderWidth="1px"
              borderColor={{ base: "green.200", _dark: "green.700" }}
            >
              <Text fontSize="xs" color={{ base: "green.700", _dark: "green.200" }} textAlign="center">
                🎯 Found {filteredThemes.length} theme{filteredThemes.length !== 1 ? "s" : ""} matching "{searchQuery}"
              </Text>
            </Box>
          )}
        </>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
      `}</style>
    </VStack>
  )
}
