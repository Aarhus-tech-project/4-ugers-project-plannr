import { Box, Button, HStack, Image, List, Text, VStack } from "@chakra-ui/react"

interface ReviewStepProps {
  details: { title: string; description: string; themes: string[] }
  dateTime: { date: string; time: string }
  location: { lat: number; lng: number; address?: string }
  images: { images: string[] }
  onSubmit: () => void
  submitDisabled?: boolean
  submitting?: boolean
}

export default function ReviewStep({
  details,
  dateTime,
  location,
  images,
  onSubmit,
  submitDisabled,
  submitting,
}: ReviewStepProps) {
  return (
    <VStack alignItems="stretch" gap={0} width="100%">
      <Text fontWeight="bold" fontSize="xl" mb={2}>
        Review your event
      </Text>
      <Box borderBottom="1px" borderColor="gray.200" mb={4} />
      <List.Root gap={3}>
        <List.Item>
          <Text fontWeight="bold">Title:</Text> {details.title}
        </List.Item>
        <List.Item>
          <Text fontWeight="bold">Description:</Text> {details.description}
        </List.Item>
        <List.Item>
          <Text fontWeight="bold">Themes:</Text> {details.themes.join(", ")}
        </List.Item>
        <List.Item>
          <Text fontWeight="bold">Date:</Text> {dateTime.date}
        </List.Item>
        <List.Item>
          <Text fontWeight="bold">Time:</Text> {dateTime.time}
        </List.Item>
        <List.Item>
          <Text fontWeight="bold">Location:</Text> {location.address}
        </List.Item>
      </List.Root>
      {images.images.length > 0 && (
        <>
          <Box borderBottom="1px" borderColor="gray.200" my={4} />
          <Text fontWeight="bold" mb={2}>
            Images:
          </Text>
          <HStack gap={2} flexWrap="wrap">
            {images.images.map((img, idx) => (
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
      <Box borderBottom="1px" borderColor="gray.200" my={4} />
      <Button
        colorScheme="brand"
        fontWeight="bold"
        size="lg"
        mt={2}
        onClick={onSubmit}
        disabled={!!submitDisabled}
        opacity={submitDisabled ? 0.6 : 1}
        cursor={submitDisabled ? "not-allowed" : "pointer"}
        loading={!!submitting}
      >
        Submit Event
      </Button>
    </VStack>
  )
}
