/**
 * Central type exports
 * Import from here for consistent typing throughout the app
 */

// Domain Models
export type {
  Event,
  EventAccess,
  EventAttendance,
  EventCreator,
  EventDateRange,
  EventFormat,
  EventImage,
  EventLocation,
  EventPageSection,
  EventTheme,
  EventThemeIcon,
  EventThemeName,
} from "./models/event"

export type { Profile, ProfileUpdateDto } from "./models/profile"

export type { DateRangeMode, Filter, FilterDateRange, FilterLocation } from "./models/filter"

export type { ProviderType, Session, SessionType } from "./models/session"

// API Types
export type {
  ApiError,
  ApiResponse,
  BackendEndpoints,
  CreateEventRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "./api"

// Component Types
export type {
  CategoryTagsProps,
  DateTimeStepProps,
  DetailsStepProps,
  EventCardProps,
  FeaturedEventCardProps,
  ImagesStepProps,
  LocationStepProps,
  LoginFormData,
  MapPickerProps,
  NavbarProps,
  ProfileFormData,
  ReviewStepProps,
  SearchBarProps,
  SignupFormData,
  TestimonialCardProps,
  ThemeSelectorProps,
} from "./components"
