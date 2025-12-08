import { Badge, HStack, Icon } from "@chakra-ui/react"
import { FiCheckCircle } from "react-icons/fi"

interface FieldBadgeProps {
  type: "required" | "high-impact" | "enhancement"
  isComplete: boolean
}

const FIELD_CONFIGS = {
  required: {
    label: "Required",
    bgComplete: { base: "green.50", _dark: "green.900/20" },
    bgIncomplete: { base: "gray.50", _dark: "gray.800" },
    colorComplete: { base: "green.700", _dark: "green.200" },
    colorIncomplete: { base: "gray.600", _dark: "gray.400" },
    borderColorComplete: { base: "green.200", _dark: "green.700" },
    borderColorIncomplete: { base: "gray.300", _dark: "gray.600" },
  },
  "high-impact": {
    label: "High Impact",
    bgComplete: { base: "blue.50", _dark: "blue.900/20" },
    bgIncomplete: { base: "gray.50", _dark: "gray.800" },
    colorComplete: { base: "blue.700", _dark: "blue.200" },
    colorIncomplete: { base: "gray.600", _dark: "gray.400" },
    borderColorComplete: { base: "blue.200", _dark: "blue.700" },
    borderColorIncomplete: { base: "gray.300", _dark: "gray.600" },
  },
  enhancement: {
    label: "Polish",
    bgComplete: { base: "teal.50", _dark: "teal.900/20" },
    bgIncomplete: { base: "gray.50", _dark: "gray.800" },
    colorComplete: { base: "teal.700", _dark: "teal.200" },
    colorIncomplete: { base: "gray.600", _dark: "gray.400" },
    borderColorComplete: { base: "teal.200", _dark: "teal.700" },
    borderColorIncomplete: { base: "gray.300", _dark: "gray.600" },
  },
}

export function FieldBadge({ type, isComplete }: FieldBadgeProps) {
  const config = FIELD_CONFIGS[type]

  return (
    <Badge
      px={2}
      py={1}
      bg={isComplete ? config.bgComplete : config.bgIncomplete}
      color={isComplete ? config.colorComplete : config.colorIncomplete}
      borderRadius="md"
      borderWidth="1px"
      borderColor={isComplete ? config.borderColorComplete : config.borderColorIncomplete}
      fontSize="xs"
      fontWeight="semibold"
      transition="all 0.2s"
    >
      <HStack gap={1}>
        {isComplete && <Icon as={FiCheckCircle} boxSize={3} />}
        <span>{config.label}</span>
      </HStack>
    </Badge>
  )
}
