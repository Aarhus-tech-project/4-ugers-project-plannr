import { useCustomTheme } from "@/hooks/useCustomTheme"
import { FontAwesome6 } from "@expo/vector-icons"
import React, { ReactNode } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface SectionCardProps {
  icon: string
  label: string
  accentColor?: string
  children: ReactNode
  onRemove?: () => void
  onSettings?: () => void
  collapsed?: boolean
  onToggleCollapse?: () => void
  preview?: ReactNode
}

const SectionCard: React.FC<SectionCardProps> = ({
  icon,
  label,
  accentColor,
  children,
  onRemove,
  onSettings,
  collapsed,
  onToggleCollapse,
  preview,
}) => {
  const theme = useCustomTheme()
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.background,
          borderWidth: 0,
          padding: 16,
          marginVertical: 12,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={[styles.iconCircle, { backgroundColor: accentColor || theme.colors.brand.red }]}>
          <FontAwesome6 name={icon} size={16} color={theme.colors.white} />
        </View>
        <Text style={[styles.label, { color: theme.colors.onBackground }]}>{label}</Text>
        <View style={{ flexDirection: "row", marginLeft: "auto" }}>
          {onSettings && (
            <TouchableOpacity onPress={onSettings} style={styles.iconBtn}>
              <FontAwesome6 name="gear" size={16} color={theme.colors.gray[500]} />
            </TouchableOpacity>
          )}
          {onToggleCollapse && (
            <TouchableOpacity onPress={onToggleCollapse} style={styles.iconBtn}>
              <FontAwesome6 name={collapsed ? "chevron-down" : "chevron-up"} size={16} color={theme.colors.gray[500]} />
            </TouchableOpacity>
          )}
          {onRemove && (
            <TouchableOpacity onPress={onRemove} style={styles.iconBtn}>
              <FontAwesome6 name="trash" size={16} color={theme.colors.brand.red} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {collapsed ? (
        preview ? (
          <View style={{ marginTop: 8 }}>{preview}</View>
        ) : null
      ) : (
        <View style={{ marginTop: 12 }}>{children}</View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 8,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  label: {
    fontWeight: "700",
    fontSize: 17,
  },
  iconBtn: {
    marginLeft: 10,
    padding: 4,
  },
})

export default SectionCard
