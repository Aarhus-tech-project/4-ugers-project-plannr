import { HStack, Tag } from "@chakra-ui/react"

export function CategoryTags({ categories }: { categories: string[] }) {
  return (
    <HStack justify="center" gap={2} flexWrap="wrap">
      {categories.map((cat) => (
        <Tag.Root key={cat} colorPalette="gray" size="md" variant="subtle" rounded="full" cursor="pointer">
          <Tag.Label>{cat}</Tag.Label>
        </Tag.Root>
      ))}
    </HStack>
  )
}
