"use client"

import type { EventThemeName } from "@/lib/types"
import { Box, Icon, Steps, Text, useBreakpointValue } from "@chakra-ui/react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { HiCheckCircle } from "react-icons/hi"
import DateTimeStep from "./DateTimeStep"
import DetailsStep from "./DetailsStep"
import ImagesStep from "./ImagesStep"
import LocationStep from "./LocationStep"
import ReviewStep from "./ReviewStep"

const steps = [
  { title: "Details", description: "Event title, description, theme" },
  { title: "Date/Time", description: "Pick date and time" },
  { title: "Location", description: "Pick location on map" },
  { title: "Images", description: "Upload event images" },
  { title: "Review", description: "Review and submit" },
]

export default function CreateEventPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [showOverlay, setShowOverlay] = useState(false)

  // Submission handler for ReviewStep
  async function handleSubmit() {
    if (!stepValid.slice(0, 4).every(Boolean)) {
      setError("Please complete all steps before submitting.")
      return
    }
    setError(null)

    const jwt = session?.jwt
    if (!jwt) {
      setError("You must be logged in to create an event.")
      return
    }

    try {
      // Build startAt and endAt from date/time step
      const startAt = new Date(`${dateTime.date}T${dateTime.time}`).toISOString()
      const locationPayload = {
        address: location.address || "",
        city: location.city || "",
        country: location.country || "",
        latitude: location.lat,
        longitude: location.lng,
      }
      // Build images array
      const imagesPayload = images.images.map((src: string) => ({ src, likes: 0 }))
      // Build event payload
      const payload = {
        title: details.title,
        description: details.description,
        format: "inperson", // or from UI if you support it
        startAt,
        location: locationPayload,
        images: imagesPayload,
        themes: details.themes,
      }

      const res = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to create event.")
        return
      }

      setReviewSubmitted(true)
      setError(null)
      setShowOverlay(true)
      setTimeout(() => {
        setShowOverlay(false)
        router.push("/events")
      }, 4000)
    } catch {
      setError("Network error. Please try again.")
    }
  }
  // State for each step
  const [details, setDetails] = useState<{ title: string; description: string; themes: EventThemeName[] }>({
    title: "",
    description: "",
    themes: [],
  })
  const [dateTime, setDateTime] = useState<{ date: string; time: string }>({ date: "", time: "" })
  const [location, setLocation] = useState<{
    lat: number
    lng: number
    address?: string
    city?: string
    country?: string
  }>({
    lat: 56.162939,
    lng: 10.203921,
    address: "",
    city: "",
    country: "",
  })
  const [images, setImages] = useState<{ images: string[] }>({ images: [] })
  const sectionRefs = steps.map(() => useRef<HTMLDivElement>(null))
  const [activeStep, setActiveStep] = useState(0)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Validation logic for each step
  const stepValid = [
    details.title.trim().length > 0 && details.description.trim().length > 0 && details.themes.length > 0,
    dateTime.date.trim().length > 0 && dateTime.time.trim().length > 0,
    typeof location.lat === "number" && typeof location.lng === "number" && !!location.address,
    images.images.length > 0,
    reviewSubmitted,
  ]

  // Prevent navigation to next step if current step is not valid
  const goToStep = (idx: number) => {
    if (idx > activeStep && !stepValid[activeStep]) {
      setError("Please complete all required fields before continuing.")
      return
    }
    sectionRefs[idx].current?.scrollIntoView({ behavior: "smooth", block: "center" })
    setActiveStep(idx)
    setError(null)
  }

  // Next step handler
  const handleNext = () => {
    if (activeStep < steps.length - 1 && stepValid[activeStep]) {
      sectionRefs[activeStep + 1].current?.scrollIntoView({ behavior: "smooth", block: "center" })
      setActiveStep(activeStep + 1)
      setError(null)
    } else {
      setError("Please complete all required fields before continuing.")
    }
  }

  // Responsive card width
  const cardMaxW = useBreakpointValue({ base: "100vw", md: "600px" })

  // Scroll handler: only update active step when a step is centered
  const handleScroll = () => {
    const container = document.querySelector("[data-steps-content]") as HTMLElement | null
    if (!container) return
    const containerRect = container.getBoundingClientRect()
    const center = containerRect.top + containerRect.height / 2
    const offsets = sectionRefs.map((ref) => {
      if (!ref.current) return 0
      const rect = ref.current.getBoundingClientRect()
      return rect.top + rect.height / 2
    })
    const closest = offsets.reduce((acc, val, idx) => {
      return Math.abs(val - center) < Math.abs(offsets[acc] - center) ? idx : acc
    }, 0)
    setActiveStep(closest)
  }

  // Wheel event handler: move to next/previous step, but block if not valid
  const handleWheel = (e: WheelEvent) => {
    if (e.deltaY > 0 && activeStep < steps.length - 1) {
      if (!stepValid[activeStep]) {
        setError("Please complete all required fields before continuing.")
        e.preventDefault()
        return
      }
      sectionRefs[activeStep + 1].current?.scrollIntoView({ behavior: "smooth", block: "center" })
      setActiveStep(activeStep + 1)
      setError(null)
      e.preventDefault()
    } else if (e.deltaY < 0 && activeStep > 0) {
      sectionRefs[activeStep - 1].current?.scrollIntoView({ behavior: "smooth", block: "center" })
      setActiveStep(activeStep - 1)
      setError(null)
      e.preventDefault()
    }
  }

  // Sidebar click: scroll to step (block if not valid)
  const scrollToStep = (idx: number) => goToStep(idx)

  useEffect(() => {
    const stepsContent = document.querySelector("[data-steps-content]") as HTMLElement | null
    if (!stepsContent) return
    stepsContent.addEventListener("scroll", handleScroll, { passive: true })
    stepsContent.addEventListener("wheel", handleWheel, { passive: false })
    return () => {
      stepsContent.removeEventListener("scroll", handleScroll)
      stepsContent.removeEventListener("wheel", handleWheel)
    }
  }, [activeStep])

  // Step content style (merged look)
  const stepContentStyle = {
    w: "100%",
    maxW: cardMaxW,
    bg: "transparent",
    p: { base: 0, md: 0 },
    display: "flex",
    flexDirection: "column",
    gap: 4,
    alignItems: "stretch",
  }

  return (
    <Box
      id="event-create-container"
      maxW="900px"
      maxH="90vh"
      w="100%"
      h="90vh"
      mx="auto"
      overflow="hidden"
      display="flex"
    >
      {/* Modern Vertical Stepper Sidebar */}
      <Box h="100%" minW="220px" py={10} px={2} zIndex={2} display="flex" flexDirection="column" alignItems="center">
        <Steps.Root
          orientation="vertical"
          height="100%"
          step={activeStep + 1}
          count={steps.length}
          size="md"
          colorPalette="red"
        >
          <Steps.List>
            {steps.map((step, idx) => (
              <Steps.Item key={step.title} index={idx} title={step.title}>
                <Box cursor="pointer" onClick={() => scrollToStep(idx)}>
                  <Steps.Indicator />
                  <Steps.Title>{step.title}</Steps.Title>
                  <Steps.Separator />
                </Box>
              </Steps.Item>
            ))}
          </Steps.List>
        </Steps.Root>
      </Box>

      {/* Steps Content */}
      <Box
        flex={1}
        px={0}
        py={0}
        overflowY="auto"
        h="100%"
        maxH="90vh"
        minH="90vh"
        position="relative"
        data-steps-content
      >
        {steps.map((step, idx) => (
          <Box
            key={step.title}
            ref={sectionRefs[idx]}
            position={activeStep === idx ? "relative" : "absolute"}
            top={0}
            left={0}
            w="100%"
            h="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            opacity={activeStep === idx ? 1 : 0}
            pointerEvents={activeStep === idx ? "auto" : "none"}
            transition="opacity 0.5s"
            zIndex={activeStep === idx ? 1 : 0}
          >
            <Box {...stepContentStyle}>
              {/* Consistent header for all steps */}
              <Box mb={2} borderBottom="1px solid" borderColor="gray.200" pb={4}>
                <Text fontWeight="bold" fontSize="2xl" color="brand.red.600" letterSpacing="wide">
                  {step.title}
                </Text>
                <Text fontSize="md" color="gray.500">
                  {step.description}
                </Text>
              </Box>
              {/* Step content */}
              <Box flex={1} pt={2}>
                {idx === 0 && <DetailsStep value={details} onChange={setDetails} />}
                {idx === 1 && <DateTimeStep value={dateTime} onChange={setDateTime} />}
                {idx === 2 && <LocationStep value={location} onChange={setLocation} />}
                {idx === 3 && <ImagesStep value={images} onChange={setImages} />}
                {idx === 4 && (
                  <ReviewStep
                    details={details}
                    dateTime={dateTime}
                    location={location}
                    images={images}
                    onSubmit={handleSubmit}
                    submitDisabled={!stepValid.slice(0, 4).every(Boolean)}
                  />
                )}
              </Box>
              {/* Step navigation: Next button except last step */}
              {idx < steps.length - 1 && (
                <Box mt={4} display="flex" justifyContent="flex-end">
                  <button
                    type="button"
                    style={{
                      padding: "0.75rem 2rem",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      borderRadius: "0.75rem",
                      background: stepValid[idx] ? "#e53e3e" : "#f7fafc",
                      color: stepValid[idx] ? "#fff" : "#a0aec0",
                      border: "none",
                      cursor: stepValid[idx] ? "pointer" : "not-allowed",
                      transition: "background 0.2s, color 0.2s",
                    }}
                    disabled={!stepValid[idx]}
                    onClick={handleNext}
                  >
                    Next
                  </button>
                </Box>
              )}
              {/* Consistent footer for all steps */}
              {error && (
                <Box color="red.500" fontWeight="bold" mt={4}>
                  {error}
                </Box>
              )}
            </Box>
          </Box>
        ))}
        {/* Confirmation overlay after submit */}
        {showOverlay && (
          <Box
            position="fixed"
            top={0}
            left={0}
            w="100vw"
            h="100vh"
            bg="rgba(255,255,255,0.85)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex={9999}
            style={{ backdropFilter: "blur(8px)" }}
          >
            <Box {...stepContentStyle} alignItems="center" justifyContent="center" textAlign="center">
              <Icon as={HiCheckCircle} boxSize={16} color="green.400" mb={4} />
              <Text fontWeight="bold" fontSize="2xl" color="brand.red.600" mb={2}>
                Event created successfully!
              </Text>
              <Text fontSize="lg" color="gray.600">
                Redirecting to events page...
              </Text>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}
