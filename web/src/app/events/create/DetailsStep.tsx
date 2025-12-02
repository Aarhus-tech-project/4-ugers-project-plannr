import type { EventThemeName } from "@/lib/types"
import { Box, Input, Textarea } from "@chakra-ui/react"
import { ThemeSelector } from "@components/ThemeSelector"

interface DetailsStepProps {
  value: {
    title: string
    description: string
    themes: EventThemeName[]
  }
  onChange: (val: { title: string; description: string; themes: EventThemeName[] }) => void
}

export default function DetailsStep({ value, onChange }: DetailsStepProps) {
  return (
    <Box>
      <Input
        name="title"
        placeholder="Event Title"
        value={value.title}
        onChange={(e) => onChange({ ...value, title: e.target.value })}
        mb={4}
        required
      />
      <Textarea
        name="description"
        placeholder="Description"
        value={value.description}
        onChange={(e) => onChange({ ...value, description: e.target.value })}
        mb={4}
        required
      />
      <Box mb={6}>
        <ThemeSelector selectedThemes={value.themes} onChange={(themes) => onChange({ ...value, themes })} />
      </Box>
    </Box>
  )
}
