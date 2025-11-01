import BottomButtonBar from "@/components/BottomButtonBar"
import Stepper from "@/components/Stepper"
import EventDateTimeStep, { EventDateTimeStepValidation } from "@/components/event-creation/EventDateTimeStep"
import EventDetailsStep, { EventDetailsStepValidation } from "@/components/event-creation/EventDetailsStep"
import { EventCreationProvider, useEventCreation } from "@/context/EventCreationContext"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import { useLazyEventThemes } from "@/hooks/useLazyEventThemes"
import { EventTheme, EventThemeName } from "@/interfaces/event"
import { FontAwesome6 } from "@expo/vector-icons"
import { router } from "expo-router"
import React, { useCallback, useState } from "react"
import { ScrollView, TouchableOpacity, View } from "react-native"
import { Text } from "react-native-paper"

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
  eventDetails: { title: string; themes: EventThemeName[] }
  setEventDetails: (val: { title: string; themes: EventThemeName[] }) => void
  allThemes: EventTheme[]
  setDetailsValidation: (v: EventDetailsStepValidation) => void
  customStart: Date | null
  setCustomStart: (val: Date | null) => void
  customEnd: Date | null
  setCustomEnd: (val: Date | null) => void
  dateTimeValidation: EventDateTimeStepValidation
  setDateTimeValidation: (v: EventDateTimeStepValidation) => void
}

function StepContent({
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
}: StepContentProps) {
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
    default:
      return null
  }
}

function CreateEventHeader({ theme }: { theme: ReturnType<typeof useCustomTheme> }) {
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
        Create Event
      </Text>
    </View>
  )
}

function CreateEventScreenInner() {
  const theme = useCustomTheme()
  const [currentStep, setCurrentStep] = useState(0)
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
  } = useEventCreation()

  console.log("🚀 -------------------------------------------------------------------🚀")
  console.log("🚀 ~ create.tsx:127 ~ CreateEventScreenInner ~ customEnd:", customEnd)
  console.log("🚀 -------------------------------------------------------------------🚀")

  console.log("🚀 -----------------------------------------------------------------------🚀")
  console.log("🚀 ~ create.tsx:127 ~ CreateEventScreenInner ~ customStart:", customStart)
  console.log("🚀 -----------------------------------------------------------------------🚀")

  const { visibleThemes } = useLazyEventThemes(10, 600)

  const handleSubmit = () => {
    // Handle event submission logic here
    console.log("Event submitted:", eventDetails)
    router.back()
  }

  const handleCancel = () => {
    // Handle cancellation logic here
    router.back()
  }

  const handleNext = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, stepMeta.length - 1))
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

  const isDetailsStep = stepMeta[currentStep].key === "details"
  const isDetailsValid = !detailsValidation.title && !detailsValidation.themes
  const isDateTimeStep = stepMeta[currentStep].key === "dateTime"
  const isDateTimeValid = !dateTimeValidation.start && !dateTimeValidation.end

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <CreateEventHeader theme={theme} />
      <View style={{ backgroundColor: theme.colors.secondary }}>
        <Stepper steps={stepMeta} currentStep={currentStep} />
      </View>
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 16, paddingTop: 16 }}
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
        />
      </ScrollView>
      <BottomButtonBar
        containerStyle={{ backgroundColor: theme.colors.gray[800] }}
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
            backgroundColor:
              (isDetailsStep && !isDetailsValid) || (isDateTimeStep && !isDateTimeValid)
                ? theme.colors.brand.red + "66"
                : theme.colors.brand.red,
            textColor: theme.colors.white,
            disabled: (isDetailsStep && !isDetailsValid) || (isDateTimeStep && !isDateTimeValid),
            style:
              (isDetailsStep && !isDetailsValid) || (isDateTimeStep && !isDateTimeValid) ? { opacity: 0.5 } : undefined,
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
