import { Box, Button, HStack, Image, Input, Text, VStack } from "@chakra-ui/react"
import { useState } from "react"

interface ImagesStepProps {
  value: { images: string[] }
  onChange: (val: { images: string[] }) => void
}

export default function ImagesStep({ value, onChange }: ImagesStepProps) {
  const [url, setUrl] = useState("")

  const handleAddUrl = () => {
    if (!url.trim()) return
    onChange({ images: [...value.images, url.trim()] })
    setUrl("")
  }

  return (
    <VStack alignItems="stretch" gap={0} width="100%">
      <Text fontWeight="bold" fontSize="lg" mb={2}>
        Add event image URLs
      </Text>
      <Box borderBottom="1px" borderColor="gray.200" mb={4} />
      <HStack gap={2} mb={2}>
        <Input
          placeholder="Paste image URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          borderRadius="md"
          bg="white"
          borderColor="gray.300"
          style={{ flex: 1 }}
        />
        <Button onClick={handleAddUrl} colorScheme="brand" fontWeight="bold">
          Add
        </Button>
      </HStack>
      {value.images.length > 0 && (
        <>
          <Box borderBottom="1px" borderColor="gray.200" my={4} />
          <HStack gap={2} flexWrap="wrap">
            {value.images.map((img, idx) => (
              <Image
                key={idx}
                src={img}
                alt={`Event image ${idx + 1}`}
                boxSize="80px"
                objectFit="cover"
                borderRadius="md"
                boxShadow="none"
                bg="gray.100"
              />
            ))}
          </HStack>
        </>
      )}
    </VStack>
  )
}
