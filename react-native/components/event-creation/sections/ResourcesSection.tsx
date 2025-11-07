import { useCustomTheme } from "@/hooks/useCustomTheme"
import React from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"

interface ResourceFile {
  name: string
  url: string
}

interface ResourcesSectionProps {
  files: ResourceFile[]
  onChange: (files: ResourceFile[]) => void
  error?: string
}

const ResourcesSection: React.FC<ResourcesSectionProps> = ({ files, onChange, error }) => {
  const theme = useCustomTheme()
  const addFile = () => onChange([...files, { name: "", url: "" }])
  const updateFile = (idx: number, key: keyof ResourceFile, value: string) => {
    const updated = files.map((f, i) => (i === idx ? { ...f, [key]: value } : f))
    onChange(updated)
  }
  const removeFile = (idx: number) => onChange(files.filter((_, i) => i !== idx))

  return (
    <View
      style={{
        marginVertical: 12,
        backgroundColor: theme.colors.background,
        borderRadius: 16,
        padding: 20,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <Text style={{ color: theme.colors.gray[500], fontSize: 14 }}>
          Share files, links, or resources for your event.
        </Text>
      </View>
      {files.map((f, idx) => (
        <View
          key={idx}
          style={{
            marginBottom: 12,
            backgroundColor: theme.colors.background,
            borderRadius: 10,
          }}
        >
          <TextInput
            value={f.name}
            onChangeText={(v) => updateFile(idx, "name", v)}
            placeholder="File Name"
            placeholderTextColor={theme.colors.gray[400]}
            style={{
              borderWidth: 0,
              borderRadius: 10,
              padding: 14,
              marginBottom: 8,
              backgroundColor: theme.colors.secondary,
              color: theme.colors.onBackground,
              fontSize: 16,
            }}
          />
          <TextInput
            value={f.url}
            onChangeText={(v) => updateFile(idx, "url", v)}
            placeholder="File URL"
            placeholderTextColor={theme.colors.gray[400]}
            style={{
              borderWidth: 0,
              borderRadius: 10,
              padding: 14,
              marginBottom: 8,
              backgroundColor: theme.colors.secondary,
              color: theme.colors.onBackground,
              fontSize: 16,
            }}
          />
          <TouchableOpacity onPress={() => removeFile(idx)}>
            <Text style={{ color: theme.colors.brand.red, marginTop: 4, fontWeight: "bold" }}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity onPress={addFile} style={{ marginTop: 6 }}>
        <Text style={{ color: theme.colors.brand.blue, fontWeight: "bold" }}>+ Add File</Text>
      </TouchableOpacity>
      {typeof error === "string" && error.length > 0 && (
        <Text style={{ color: theme.colors.brand.red, marginTop: 4, fontSize: 13 }}>{error}</Text>
      )}
    </View>
  )
}

export default ResourcesSection
