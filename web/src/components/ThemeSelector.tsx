import { Box, Button, chakra, Menu, Portal, Text } from "@chakra-ui/react"
import type { EventThemeName } from "@interfaces/event"
import { FaChevronDown } from "react-icons/fa"
import { allThemes, themeIconMap } from "../utils/themeIcons"

export function ThemeSelector({
  selectedThemes,
  onChange,
}: {
  selectedThemes: EventThemeName[]
  onChange: (themes: EventThemeName[]) => void
}) {
  return (
    <Menu.Root closeOnSelect={false}>
      <Menu.Trigger asChild>
        <Button
          variant="outline"
          colorScheme="brand"
          borderRadius="xl"
          px={6}
          py={2}
          fontWeight="bold"
          bg="white"
          backdropFilter="blur(8px)"
          display="flex"
          alignItems="center"
          gap={2}
          borderColor="gray.300"
        >
          <chakra.span fontSize="sm" color={"gray.500"}>
            {selectedThemes.length === 0 ? "Select themes" : `${selectedThemes.length} selected`}
          </chakra.span>
          <Box as="span" fontSize="md" ml={2} display="flex" alignItems="center">
            <FaChevronDown />
          </Box>
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content borderRadius="xl" bg="white" boxShadow="lg" maxH="320px" overflowY="auto">
            {allThemes.map((theme) => {
              const Icon = themeIconMap[theme]
              const isSelected = selectedThemes.includes(theme)
              const disabled = !isSelected && selectedThemes.length >= 4
              return (
                <Menu.Item
                  key={theme}
                  value={theme}
                  onSelect={() => {
                    if (isSelected) {
                      onChange(selectedThemes.filter((t) => t !== theme))
                    } else if (!disabled) {
                      onChange([...selectedThemes, theme])
                    }
                  }}
                  bg={isSelected ? "brand.red" : disabled ? "gray.100" : "white"}
                  color={isSelected ? "white" : disabled ? "gray.400" : "brand.red"}
                  borderRadius="md"
                  fontWeight="bold"
                  _hover={disabled ? {} : { bg: "brand.red", color: "white" }}
                  display="flex"
                  alignItems="center"
                  gap={2}
                  opacity={disabled ? 0.6 : 1}
                  cursor={disabled ? "not-allowed" : "pointer"}
                  aria-disabled={disabled}
                >
                  <Box fontSize="lg" as="span">
                    <Icon />
                  </Box>
                  <Text>{theme}</Text>
                </Menu.Item>
              )
            })}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
