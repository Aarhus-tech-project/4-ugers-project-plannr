import React from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"

interface ResourceFile {
  name: string
  url: string
}

interface ResourcesSectionProps {
  files: ResourceFile[]
  onChange: (files: ResourceFile[]) => void
}

const ResourcesSection: React.FC<ResourcesSectionProps> = ({ files, onChange }) => {
  const addFile = () => onChange([...files, { name: "", url: "" }])
  const updateFile = (idx: number, key: keyof ResourceFile, value: string) => {
    const updated = files.map((f, i) => (i === idx ? { ...f, [key]: value } : f))
    onChange(updated)
  }
  const removeFile = (idx: number) => onChange(files.filter((_, i) => i !== idx))

  return (
    <View style={{ marginVertical: 12 }}>
      {files.map((f, idx) => (
        <View key={idx} style={{ marginBottom: 8 }}>
          <TextInput
            value={f.name}
            onChangeText={(v) => updateFile(idx, "name", v)}
            placeholder="File Name"
            style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 8, marginBottom: 4 }}
          />
          <TextInput
            value={f.url}
            onChangeText={(v) => updateFile(idx, "url", v)}
            placeholder="File URL"
            style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 8 }}
          />
          <TouchableOpacity onPress={() => removeFile(idx)}>
            <Text style={{ color: "#d33", marginTop: 2 }}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity onPress={addFile} style={{ marginTop: 6 }}>
        <Text style={{ color: "#1976d2", fontWeight: "bold" }}>+ Add File</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ResourcesSection
