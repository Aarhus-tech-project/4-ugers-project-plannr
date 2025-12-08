import type { EventThemeName } from "@/shared/types"
import { useMemo } from "react"

interface CompletionMetrics {
  requiredFields: Record<string, { complete: boolean; weight: number; label: string }>
  highImpactFields: Record<string, { complete: boolean; weight: number; label: string }>
  enhancementFields: Record<string, { complete: boolean; weight: number; label: string }>
  requiredFieldsCount: number
  requiredFieldsTotal: number
  requiredComplete: boolean
  highImpactCount: number
  highImpactTotal: number
  enhancementCount: number
  enhancementTotal: number
  completionPercent: number
  completedFieldsCount: number
  totalFieldsCount: number
  qualityScore: string
  qualityPoints: number
}

interface UseCompletionMetricsProps {
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
  sections: any[]
  ageRestriction: number | null
}

export function useCompletionMetrics({
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
  sections,
  ageRestriction,
}: UseCompletionMetricsProps): CompletionMetrics {
  return useMemo(() => {
    // Required fields (must have for publishing)
    const requiredFields = {
      title: { complete: !!title?.trim(), weight: 1, label: "Event Title" },
      dateTime: { complete: !!(startDate && startTime), weight: 1, label: "Start Date & Time" },
      endTime: { complete: !!(endDate && endTime), weight: 1, label: "End Date & Time" },
    }

    // Visual appeal fields (make your event attractive)
    const highImpactFields = {
      location: { complete: !!(address?.trim() && city?.trim()), weight: 1, label: "Address & City" },
      venue: { complete: !!venue?.trim(), weight: 1, label: "Venue Name" },
      themes: {
        complete: selectedThemes.length > 0,
        weight: 1,
        label: "Event Themes",
      },
      description: {
        complete: !!description?.trim(),
        weight: description.length > 100 ? 1.5 : description.length > 50 ? 1.2 : 1,
        label: "Description",
      },
    }

    // Polish fields (add visual flair)
    const enhancementFields = {
      images: {
        complete: imagePreviews.length > 0,
        weight: imagePreviews.length * 0.5,
        label: "Event Images",
      },
      sections: {
        complete: sections.length > 0,
        weight: sections.length * 0.3,
        label: "Custom Sections",
      },
      ageRestriction: {
        complete: ageRestriction !== null,
        weight: ageRestriction !== null ? 0.2 : 0,
        label: "Age Restriction",
      },
    }

    // Calculate counts
    const requiredFieldsCount = Object.values(requiredFields).filter((f) => f.complete).length
    const requiredFieldsTotal = Object.keys(requiredFields).length
    const requiredComplete = requiredFieldsCount === requiredFieldsTotal

    const highImpactCount = Object.values(highImpactFields).filter((f) => f.complete).length
    const highImpactTotal = Object.keys(highImpactFields).length

    const enhancementCount = Object.values(enhancementFields).filter((f) => f.complete).length
    const enhancementTotal = Object.keys(enhancementFields).length

    // Calculate weighted completion (required: 40%, high-impact: 40%, enhancement: 20%)
    const requiredWeight = (requiredFieldsCount / requiredFieldsTotal) * 40
    const highImpactWeight = (highImpactCount / highImpactTotal) * 40
    const enhancementWeight = (enhancementCount / enhancementTotal) * 20
    const completionPercent = Math.round(requiredWeight + highImpactWeight + enhancementWeight)

    // Calculate total fields for badge
    const completedFieldsCount = requiredFieldsCount + highImpactCount + enhancementCount
    const totalFieldsCount = requiredFieldsTotal + highImpactTotal + enhancementTotal

    // Quality score based on weighted factors
    const qualityFactors = {
      completion: completionPercent,
      descriptionQuality: description.length > 100 ? 20 : description.length > 50 ? 10 : 0,
      visualContent: imagePreviews.length >= 3 ? 20 : imagePreviews.length > 0 ? 10 : 0,
      themeRelevance: selectedThemes.length >= 2 ? 15 : selectedThemes.length > 0 ? 8 : 0,
      locationDetail: venue && address && city ? 15 : address && city ? 8 : 0,
      timing: endDate && endTime ? 10 : 0,
      customSections: sections.length >= 2 ? 10 : sections.length > 0 ? 5 : 0,
    }

    const qualityPoints = Object.values(qualityFactors).reduce((sum, points) => sum + points, 0)
    const qualityScore =
      qualityPoints >= 85
        ? "Exceptional"
        : qualityPoints >= 70
        ? "Excellent"
        : qualityPoints >= 55
        ? "Great"
        : qualityPoints >= 40
        ? "Good"
        : qualityPoints >= 25
        ? "Fair"
        : "Building"

    return {
      requiredFields,
      highImpactFields,
      enhancementFields,
      requiredFieldsCount,
      requiredFieldsTotal,
      requiredComplete,
      highImpactCount,
      highImpactTotal,
      enhancementCount,
      enhancementTotal,
      completionPercent,
      completedFieldsCount,
      totalFieldsCount,
      qualityScore,
      qualityPoints,
    }
  }, [
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
    sections,
    ageRestriction,
  ])
}
