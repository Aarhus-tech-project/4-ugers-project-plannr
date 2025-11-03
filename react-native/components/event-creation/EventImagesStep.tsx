import { useCustomTheme } from "@/hooks/useCustomTheme"
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6"
import * as ImagePicker from "expo-image-picker"
import React from "react"
import { Image, Text, TouchableOpacity, View } from "react-native"

export interface EventImage {
  uri: string
  name?: string
  type?: string
}

export interface EventImagesStepProps {
  images: EventImage[]
  setImages: (images: EventImage[]) => void
}

const MAX_IMAGES = 9

const EventImagesStep: React.FC<EventImagesStepProps> = ({ images, setImages }) => {
  const theme = useCustomTheme()

  const pickImage = async () => {
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
      setImages([...images, ...newImages].slice(0, MAX_IMAGES))
    }
  }

  const removeImage = (uri: string) => {
    setImages(images.filter((img) => img.uri !== uri))
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
    >
      <Text style={{ color: theme.colors.onBackground, fontWeight: "600", fontSize: 18, marginBottom: 12 }}>
        Event Images
      </Text>
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

export default EventImagesStep
