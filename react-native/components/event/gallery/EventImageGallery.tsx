import { useCustomTheme } from "@/hooks/useCustomTheme"
import React, { useState } from "react"
import { Image, ScrollView, TouchableOpacity, View } from "react-native"
import { Button, Text } from "react-native-paper"

interface EventImageGalleryProps {
  images: string[]
  onChange?: (images: string[]) => void
  onAddImage?: () => void
}

const EventImageGallery: React.FC<EventImageGalleryProps> = ({ images, onAddImage }) => {
  const theme = useCustomTheme()
  const [selectedImageIdx, setSelectedImageIdx] = useState(0)
  if (!images || images.length === 0)
    return (
      <View style={{ alignItems: "center", marginVertical: 16 }}>
        <Text style={{ color: theme.colors.onBackground, marginBottom: 8 }}>No images added yet.</Text>
        {onAddImage && (
          <Button mode="outlined" onPress={onAddImage} icon="plus" style={{ borderRadius: 12 }}>
            Add Image
          </Button>
        )}
      </View>
    )
  const mainImage = images[selectedImageIdx] || images[0]

  return (
    <View style={{ width: "100%", alignItems: "center", position: "relative", marginVertical: 8 }}>
      {/* Main Image */}
      <View
        style={{
          width: "90%",
          aspectRatio: 1.3,
          borderRadius: 16,
          overflow: "hidden",
          backgroundColor: theme.colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={{ uri: mainImage }}
          style={{ width: "100%", height: "100%", borderRadius: 16 }}
          resizeMode="cover"
        />
        {/* Thumbnails Overlay */}
        <View style={{ position: "absolute", bottom: 12, left: 0, right: 0, alignItems: "center" }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: "center", paddingHorizontal: 8 }}
            style={{ maxWidth: "100%" }}
          >
            {images.map((img: string, idx: number) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setSelectedImageIdx(idx)}
                style={{
                  borderWidth: idx === selectedImageIdx ? 2 : 0,
                  borderColor: theme.colors.brand.red,
                  borderRadius: 16,
                  marginRight: 8,
                  overflow: "hidden",
                  backgroundColor: theme.colors.background,
                  width: 48,
                  height: 48,
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: idx === selectedImageIdx ? 1 : 0.4,
                }}
              >
                <Image source={{ uri: img }} style={{ width: 48, height: 48, borderRadius: 0 }} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      {onAddImage && (
        <Button mode="outlined" onPress={onAddImage} icon="plus" style={{ borderRadius: 12, marginTop: 16 }}>
          Add Image
        </Button>
      )}
    </View>
  )
}

export default EventImageGallery
