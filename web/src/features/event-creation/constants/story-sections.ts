import { FiCalendar, FiImage, FiLayers, FiMapPin, FiStar, FiZap } from "react-icons/fi"

export interface StorySection {
  id: string
  title: string
  subtitle: string
  icon: any
  gradient: { base: string; _dark: string }
  primaryColor: string
  accentColor: string
  bgLight: { base: string; _dark: string }
  borderColor: { base: string; _dark: string }
  textColor: { base: string; _dark: string }
  iconColor: { base: string; _dark: string }
}

export const STORY_SECTIONS: StorySection[] = [
  {
    id: "spark",
    title: "The Spark",
    subtitle: "Every great event starts with an idea",
    icon: FiZap,
    gradient: {
      base: "linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)",
      _dark: "linear-gradient(135deg, #C53030 0%, #D69E2E 100%)",
    },
    primaryColor: "#FF6B6B",
    accentColor: "#FFE66D",
    bgLight: { base: "orange.50", _dark: "orange.900/20" },
    borderColor: { base: "orange.200", _dark: "orange.700" },
    textColor: { base: "orange.700", _dark: "orange.200" },
    iconColor: { base: "orange.500", _dark: "orange.400" },
  },
  {
    id: "stage",
    title: "The Stage",
    subtitle: "Where will the magic happen?",
    icon: FiMapPin,
    gradient: {
      base: "linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)",
      _dark: "linear-gradient(135deg, #2C7A7B 0%, #276749 100%)",
    },
    primaryColor: "#4ECDC4",
    accentColor: "#44A08D",
    bgLight: { base: "teal.50", _dark: "teal.900/20" },
    borderColor: { base: "teal.200", _dark: "teal.700" },
    textColor: { base: "teal.700", _dark: "teal.200" },
    iconColor: { base: "teal.500", _dark: "teal.400" },
  },
  {
    id: "atmosphere",
    title: "The Atmosphere",
    subtitle: "What will it feel like?",
    icon: FiStar,
    gradient: {
      base: "linear-gradient(135deg, #A8EDEA 0%, #B721FF 100%)",
      _dark: "linear-gradient(135deg, #553C9A 0%, #6B46C1 100%)",
    },
    primaryColor: "#A8EDEA",
    accentColor: "#B721FF",
    bgLight: { base: "purple.50", _dark: "purple.900/20" },
    borderColor: { base: "purple.200", _dark: "purple.700" },
    textColor: { base: "purple.700", _dark: "purple.200" },
    iconColor: { base: "purple.500", _dark: "purple.400" },
  },
  {
    id: "timeline",
    title: "The Timeline",
    subtitle: "When does the story unfold?",
    icon: FiCalendar,
    gradient: {
      base: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
      _dark: "linear-gradient(135deg, #2C5282 0%, #553C9A 100%)",
    },
    primaryColor: "#667EEA",
    accentColor: "#764BA2",
    bgLight: { base: "blue.50", _dark: "blue.900/20" },
    borderColor: { base: "blue.200", _dark: "blue.700" },
    textColor: { base: "blue.700", _dark: "blue.200" },
    iconColor: { base: "blue.500", _dark: "blue.400" },
  },
  {
    id: "showcase",
    title: "The Showcase",
    subtitle: "Make it irresistible",
    icon: FiImage,
    gradient: {
      base: "linear-gradient(135deg, #F093FB 0%, #F5576C 100%)",
      _dark: "linear-gradient(135deg, #97266D 0%, #B83280 100%)",
    },
    primaryColor: "#F093FB",
    accentColor: "#F5576C",
    bgLight: { base: "pink.50", _dark: "pink.900/20" },
    borderColor: { base: "pink.200", _dark: "pink.700" },
    textColor: { base: "pink.700", _dark: "pink.200" },
    iconColor: { base: "pink.500", _dark: "pink.400" },
  },
  {
    id: "details",
    title: "The Details",
    subtitle: "Add rich content to your event page",
    icon: FiLayers,
    gradient: {
      base: "linear-gradient(135deg, #11998E 0%, #38EF7D 100%)",
      _dark: "linear-gradient(135deg, #234E52 0%, #276749 100%)",
    },
    primaryColor: "#11998E",
    accentColor: "#38EF7D",
    bgLight: { base: "green.50", _dark: "green.900/20" },
    borderColor: { base: "green.200", _dark: "green.700" },
    textColor: { base: "green.700", _dark: "green.200" },
    iconColor: { base: "green.500", _dark: "green.400" },
  },
]
