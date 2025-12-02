import { Box, Input } from "@chakra-ui/react"
import { FormLabel } from "../ui/FormLabel"

interface AuthInputProps {
  id: string
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  autoComplete?: string
}

export function AuthInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
}: AuthInputProps) {
  return (
    <Box mb={4}>
      <FormLabel htmlFor={id} required={required}>
        {label}
      </FormLabel>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        borderRadius="lg"
        borderColor="gray.300"
        _focus={{
          borderColor: "brand.red",
          boxShadow: "0 0 0 1px var(--chakra-colors-brand-red)",
        }}
      />
    </Box>
  )
}
