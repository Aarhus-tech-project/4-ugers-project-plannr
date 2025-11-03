import { useEventCreation } from "@/context/EventCreationContext"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import { EventPageSection } from "@/interfaces/event"
import { FontAwesome6 } from "@expo/vector-icons"
import { useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import SectionCard from "./SectionCard"
import DescriptionSection from "./sections/DescriptionSection"
import DresscodeSection from "./sections/DresscodeSection"
import FAQSection from "./sections/FAQSection"
import GuestsSection from "./sections/GuestsSection"
import ResourcesSection from "./sections/ResourcesSection"
import ScheduleSection from "./sections/ScheduleSection"
import TicketsSection from "./sections/TicketsSection"

const SECTION_TYPES = [
  { type: "description", label: "Description", icon: "align-left" },
  { type: "faq", label: "FAQ", icon: "question" },
  { type: "guests", label: "Guests", icon: "user-group" },
  { type: "tickets", label: "Tickets", icon: "ticket" },
  { type: "resources", label: "Resources", icon: "file-lines" },
  { type: "dresscode", label: "Dress Code", icon: "shirt" },
  { type: "schedule", label: "Schedule", icon: "calendar-days" },
]

const EventSectionsStep: React.FC = () => {
  const { sections, setSections } = useEventCreation()
  const theme = useCustomTheme()
  const [showAddOptions, setShowAddOptions] = useState(false)
  // const [selectedType, setSelectedType] = useState<string | null>(null)

  // Add a new section with default content
  const handleAddSection = (type: string) => {
    let newSection: EventPageSection
    switch (type) {
      case "description":
        newSection = { type: "description", content: "" }
        break
      case "faq":
        newSection = { type: "faq", items: [] }
        break
      case "guests":
        newSection = { type: "guests", guests: [] }
        break
      case "tickets":
        newSection = { type: "tickets", tickets: [] }
        break
      case "resources":
        newSection = { type: "resources", files: [] }
        break
      case "dresscode":
        newSection = { type: "dresscode", content: "" }
        break
      case "schedule":
        newSection = { type: "schedule", items: [] }
        break
      // images and map are handled in dedicated steps
      default:
        return
    }
    setSections([...sections, newSection])
    // setAddModalVisible(false)
    // setSelectedType(null)
  }

  const handleRemoveSection = (idx: number) => {
    setSections(sections.filter((_, i) => i !== idx))
  }

  const handleSectionChange = (idx: number, newSection: EventPageSection) => {
    setSections(sections.map((s, i) => (i === idx ? newSection : s)))
  }

  const renderSectionEditor = (item: EventPageSection, idx: number) => {
    switch (item.type) {
      case "description":
        return (
          <DescriptionSection
            value={item.content}
            onChange={(val) => handleSectionChange(idx, { ...item, content: val })}
          />
        )
      case "faq":
        return <FAQSection items={item.items} onChange={(items) => handleSectionChange(idx, { ...item, items })} />
      case "guests":
        return (
          <GuestsSection guests={item.guests} onChange={(guests) => handleSectionChange(idx, { ...item, guests })} />
        )
      case "tickets":
        return (
          <TicketsSection
            tickets={item.tickets}
            onChange={(tickets) => handleSectionChange(idx, { ...item, tickets })}
          />
        )
      case "resources":
        return (
          <ResourcesSection files={item.files} onChange={(files) => handleSectionChange(idx, { ...item, files })} />
        )
      case "dresscode":
        return (
          <DresscodeSection
            value={item.content}
            onChange={(val) => handleSectionChange(idx, { ...item, content: val })}
          />
        )
      case "schedule":
        return <ScheduleSection items={item.items} onChange={(items) => handleSectionChange(idx, { ...item, items })} />
      default:
        return null
    }
  }

  return (
    <>
      <View
        style={{
          width: "90%",
          backgroundColor: theme.colors.secondary,
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
          alignSelf: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
          <Text style={{ color: theme.colors.onBackground, fontWeight: "600", fontSize: 18 }}>
            Relevant Information
          </Text>
        </View>
        {sections.length === 0 ? (
          <Text style={{ color: theme.colors.gray[500], textAlign: "center", marginVertical: 24 }}>
            No sections added yet.
          </Text>
        ) : (
          sections.map((item, idx) => {
            const meta = SECTION_TYPES.find((s) => s.type === item.type)
            return (
              <SectionCard
                key={idx}
                icon={meta?.icon || "circle-question"}
                label={meta?.label || item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                accentColor={theme.colors.brand.red}
                onRemove={() => handleRemoveSection(idx)}
              >
                {renderSectionEditor(item, idx)}
              </SectionCard>
            )
          })
        )}
        <TouchableOpacity
          style={{
            backgroundColor: theme.colors.brand.red,
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: "center",
            marginTop: 18,
            shadowColor: theme.colors.brand.red,
            shadowOpacity: 0.12,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}
          onPress={() => setShowAddOptions((v) => !v)}
          activeOpacity={0.85}
        >
          <Text style={{ color: theme.colors.white, fontWeight: "bold", fontSize: 16 }}>+ Add Section</Text>
        </TouchableOpacity>

        {showAddOptions && (
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 14, marginBottom: 8 }}
          >
            {SECTION_TYPES.map((s) => {
              const alreadyAdded = sections.some((sec) => sec.type === s.type)
              return (
                <TouchableOpacity
                  key={s.type}
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: alreadyAdded ? theme.colors.gray[100] : theme.colors.gray[50],
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: alreadyAdded ? theme.colors.gray[300] : theme.colors.gray[200],
                    margin: 6,
                    paddingVertical: 16,
                    paddingHorizontal: 18,
                    minWidth: 90,
                    minHeight: 80,
                    opacity: alreadyAdded ? 0.5 : 1,
                    shadowColor: theme.colors.shadow,
                    shadowOpacity: 0.06,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 1 },
                    elevation: 1,
                  }}
                  onPress={() => {
                    if (!alreadyAdded) {
                      handleAddSection(s.type)
                      setShowAddOptions(false)
                    }
                  }}
                  activeOpacity={alreadyAdded ? 1 : 0.8}
                  disabled={alreadyAdded}
                >
                  <FontAwesome6 name={s.icon} size={22} color={theme.colors.brand.red} style={{ marginBottom: 8 }} />
                  <Text
                    style={{ fontSize: 14, color: theme.colors.onBackground, fontWeight: "600", textAlign: "center" }}
                  >
                    {s.label}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        )}
      </View>
    </>
  )
}

export default EventSectionsStep
