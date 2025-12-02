import type { SearchBarProps } from "@/lib/types"
import { Icon, Input, InputGroup } from "@chakra-ui/react"
import { FiSearch } from "react-icons/fi"

export function SearchBar({ value, onChange, placeholder = "Search events..." }: SearchBarProps) {
  return (
    <InputGroup maxW="400px" startElement={<Icon as={FiSearch} color="brand.red" />}>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        bg="white"
        borderRadius="xl"
        fontSize="lg"
        border="1px solid"
        borderColor="gray.200"
        boxShadow="none"
        px={4}
        py={3}
        _focus={{ borderColor: "brand.red", boxShadow: "0 0 0 2px #e63946" }}
      />
    </InputGroup>
  )
}
