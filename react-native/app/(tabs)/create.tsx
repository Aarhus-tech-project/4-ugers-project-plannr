import BottomButtonBar from "@/components/BottomButtonBar"
import Stepper from "@/components/Stepper"
import EventDateTimeStep, { EventDateTimeStepValidation } from "@/components/event-creation/EventDateTimeStep"
import EventDetailsStep, { EventDetailsStepValidation } from "@/components/event-creation/EventDetailsStep"
import EventImagesStep from "@/components/event-creation/EventImagesStep"
import EventLocationStep from "@/components/event-creation/EventLocationStep"
import EventReviewStep from "@/components/event-creation/EventReviewStep"
import EventSectionsStep from "@/components/event-creation/EventSectionsStep"
import { EventCreationProvider, useEventCreation } from "@/context/EventCreationContext"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import { useLazyEventThemes } from "@/hooks/useLazyEventThemes"
import { Event, EventLocation, EventPageSection, EventTheme, EventThemeName } from "@/interfaces/event"
import { getEventDateRangeError } from "@/utils/date-range-validator"
import { areAllSectionsFilled } from "@/utils/section-validator"
import { FontAwesome6 } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"
import React, { useCallback, useEffect, useState } from "react"
import { ScrollView, TouchableOpacity, View } from "react-native"
import { Text } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const stepMeta = [
  { key: "details", label: "Details", icon: "pen-to-square" },
  { key: "dateTime", label: "Date & Time", icon: "calendar-days" },
  { key: "location", label: "Location", icon: "location-dot" },
  { key: "images", label: "Images", icon: "image" },
  { key: "preferences", label: "Preferences", icon: "sliders" },
  { key: "review", label: "Review", icon: "circle-check" },
]

type StepContentProps = {
  step: number
  eventDetails: { title: string; themes: EventThemeName[]; format: "inperson" | "online" | "hybrid" }
  setEventDetails: (val: { title: string; themes: EventThemeName[]; format: "inperson" | "online" | "hybrid" }) => void
  allThemes: EventTheme[]
  setDetailsValidation: (v: EventDetailsStepValidation) => void
  customStart: Date | null
  setCustomStart: (val: Date | null) => void
  customEnd: Date | null
  setCustomEnd: (val: Date | null) => void
  dateTimeValidation: EventDateTimeStepValidation
  setDateTimeValidation: (v: EventDateTimeStepValidation) => void
  selectedLocation: EventLocation | null
  setSelectedLocation: (val: EventLocation | null) => void
  sections: EventPageSection[]
  setSections: (sections: EventPageSection[]) => void
}

function StepContent(props: StepContentProps) {
  const {
    step,
    eventDetails,
    setEventDetails,
    allThemes,
    setDetailsValidation,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    setDateTimeValidation,
    selectedLocation,
    setSelectedLocation,
    sections,
    setSections,
  } = props
  switch (step) {
    case 0:
      return (
        <EventDetailsStep
          value={eventDetails}
          onChange={setEventDetails}
          allThemes={allThemes}
          onValidate={setDetailsValidation}
        />
      )
    case 1:
      return (
        <EventDateTimeStep
          customStart={customStart}
          setCustomStart={setCustomStart}
          customEnd={customEnd}
          setCustomEnd={setCustomEnd}
          onValidate={setDateTimeValidation}
        />
      )
    case 2:
      return <EventLocationStep selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} />
    case 3:
      return <EventImagesStep sections={sections} setSections={setSections} />
    case 4:
      return <EventSectionsStep />
    case 5:
      return <EventReviewStep />
    default:
      return null
  }
}

function CreateEventHeader({ theme, isEditing }: { theme: ReturnType<typeof useCustomTheme>; isEditing?: boolean }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        paddingTop: 80,
        paddingBottom: 16,
        paddingLeft: 20,
        backgroundColor: theme.colors.secondary,
      }}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ padding: 4, borderRadius: 16, position: "absolute", left: 20, top: 82 }}
        activeOpacity={0.6}
      >
        <FontAwesome6 name="chevron-left" size={24} color={theme.colors.onBackground} />
      </TouchableOpacity>
      <Text
        style={{
          color: theme.colors.onBackground,
          fontWeight: "bold",
          textAlign: "center",
          fontSize: 32,
          left: 40,
        }}
      >
        {isEditing ? "Edit Event" : "Create Event"}
      </Text>
    </View>
  )
}

function CreateEventScreenInner() {
  const theme = useCustomTheme()
  const [currentStep, setCurrentStep] = useState(0)
  const params = useLocalSearchParams()
  // All event creation state comes from useEventCreation (provider handles defaults)
  const {
    eventDetails,
    setEventDetails,
    detailsValidation,
    setDetailsValidation,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    dateTimeValidation,
    setDateTimeValidation,
    selectedLocation,
    setSelectedLocation,
    sections,
    setSections,
  } = useEventCreation()

  // Prefill context if editing
  useEffect(() => {
    if (params.event) {
      try {
        const event = JSON.parse(params.event as string)
        setEventDetails({
          title: event.title || "",
          themes: event.themes || [],
          format: event.format || "inperson",
        })
        setCustomStart(event.dateRange?.startAt ? new Date(event.dateRange.startAt) : null)
        setCustomEnd(event.dateRange?.endAt ? new Date(event.dateRange.endAt) : null)
        setSelectedLocation(event.location || null)
        setSections(event.sections || [])
      } catch {}
    }
  }, [params.event])

  const { visibleThemes } = useLazyEventThemes(10, 600)

  const handleSubmit = () => {
    // Build full event object from all creation steps
    const event: Event = {
      // GUID CREATOR ID
      creatorId: "123e4567-e89b-12d3-a456-426614174000",
      title: eventDetails.title,
      themes: eventDetails.themes,
      format: eventDetails.format,
      dateRange: {
        startAt: customStart ?? new Date(),
        endAt: customEnd ?? undefined,
      },
      location: selectedLocation ?? undefined,
      sections: sections,
    }
    console.log("Event submitted:", JSON.stringify(event, null, 2))
    //router.back()
  }

  const handleCancel = () => {
    // Handle cancellation logic here
    router.back()
  }

  const handleNext = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, stepMeta.length - 1))
    console.log("Next step", currentStep, stepMeta.length)
    if (currentStep === stepMeta.length - 1) {
      handleSubmit()
    }
  }, [currentStep, handleSubmit])

  const handleBack = useCallback(() => {
    if (currentStep === 0) {
      handleCancel()
    } else {
      setCurrentStep((s) => Math.max(s - 1, 0))
    }
  }, [currentStep, handleCancel])

  const insets = useSafeAreaInsets()

  // Step validation logic
  const isDetailsStep = stepMeta[currentStep].key === "details"
  const isDetailsValid = !detailsValidation.title && !detailsValidation.themes
  const isDateTimeStep = stepMeta[currentStep].key === "dateTime"
  // Use shared validator for DRYness
  let isDateTimeValid = false
  if (customStart) {
    const dateRange = { startAt: customStart, endAt: customEnd ?? undefined }
    const dateRangeError = getEventDateRangeError(dateRange)
    isDateTimeValid = !dateRangeError
  }
  const isLocationStep = stepMeta[currentStep].key === "location"
  const isLocationValid =
    !!selectedLocation &&
    typeof selectedLocation.latitude === "number" &&
    typeof selectedLocation.longitude === "number"
  const isImagesStep = stepMeta[currentStep].key === "images"
  const imagesSection = sections.find((s) => s.type === "images")
  const isImagesValid = !!imagesSection && Array.isArray(imagesSection.srcs) && imagesSection.srcs.length > 0
  const isSectionsStep = stepMeta[currentStep].key === "preferences"
  const isSectionsValid = areAllSectionsFilled(sections)

  // Only allow next if current step is valid
  let isStepValid = true
  if (isDetailsStep) isStepValid = isDetailsValid
  else if (isDateTimeStep) isStepValid = isDateTimeValid
  else if (isLocationStep) isStepValid = isLocationValid
  else if (isImagesStep) isStepValid = isImagesValid
  else if (isSectionsStep) isStepValid = !!isSectionsValid

  const isEditing =
    !!params.event &&
    (() => {
      try {
        const event = JSON.parse(params.event as string)
        return !!event && !!event.title
      } catch {
        return false
      }
    })()

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <CreateEventHeader theme={theme} isEditing={isEditing} />
      <View style={{ backgroundColor: theme.colors.secondary }}>
        <Stepper steps={stepMeta} currentStep={currentStep} />
      </View>
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{ paddingBottom: 54 + insets.bottom, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <StepContent
          step={currentStep}
          eventDetails={eventDetails}
          setEventDetails={setEventDetails}
          allThemes={visibleThemes}
          setDetailsValidation={setDetailsValidation}
          customStart={customStart}
          setCustomStart={setCustomStart}
          customEnd={customEnd}
          setCustomEnd={setCustomEnd}
          dateTimeValidation={dateTimeValidation}
          setDateTimeValidation={setDateTimeValidation}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          sections={sections}
          setSections={setSections}
        />
      </ScrollView>
      <BottomButtonBar
        containerStyle={{ backgroundColor: theme.colors.gray[800], paddingVertical: 22 }}
        buttons={[
          {
            label: stepMeta[currentStep].key === "details" ? "Cancel" : "Back",
            onPress: handleBack,
            mode: "outlined",
            backgroundColor: theme.colors.gray[900],
            textColor: theme.colors.white,
          },
          {
            label: stepMeta[currentStep].key === "review" ? "Submit" : "Next",
            onPress: handleNext,
            mode: "contained",
            backgroundColor: !isStepValid ? theme.colors.brand.red + "66" : theme.colors.brand.red,
            textColor: theme.colors.white,
            disabled: !isStepValid,
            style: !isStepValid ? { opacity: 0.5 } : undefined,
          },
        ]}
      />
    </View>
  )
}

export default function CreateEventScreen() {
  return (
    <EventCreationProvider>
      <CreateEventScreenInner />
    </EventCreationProvider>
  )
}
