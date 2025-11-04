import { useCustomTheme } from "@/hooks/useCustomTheme"
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6"
import * as ImagePicker from "expo-image-picker"
import React, { useState } from "react"
import { Image, Text, TouchableOpacity, View } from "react-native"

export interface EventImage {
  uri: string
  name?: string
  type?: string
}

import { EventPageSection } from "@/interfaces/event"

export interface EventImagesStepProps {
  sections: EventPageSection[]
  setSections: (sections: EventPageSection[]) => void
}

const MAX_IMAGES = 9

const EventImagesStep: React.FC<EventImagesStepProps> = ({ sections, setSections }) => {
  const theme = useCustomTheme()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Find images section
  const imagesSection = sections.find((s) => s.type === "images")
  const images: { uri: string }[] = imagesSection?.srcs?.map((uri: string) => ({ uri })) || []

  const pickImage = async () => {
    setError(null)
    setLoading(true)
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: MAX_IMAGES - images.length,
      })
      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset) => ({
          uri: asset.uri,
          name: asset.fileName ?? undefined,
          type: asset.type,
        }))
        const srcs = [...images.map((img: { uri: string }) => img.uri), ...newImages.map((img) => img.uri)].slice(
          0,
          MAX_IMAGES
        )
        // Update sections
        const filteredSections = sections.filter((s) => s.type !== "images")
        setSections([{ type: "images", srcs }, ...filteredSections])
      }
    } catch (e) {
      console.error(e)
      setError("Failed to pick images. Please check permissions and try again.")
    } finally {
      setLoading(false)
    }
  }

  const removeImage = (uri: string) => {
    const srcs = images.filter((img: { uri: string }) => img.uri !== uri).map((img) => img.uri)
    const filteredSections = sections.filter((s) => s.type !== "images")
    if (srcs.length > 0) {
      setSections([{ type: "images", srcs }, ...filteredSections])
    } else {
      setSections(filteredSections)
    }
  }

  // Build grid: fill with images, then skeletons, add button in first empty slot
  const grid: (EventImage | "add" | "skeleton")[] = []
  for (let i = 0; i < MAX_IMAGES; i++) {
    if (i < images.length) {
      grid.push(images[i])
    } else if (i === images.length) {
      grid.push("add")
    } else {
      grid.push("skeleton")
    }
  }

  return (
    <View
      style={{
        width: "90%",
        backgroundColor: theme.colors.secondary,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        alignSelf: "center",
      }}
      accessibilityLabel="Event Images Section"
    >
      <Text style={{ color: theme.colors.onBackground, fontWeight: "600", fontSize: 18, marginBottom: 12 }}>
        Event Images
      </Text>
      {error && <Text style={{ color: theme.colors.brand.red, fontSize: 14, marginBottom: 8 }}>{error}</Text>}
      {loading && <Text style={{ color: theme.colors.brand.red, fontSize: 14, marginBottom: 8 }}>Loading...</Text>}
      {images.length === 0 && !loading && !error && (
        <View style={{ alignItems: "center", marginBottom: 12 }}>
          <FontAwesome6 name="image" size={32} color={theme.colors.gray[400]} />
          <Text style={{ color: theme.colors.gray[400], fontSize: 15, marginTop: 6 }}>
            No images selected yet. Add up to {MAX_IMAGES} images.
          </Text>
        </View>
      )}
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start" }}>
        {grid.map((item, idx) => {
          if (item === "add") {
            return (
              <TouchableOpacity
                key={"add"}
                onPress={pickImage}
                style={{
                  width: 90,
                  height: 90,
                  margin: 6,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: theme.colors.background,
                  borderStyle: "dashed",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                activeOpacity={0.7}
                accessibilityLabel="Add event image"
              >
                <FontAwesome6 name="plus" size={20} color={theme.colors.brand.red} />
              </TouchableOpacity>
            )
          } else if (item === "skeleton") {
            return (
              <TouchableOpacity
                key={"skeleton-" + idx}
                onPress={pickImage}
                disabled={true}
                style={{
                  width: 90,
                  height: 90,
                  margin: 6,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: theme.colors.background,
                  borderStyle: "dashed",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                activeOpacity={0.7}
                accessibilityLabel="Image slot"
              >
                <FontAwesome6 name="plus" size={20} color={theme.colors.brand.red + "80"} />
              </TouchableOpacity>
            )
          } else {
            return (
              <View
                key={item.uri}
                style={{
                  width: 90,
                  height: 90,
                  margin: 6,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: theme.colors.background,
                  borderStyle: "dashed",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
                accessibilityLabel={`Event image: ${item.uri}`}
              >
                <Image source={{ uri: item.uri }} style={{ width: 80, height: 80, borderRadius: 12 }} />
                <TouchableOpacity
                  onPress={() => removeImage(item.uri)}
                  style={{
                    position: "absolute",
                    top: -10,
                    right: -6,
                    backgroundColor: theme.colors.brand.red,
                    borderRadius: 14,
                    width: 24,
                    height: 24,
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 2,
                    padding: 0,
                  }}
                  activeOpacity={0.7}
                  accessibilityLabel={`Remove image: ${item.uri}`}
                >
                  <FontAwesome6 name="xmark" size={14} color={theme.colors.white} />
                </TouchableOpacity>
              </View>
            )
          }
        })}
      </View>
    </View>
  )
}

export default React.memo(EventImagesStep)
