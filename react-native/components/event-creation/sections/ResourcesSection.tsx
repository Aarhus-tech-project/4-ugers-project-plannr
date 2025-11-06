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
    <View style={{ marginVertical: 8 }}>
      {files.map((f, idx) => (
        <View
          key={idx}
          style={{
            marginBottom: 12,
            backgroundColor: theme.colors.gray[50],
            borderRadius: 10,
            padding: 10,
            borderWidth: 1,
            borderColor: theme.colors.gray[100],
          }}
        >
          <TextInput
            value={f.name}
            onChangeText={(v) => updateFile(idx, "name", v)}
            placeholder="File Name"
            placeholderTextColor={theme.colors.gray[400]}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.gray[200],
              borderRadius: 8,
              padding: 8,
              marginBottom: 6,
              color: theme.colors.onBackground,
              fontSize: 15,
              backgroundColor: theme.colors.white,
            }}
          />
          <TextInput
            value={f.url}
            onChangeText={(v) => updateFile(idx, "url", v)}
            placeholder="File URL"
            placeholderTextColor={theme.colors.gray[400]}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.gray[200],
              borderRadius: 8,
              padding: 8,
              color: theme.colors.onBackground,
              fontSize: 15,
              backgroundColor: theme.colors.white,
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
