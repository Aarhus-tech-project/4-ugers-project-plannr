import AttendanceModeSelector from "@/components/AttendanceModeSelector"
import CustomDateRangeCalendar from "@/components/CustomDateRangeCalendar"
import EventThemeSelector from "@/components/EventThemeSelector"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import { useLazyEventThemes } from "@/hooks/useLazyEventThemes"
import { EventFormat, EventPageSection, EventTheme } from "@/interfaces/event"
import { FontAwesome6 } from "@expo/vector-icons"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { useRouter } from "expo-router"
import React, { useRef, useState } from "react"
import { ScrollView, TouchableOpacity, View } from "react-native"
import { Text, TextInput } from "react-native-paper"
dayjs.extend(utc)

export default function CreateEvent() {
  const theme = useCustomTheme()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [formats, setFormats] = useState<EventFormat[]>(["inperson"])
  const [selectedThemes, setSelectedThemes] = useState<EventTheme[]>([])
  const { visibleThemes } = useLazyEventThemes(20, 600)
  const [startAt, setStartAt] = useState<Date | null>(null)
  const [endAt, setEndAt] = useState<Date | null>(null)
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  const [address, setAddress] = useState("")
  const [allDay, setAllDay] = useState(false)
  // Store previous range for toggling
  const prevRange = useRef<{ start: Date | null; end: Date | null }>({ start: null, end: null })

  const _handleCreate = () => {
    // Example: Add description section from input
    const eventSections: EventPageSection[] = [
      { type: "description", content: description },
      // Add more sections as needed from UI
    ]
    // Store all dates as UTC boundaries of the local day
    const event = {
      id: Date.now().toString(),
      title,
      description,
      format: formats[0],
      dateRange: {
        startAt: startAt ? dayjs(startAt).startOf("day").utc().toDate() : dayjs().startOf("day").utc().toDate(),
        endAt: endAt ? dayjs(endAt).endOf("day").utc().toDate() : undefined,
      },
      location: {
        city,
        country,
        address,
      },
      ageRestriction: undefined, // Add UI for this if needed
      theme: selectedThemes.length > 0 ? selectedThemes[0] : undefined,
      creatorId: "demo",
      attendance: { interested: 0 },
      sections: eventSections,
    }
    alert("Event created! (Demo)\n" + JSON.stringify(event, null, 2))
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.secondary }}>
      {/* Header */}
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
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 100, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title & Description Card */}
        <View style={styles.card(theme)}>
          <TextInput
            label="Title"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: 8,
              fontSize: 16,
              color: theme.colors.onBackground,
              marginBottom: 8,
            }}
            placeholderTextColor={theme.colors.onSurface}
          />
          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: 8,
              fontSize: 16,
              color: theme.colors.onBackground,
              marginBottom: 8,
            }}
            placeholderTextColor={theme.colors.onSurface}
          />
          {/* Future: Add UI for adding more section types */}
        </View>
        {/* Format Card */}
        <View style={styles.card(theme)}>
          <AttendanceModeSelector formats={formats} onChange={setFormats} />
        </View>
        {/* Themes Card */}
        <View style={styles.card(theme)}>
          <EventThemeSelector themes={visibleThemes} selectedThemes={selectedThemes} onSelect={setSelectedThemes} />
        </View>
        {/* Date & Time Card */}
        <View style={styles.card(theme)}>
          <View
            style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}
          >
            <TouchableOpacity
              onPress={() => {
                if (!allDay) {
                  // Switching to allDay: store range, select today
                  prevRange.current = { start: startAt, end: endAt }
                  const today = new Date()
                  setStartAt(today)
                  setEndAt(null)
                  setAllDay(true)
                } else {
                  // Switching to range: restore previous range
                  setStartAt(prevRange.current.start)
                  setEndAt(prevRange.current.end)
                  setAllDay(false)
                }
              }}
              style={{
                backgroundColor: allDay ? theme.colors.brand.red : theme.colors.surface,
                borderRadius: 16,
                paddingVertical: 6,
                paddingHorizontal: 16,
                borderWidth: 1,
                borderColor: allDay ? theme.colors.brand.red : theme.colors.gray[700],
              }}
              activeOpacity={0.7}
            >
              <Text style={{ color: allDay ? theme.colors.background : theme.colors.onSurface, fontWeight: "bold" }}>
                {allDay ? "All Day" : "Range"}
              </Text>
            </TouchableOpacity>
          </View>
          <CustomDateRangeCalendar
            customStart={startAt}
            customEnd={endAt}
            onStartChange={setStartAt}
            onEndChange={setEndAt}
            allDay={allDay}
          />
        </View>
        {/* Location Card */}
        <View style={styles.card(theme)}>
          <Text style={styles.label(theme)}>Location</Text>
          <TextInput
            label="City"
            value={city}
            onChangeText={setCity}
            mode="outlined"
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: 8,
              fontSize: 16,
              color: theme.colors.onBackground,
              marginBottom: 8,
            }}
            placeholderTextColor={theme.colors.onSurface}
          />
          <TextInput
            label="Country"
            value={country}
            onChangeText={setCountry}
            mode="outlined"
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: 8,
              fontSize: 16,
              color: theme.colors.onBackground,
              marginBottom: 8,
            }}
            placeholderTextColor={theme.colors.onSurface}
          />
          <TextInput
            label="Address"
            value={address}
            onChangeText={setAddress}
            mode="outlined"
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: 8,
              fontSize: 16,
              color: theme.colors.onBackground,
              marginBottom: 8,
            }}
            placeholderTextColor={theme.colors.onSurface}
          />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = {
  card: (theme: any) => ({
    width: "90%" as const,
    backgroundColor: theme.colors.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    alignItems: "stretch" as const,
  }),
  header: (theme: any) => ({
    color: theme.colors.brand.red,
    fontWeight: "700" as const,
    fontSize: 28,
    textAlign: "center" as const,
    marginBottom: 8,
  }),
  label: (theme: any) => ({
    color: theme.colors.brand.red,
    fontWeight: "700" as const,
    marginTop: 12,
    marginBottom: 4,
    fontSize: 16,
  }),
  input: {
    marginBottom: 8,
  },
  inputBtn: (theme: any) => ({
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.gray.light,
  }),
  createBtn: (theme: any) => ({
    marginTop: 18,
    borderRadius: 16,
    paddingVertical: 8,
    backgroundColor: theme.colors.brand.red,
  }),
}
