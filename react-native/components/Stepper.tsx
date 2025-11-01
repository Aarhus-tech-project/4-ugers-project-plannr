import { useCustomTheme } from "@/hooks/useCustomTheme"
import { FontAwesome6 } from "@expo/vector-icons"
import React from "react"
import { Dimensions, View } from "react-native"
import { Text } from "react-native-paper"

interface StepperProps {
  steps: { key: string; label: string; icon?: string }[]
  currentStep: number
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  const theme = useCustomTheme()
  // Responsive width for each step
  const screenWidth = Dimensions.get("window").width
  const stepWidth = Math.min(36, Math.floor((screenWidth - 32) / steps.length) - 8)
  const iconSize = 16

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
        flexWrap: "nowrap",
      }}
    >
      {steps.map((step, idx) => (
        <React.Fragment key={step.key}>
          <View style={{ alignItems: "center", flex: 1, minWidth: stepWidth, maxWidth: stepWidth }}>
            <View
              style={{
                width: stepWidth,
                height: stepWidth,
                borderRadius: stepWidth / 2,
                backgroundColor: idx <= currentStep ? theme.colors.brand.red : theme.colors.gray[200],
                justifyContent: "center",
                alignItems: "center",
                borderWidth: idx === currentStep ? 2 : 0,
                borderColor: theme.colors.brand.red,
              }}
            >
              {step.icon ? (
                <FontAwesome6
                  name={step.icon}
                  size={iconSize}
                  color={idx <= currentStep ? theme.colors.white : theme.colors.gray[500]}
                />
              ) : (
                <Text
                  style={{
                    color: idx <= currentStep ? theme.colors.white : theme.colors.gray[500],
                    fontWeight: "bold",
                  }}
                >
                  {idx + 1}
                </Text>
              )}
            </View>
          </View>
          {idx < steps.length - 1 && (
            <View
              style={{
                width: 18,
                height: 2,
                backgroundColor: idx < currentStep ? theme.colors.brand.red : theme.colors.gray[200],
                marginHorizontal: 2,
                alignSelf: "center",
              }}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  )
}

export default Stepper
