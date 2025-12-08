import { Box, Button, Flex, Grid, HStack, Icon, Image, Input, Text, VStack } from "@chakra-ui/react"
import { FiImage, FiX } from "react-icons/fi"
import { FieldBadge } from "../FieldBadge"

interface ShowcaseSectionProps {
  // Section visual config
  sectionData: {
    textColor: any
    iconColor: any
    bgLight: any
    borderColor: any
  }

  // Image state
  imageUrl: string
  setImageUrl: (value: string) => void
  imagePreviews: string[]
  addImageUrl: () => void
  removeImage: (index: number) => void
}

export function ShowcaseSection({
  sectionData,
  imageUrl,
  setImageUrl,
  imagePreviews,
  addImageUrl,
  removeImage,
}: ShowcaseSectionProps) {
  return (
    <VStack align="stretch" gap={6}>
      <Box>
        <Flex justify="space-between" align="center" mb={2}>
          <HStack gap={2}>
            <Icon as={FiImage} boxSize={5} color={sectionData.iconColor} />
            <Text fontWeight="semibold" fontSize="sm" color={sectionData.textColor}>
              Event Images
            </Text>
          </HStack>
          <FieldBadge type="enhancement" isComplete={imagePreviews.length > 0} />
        </Flex>
        <Text fontSize="xs" color="fg.muted" mb={3}>
          Add up to 5 image URLs. The first image will be your cover photo. Images increase engagement by 200%!
        </Text>
        <Flex gap={2} mb={4}>
          <Input
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addImageUrl()
              }
            }}
          />
          <Button variant="outline" onClick={addImageUrl} disabled={!imageUrl.trim() || imagePreviews.length >= 5}>
            Add
          </Button>
        </Flex>
        {imagePreviews.length > 0 && (
          <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={3}>
            {imagePreviews.map((img, idx) => (
              <Box key={idx} position="relative" borderRadius="lg" overflow="hidden" aspectRatio={16 / 9}>
                <Image src={img} alt={`Preview ${idx + 1}`} objectFit="cover" w="full" h="full" />
                <Box
                  position="absolute"
                  top={2}
                  right={2}
                  as="button"
                  onClick={() => removeImage(idx)}
                  bg="bg.canvas/80"
                  backdropFilter="blur(4px)"
                  p={1}
                  borderRadius="md"
                  _hover={{ bg: "bg.canvas" }}
                >
                  <Icon as={FiX} boxSize={4} color="fg.default" />
                </Box>
                {idx === 0 && (
                  <Box
                    position="absolute"
                    bottom={2}
                    left={2}
                    bg="brand.primary"
                    color="fg.inverted"
                    px={2}
                    py={1}
                    borderRadius="md"
                    fontSize="xs"
                    fontWeight="semibold"
                  >
                    Cover Photo
                  </Box>
                )}
              </Box>
            ))}
          </Grid>
        )}
      </Box>

      {imagePreviews.length === 0 && (
        <Box
          p={6}
          bg={sectionData.bgLight}
          borderRadius="lg"
          borderWidth="2px"
          borderStyle="dashed"
          borderColor={sectionData.borderColor}
          textAlign="center"
        >
          <VStack gap={2}>
            <Icon as={FiImage} boxSize={8} color={sectionData.iconColor} />
            <Text fontSize="sm" fontWeight="semibold" color={sectionData.textColor}>
              No images yet
            </Text>
            <Text fontSize="xs" color={sectionData.iconColor}>
              Events with images get 200% more attendees!
            </Text>
          </VStack>
        </Box>
      )}
    </VStack>
  )
}
