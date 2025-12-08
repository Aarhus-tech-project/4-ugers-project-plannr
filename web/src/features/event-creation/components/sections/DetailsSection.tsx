import { Card } from "@/shared/components/ui/Card"
import { Box, Button, Flex, Grid, HStack, Icon, Input, Text, Textarea, VStack } from "@chakra-ui/react"
import {
  FiCalendar,
  FiCheckCircle,
  FiHelpCircle,
  FiLayers,
  FiLink,
  FiPlus,
  FiStar,
  FiTag,
  FiTarget,
  FiUsers,
  FiX,
} from "react-icons/fi"
import { FieldBadge } from "../FieldBadge"

interface EventSection {
  type: "faq" | "schedule" | "guests" | "tickets" | "resources" | "dresscode"
  items?: Array<{ question: string; answer: string } | { time: string; activity: string }>
  guests?: Array<{ name: string; bio: string }>
  tickets?: Array<{ type: string; price: number }>
  files?: Array<{ name: string; url: string }>
  content?: string
}

interface DetailsSectionProps {
  // Section visual config
  sectionData: {
    textColor: any
    iconColor: any
    bgLight: any
    borderColor: any
  }

  // Sections state
  sections: EventSection[]
  setSections: (sections: EventSection[]) => void

  // Age restriction state
  ageRestriction: number | null
  setAgeRestriction: (value: number | null) => void
}

export function DetailsSection({
  sectionData,
  sections,
  setSections,
  ageRestriction,
  setAgeRestriction,
}: DetailsSectionProps) {
  return (
    <VStack align="stretch" gap={8}>
      {/* Custom Sections */}
      <Box>
        <VStack align="stretch" gap={4}>
          {/* Header */}
          <Flex justify="space-between" align="center">
            <Box>
              <HStack gap={2}>
                <Icon as={FiLayers} boxSize={5} color={sectionData.iconColor} />
                <Text fontWeight="semibold" fontSize="sm" color={sectionData.textColor}>
                  Custom Sections
                </Text>
              </HStack>
              <Text fontSize="xs" color="fg.muted" mt={1}>
                Add detailed sections to make your event page informative and professional
              </Text>
            </Box>
            <FieldBadge type="enhancement" isComplete={sections.length > 0} />
          </Flex>

          {/* Section Type Selector - Modern Card Grid */}
          <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={3}>
            {[
              { type: "faq", label: "FAQ", icon: FiHelpCircle, desc: "Common questions" },
              { type: "schedule", label: "Schedule", icon: FiCalendar, desc: "Event timeline" },
              { type: "guests", label: "Guests", icon: FiUsers, desc: "Featured speakers" },
              { type: "tickets", label: "Tickets", icon: FiTag, desc: "Pricing tiers" },
              { type: "resources", label: "Resources", icon: FiLink, desc: "Helpful links" },
              { type: "dresscode", label: "Dress Code", icon: FiStar, desc: "Attire guide" },
            ].map((sectionType) => (
              <Card
                key={sectionType.type}
                p={4}
                bg={sectionData.bgLight}
                borderWidth="1px"
                borderColor={sectionData.borderColor}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{
                  borderColor: sectionData.iconColor,
                  bg: sectionData.bgLight,
                  transform: "translateY(-2px)",
                  shadow: "sm",
                }}
                onClick={() => {
                  const newSection: any = { type: sectionType.type }
                  if (sectionType.type === "faq") newSection.items = [{ question: "", answer: "" }]
                  if (sectionType.type === "schedule") newSection.items = [{ time: "", activity: "" }]
                  if (sectionType.type === "guests") newSection.guests = [{ name: "", bio: "" }]
                  if (sectionType.type === "tickets") newSection.tickets = [{ type: "", price: 0 }]
                  if (sectionType.type === "resources") newSection.files = [{ name: "", url: "" }]
                  if (sectionType.type === "dresscode") newSection.content = ""
                  setSections([...sections, newSection])
                }}
              >
                <VStack align="center" gap={2}>
                  <Icon as={sectionType.icon} boxSize={6} color={sectionData.iconColor} />
                  <VStack gap={0}>
                    <Text fontSize="sm" fontWeight="semibold" textAlign="center">
                      {sectionType.label}
                    </Text>
                    <Text fontSize="xs" color="fg.muted" textAlign="center">
                      {sectionType.desc}
                    </Text>
                  </VStack>
                </VStack>
              </Card>
            ))}
          </Grid>

          {/* Existing Sections */}
          {sections.length > 0 && (
            <VStack align="stretch" gap={3} mt={2}>
              {sections.map((section, sectionIndex) => (
                <Card
                  key={sectionIndex}
                  p={5}
                  bg={sectionData.bgLight}
                  borderColor={sectionData.borderColor}
                  borderWidth="1px"
                >
                  <HStack justify="space-between" mb={4}>
                    <HStack gap={3}>
                      <Box p={2} bg={sectionData.bgLight} borderRadius="md">
                        <Icon
                          as={
                            section.type === "faq"
                              ? FiHelpCircle
                              : section.type === "schedule"
                              ? FiCalendar
                              : section.type === "guests"
                              ? FiUsers
                              : section.type === "tickets"
                              ? FiTag
                              : section.type === "resources"
                              ? FiLink
                              : FiStar
                          }
                          boxSize={5}
                          color={sectionData.iconColor}
                        />
                      </Box>
                      <Text fontSize="md" fontWeight="bold" color="fg.default">
                        {section.type === "faq"
                          ? "FAQ"
                          : section.type === "schedule"
                          ? "Schedule"
                          : section.type === "guests"
                          ? "Guests"
                          : section.type === "tickets"
                          ? "Tickets"
                          : section.type === "resources"
                          ? "Resources"
                          : "Dress Code"}
                      </Text>
                    </HStack>
                    <Button
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => setSections(sections.filter((_, i) => i !== sectionIndex))}
                    >
                      <Icon as={FiX} />
                    </Button>
                  </HStack>

                  {/* FAQ Items */}
                  {section.type === "faq" && (
                    <VStack align="stretch" gap={3}>
                      {section.items?.map((item: any, idx: number) => (
                        <Box key={idx}>
                          <HStack justify="space-between" mb={1}>
                            <Text fontSize="xs" fontWeight="semibold" color="fg.muted">
                              Question {idx + 1}
                            </Text>
                            {(section.items?.length ?? 0) > 1 && (
                              <Button
                                size="xs"
                                variant="ghost"
                                onClick={() => {
                                  const updated = [...sections]
                                  updated[sectionIndex].items = section.items?.filter((_: any, i: number) => i !== idx)
                                  setSections(updated)
                                }}
                              >
                                <Icon as={FiX} boxSize={3} />
                              </Button>
                            )}
                          </HStack>
                          <Box mb={2}>
                            <Input
                              placeholder="e.g., Is parking available?"
                              value={item.question}
                              onChange={(e) => {
                                const updated = [...sections]
                                ;(updated[sectionIndex].items as any)[idx].question = e.target.value
                                setSections(updated)
                              }}
                            />
                          </Box>
                          <Textarea
                            placeholder="Answer..."
                            value={item.answer}
                            onChange={(e) => {
                              const updated = [...sections]
                              ;(updated[sectionIndex].items as any)[idx].answer = e.target.value
                              setSections(updated)
                            }}
                            size="sm"
                            minH="60px"
                          />
                        </Box>
                      ))}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const updated = [...sections]
                          if (!updated[sectionIndex].items) updated[sectionIndex].items = []
                          ;(updated[sectionIndex].items as any).push({ question: "", answer: "" })
                          setSections(updated)
                        }}
                      >
                        <Icon as={FiPlus} mr={2} />
                        Add Question
                      </Button>
                    </VStack>
                  )}

                  {/* Schedule Items */}
                  {section.type === "schedule" && (
                    <VStack align="stretch" gap={3}>
                      {section.items?.map((item: any, idx: number) => (
                        <HStack key={idx} gap={2}>
                          <Box maxW="120px">
                            <Input
                              placeholder="Time"
                              value={item.time}
                              onChange={(e) => {
                                const updated = [...sections]
                                ;(updated[sectionIndex].items as any)[idx].time = e.target.value
                                setSections(updated)
                              }}
                            />
                          </Box>
                          <Box flex={1}>
                            <Input
                              placeholder="Activity"
                              value={item.activity}
                              onChange={(e) => {
                                const updated = [...sections]
                                ;(updated[sectionIndex].items as any)[idx].activity = e.target.value
                                setSections(updated)
                              }}
                            />
                          </Box>
                          {(section.items?.length ?? 0) > 1 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const updated = [...sections]
                                updated[sectionIndex].items = section.items?.filter((_: any, i: number) => i !== idx)
                                setSections(updated)
                              }}
                            >
                              <Icon as={FiX} />
                            </Button>
                          )}
                        </HStack>
                      ))}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const updated = [...sections]
                          if (!updated[sectionIndex].items) updated[sectionIndex].items = []
                          ;(updated[sectionIndex].items as any).push({ time: "", activity: "" })
                          setSections(updated)
                        }}
                      >
                        <Icon as={FiPlus} mr={2} />
                        Add Schedule Item
                      </Button>
                    </VStack>
                  )}

                  {/* Guest Speakers */}
                  {section.type === "guests" && (
                    <VStack align="stretch" gap={3}>
                      {section.guests?.map((guest: any, idx: number) => (
                        <Box key={idx}>
                          <HStack justify="space-between" mb={1}>
                            <Text fontSize="xs" fontWeight="semibold" color="fg.muted">
                              Guest {idx + 1}
                            </Text>
                            {(section.guests?.length ?? 0) > 1 && (
                              <Button
                                size="xs"
                                variant="ghost"
                                onClick={() => {
                                  const updated = [...sections]
                                  updated[sectionIndex].guests = section.guests?.filter(
                                    (_: any, i: number) => i !== idx
                                  )
                                  setSections(updated)
                                }}
                              >
                                <Icon as={FiX} boxSize={3} />
                              </Button>
                            )}
                          </HStack>
                          <Box mb={2}>
                            <Input
                              placeholder="Name"
                              value={guest.name}
                              onChange={(e) => {
                                const updated = [...sections]
                                ;(updated[sectionIndex].guests as any)[idx].name = e.target.value
                                setSections(updated)
                              }}
                            />
                          </Box>
                          <Textarea
                            placeholder="Bio (optional)"
                            value={guest.bio || ""}
                            onChange={(e) => {
                              const updated = [...sections]
                              ;(updated[sectionIndex].guests as any)[idx].bio = e.target.value
                              setSections(updated)
                            }}
                            size="sm"
                            minH="50px"
                          />
                        </Box>
                      ))}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const updated = [...sections]
                          if (!updated[sectionIndex].guests) updated[sectionIndex].guests = []
                          ;(updated[sectionIndex].guests as any).push({ name: "", bio: "" })
                          setSections(updated)
                        }}
                      >
                        <Icon as={FiPlus} mr={2} />
                        Add Guest
                      </Button>
                    </VStack>
                  )}

                  {/* Tickets */}
                  {section.type === "tickets" && (
                    <VStack align="stretch" gap={3}>
                      {section.tickets?.map((ticket: any, idx: number) => (
                        <HStack key={idx} gap={2}>
                          <Box flex={1}>
                            <Input
                              placeholder="Ticket Type"
                              value={ticket.type}
                              onChange={(e) => {
                                const updated = [...sections]
                                ;(updated[sectionIndex].tickets as any)[idx].type = e.target.value
                                setSections(updated)
                              }}
                            />
                          </Box>
                          <Box maxW="100px">
                            <Input
                              placeholder="Price"
                              type="number"
                              value={ticket.price}
                              onChange={(e) => {
                                const updated = [...sections]
                                ;(updated[sectionIndex].tickets as any)[idx].price = parseFloat(e.target.value) || 0
                                setSections(updated)
                              }}
                            />
                          </Box>
                          {(section.tickets?.length ?? 0) > 1 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const updated = [...sections]
                                updated[sectionIndex].tickets = section.tickets?.filter(
                                  (_: any, i: number) => i !== idx
                                )
                                setSections(updated)
                              }}
                            >
                              <Icon as={FiX} />
                            </Button>
                          )}
                        </HStack>
                      ))}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const updated = [...sections]
                          if (!updated[sectionIndex].tickets) updated[sectionIndex].tickets = []
                          ;(updated[sectionIndex].tickets as any).push({ type: "", price: 0 })
                          setSections(updated)
                        }}
                      >
                        <Icon as={FiPlus} mr={2} />
                        Add Ticket Type
                      </Button>
                    </VStack>
                  )}

                  {/* Resources */}
                  {section.type === "resources" && (
                    <VStack align="stretch" gap={3}>
                      {section.files?.map((file: any, idx: number) => (
                        <HStack key={idx} gap={2}>
                          <Box flex={1}>
                            <Input
                              placeholder="File Name"
                              value={file.name}
                              onChange={(e) => {
                                const updated = [...sections]
                                ;(updated[sectionIndex].files as any)[idx].name = e.target.value
                                setSections(updated)
                              }}
                            />
                          </Box>
                          <Box flex={1}>
                            <Input
                              placeholder="URL"
                              value={file.url}
                              onChange={(e) => {
                                const updated = [...sections]
                                ;(updated[sectionIndex].files as any)[idx].url = e.target.value
                                setSections(updated)
                              }}
                            />
                          </Box>
                          {(section.files?.length ?? 0) > 1 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const updated = [...sections]
                                updated[sectionIndex].files = section.files?.filter((_: any, i: number) => i !== idx)
                                setSections(updated)
                              }}
                            >
                              <Icon as={FiX} />
                            </Button>
                          )}
                        </HStack>
                      ))}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const updated = [...sections]
                          if (!updated[sectionIndex].files) updated[sectionIndex].files = []
                          ;(updated[sectionIndex].files as any).push({ name: "", url: "" })
                          setSections(updated)
                        }}
                      >
                        <Icon as={FiPlus} mr={2} />
                        Add Resource
                      </Button>
                    </VStack>
                  )}

                  {/* Dress Code */}
                  {section.type === "dresscode" && (
                    <Textarea
                      placeholder="Describe the dress code (e.g., Business casual, Black tie, Costume party...)"
                      value={section.content}
                      onChange={(e) => {
                        const updated = [...sections]
                        updated[sectionIndex].content = e.target.value
                        setSections(updated)
                      }}
                      minH="100px"
                    />
                  )}
                </Card>
              ))}
            </VStack>
          )}

          {sections.length === 0 && (
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
                <Icon as={FiLayers} boxSize={8} color={sectionData.iconColor} />
                <Text fontSize="sm" fontWeight="semibold" color={sectionData.textColor}>
                  No custom sections yet
                </Text>
                <Text fontSize="xs" color={sectionData.iconColor}>
                  Click any section type above to add professional content to your event page
                </Text>
              </VStack>
            </Box>
          )}
        </VStack>
      </Box>

      {/* Age Restriction */}
      <Box>
        <Flex justify="space-between" align="start" mb={2}>
          <VStack align="start" gap={1}>
            <HStack gap={2}>
              <Icon as={FiTarget} boxSize={5} color={sectionData.iconColor} />
              <Text fontWeight="semibold" fontSize="sm" color={sectionData.textColor}>
                Age Restriction (Optional)
              </Text>
            </HStack>
            <Text fontSize="xs" color="fg.muted">
              Set a minimum age if your event has restrictions
            </Text>
          </VStack>
          <FieldBadge type="enhancement" isComplete={ageRestriction !== null} />
        </Flex>
        <HStack gap={3}>
          <Box maxW="150px">
            <Input
              type="number"
              placeholder="e.g., 18"
              value={ageRestriction ?? ""}
              onChange={(e) => {
                const value = e.target.value
                setAgeRestriction(value ? parseInt(value, 10) : null)
              }}
              min={0}
              max={100}
            />
          </Box>
          <Text fontSize="sm" color="fg.muted">
            years minimum
          </Text>
          {ageRestriction !== null && (
            <Button size="sm" variant="ghost" onClick={() => setAgeRestriction(null)}>
              <Icon as={FiX} />
            </Button>
          )}
        </HStack>
        {ageRestriction !== null && (
          <Box
            mt={3}
            p={3}
            bg={sectionData.bgLight}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={sectionData.borderColor}
          >
            <HStack gap={2}>
              <Icon as={FiCheckCircle} boxSize={4} color={sectionData.iconColor} />
              <Text fontSize="xs" color={sectionData.textColor} fontWeight="medium">
                Only attendees {ageRestriction}+ can register
              </Text>
            </HStack>
          </Box>
        )}
      </Box>
    </VStack>
  )
}
