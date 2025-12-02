import { Avatar, Box, Flex, Text } from "@chakra-ui/react"

export function TestimonialCard({
  testimonial,
}: {
  testimonial: {
    name: string
    avatarUrl?: string
    quote: string
  }
}) {
  return (
    <Flex
      bg="rgba(244,244,249,0.7)"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.200"
      backdropFilter="blur(10px)"
      p={5}
      alignItems="center"
      gap={4}
      minH="120px"
    >
      <Avatar.Root size="md" colorPalette="gray" shape="full">
        <Avatar.Fallback name={testimonial.name} />
        {testimonial.avatarUrl && <Avatar.Image src={testimonial.avatarUrl} />}
      </Avatar.Root>
      <Box>
        <Text color="brand.red" fontWeight="bold" fontSize="md" mb={1}>
          {testimonial.name}
        </Text>
        <Text color="gray.900" fontSize="md">
          {testimonial.quote}
        </Text>
      </Box>
    </Flex>
  )
}
