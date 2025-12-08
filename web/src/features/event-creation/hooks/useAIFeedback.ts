import type { EventThemeName } from "@/shared/types"
import { useMemo } from "react"
import {
  FiCalendar,
  FiCheckCircle,
  FiEdit,
  FiEdit3,
  FiEye,
  FiImage,
  FiLayers,
  FiMapPin,
  FiNavigation,
  FiStar,
  FiTag,
  FiTarget,
  FiZap,
} from "react-icons/fi"

export interface AIFeedbackItem {
  type: "critical" | "important" | "suggestion" | "success"
  message: string
  icon: any
  section?: number
}

interface UseAIFeedbackProps {
  title: string
  description: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  address: string
  city: string
  venue: string
  selectedThemes: EventThemeName[]
  imagePreviews: string[]
  completionPercent: number
}

export function useAIFeedback({
  title,
  description,
  startDate,
  startTime,
  endDate,
  endTime,
  address,
  city,
  venue,
  selectedThemes,
  imagePreviews,
  completionPercent,
}: UseAIFeedbackProps) {
  const allFeedback = useMemo(() => {
    const feedback: AIFeedbackItem[] = []

    // Critical issues (must have for basic event)
    if (!title?.trim()) {
      feedback.push({
        type: "critical",
        message: "Add an engaging title that captures attention in 5 seconds or less",
        icon: FiTarget,
        section: 0,
      })
    }

    if (!startDate || !startTime || !endDate || !endTime) {
      const missingParts = []
      if (!startDate || !startTime) missingParts.push("start date & time")
      if (!endDate || !endTime) missingParts.push("end date & time")

      feedback.push({
        type: "critical",
        message: `Set the ${missingParts.join(" and ")} so attendees can plan accordingly`,
        icon: FiCalendar,
        section: 3,
      })
    }

    // Important improvements (significantly impact event quality)
    if (!description?.trim()) {
      feedback.push({
        type: "important",
        message: "Write a description that tells the story - what, why, and who should come?",
        icon: FiEdit,
        section: 2,
      })
    } else if (description.length < 100) {
      feedback.push({
        type: "important",
        message: `Add ${100 - description.length} more characters to your description for better engagement`,
        icon: FiEdit3,
        section: 2,
      })
    } else if (description.length < 200) {
      feedback.push({
        type: "suggestion",
        message: "Consider adding more details about what makes this event unique",
        icon: FiZap,
        section: 2,
      })
    }

    if (!address?.trim() || !city?.trim()) {
      feedback.push({
        type: "important",
        message: "Add the full address so attendees can easily find your event",
        icon: FiMapPin,
        section: 1,
      })
    }

    if (!venue?.trim() && (address?.trim() || city?.trim())) {
      feedback.push({
        type: "suggestion",
        message: "Add a venue name to make the location more memorable and recognizable",
        icon: FiMapPin,
        section: 1,
      })
    }

    if (selectedThemes.length === 0) {
      feedback.push({
        type: "important",
        message: "Add at least 2-3 themes to help people discover your event",
        icon: FiLayers,
        section: 2,
      })
    } else if (selectedThemes.length === 1) {
      feedback.push({
        type: "suggestion",
        message: "Add 1-2 more themes to reach a wider audience",
        icon: FiTag,
        section: 2,
      })
    }

    if (imagePreviews.length === 0) {
      feedback.push({
        type: "important",
        message: "Add eye-catching images - events with photos get 3x more interest!",
        icon: FiImage,
        section: 4,
      })
    } else if (imagePreviews.length === 1) {
      feedback.push({
        type: "suggestion",
        message: "Add 2-3 more images to showcase different aspects of your event",
        icon: FiImage,
        section: 4,
      })
    } else if (imagePreviews.length === 2) {
      feedback.push({
        type: "suggestion",
        message: "One more image would give attendees a complete visual preview",
        icon: FiImage,
        section: 4,
      })
    }

    // Success messages (positive reinforcement)
    if (title?.trim() && title.length >= 10 && title.length <= 60) {
      feedback.push({
        type: "success",
        message: "Perfect title length - clear and concise!",
        icon: FiCheckCircle,
      })
    }

    if (description.length >= 200) {
      feedback.push({
        type: "success",
        message: "Excellent description - this will attract attendees!",
        icon: FiStar,
      })
    }

    if (selectedThemes.length >= 3) {
      feedback.push({
        type: "success",
        message: "Great theme selection - your event is discoverable!",
        icon: FiTarget,
      })
    }

    if (imagePreviews.length >= 3) {
      feedback.push({
        type: "success",
        message: "Amazing visual content - very appealing!",
        icon: FiEye,
      })
    }

    if (venue?.trim() && address?.trim() && city?.trim()) {
      feedback.push({
        type: "success",
        message: "Complete location details - attendees can easily find you!",
        icon: FiMapPin,
      })
    }

    // All fields complete
    if (completionPercent === 100) {
      feedback.push({
        type: "success",
        message: "Outstanding! Your event is polished and ready to launch!",
        icon: FiNavigation,
      })
    }

    return feedback
  }, [
    title,
    startDate,
    startTime,
    endDate,
    endTime,
    description,
    address,
    city,
    venue,
    selectedThemes,
    imagePreviews,
    completionPercent,
  ])

  // Prioritize feedback: critical first, then important, suggestions, then success
  const prioritizedFeedback = useMemo(() => {
    const critical = allFeedback.filter((f) => f.type === "critical")
    const important = allFeedback.filter((f) => f.type === "important")
    const suggestions = allFeedback.filter((f) => f.type === "suggestion")
    const success = allFeedback.filter((f) => f.type === "success")

    // Show top 3 actionable items, plus all successes
    const actionable = [...critical, ...important, ...suggestions].slice(0, 3)
    return [...actionable, ...success]
  }, [allFeedback])

  return { allFeedback, prioritizedFeedback }
}
