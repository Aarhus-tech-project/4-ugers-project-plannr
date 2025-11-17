import { useCustomTheme } from "@/hooks/useCustomTheme"
import { FontAwesome6 } from "@expo/vector-icons"
import React from "react"
import { Dimensions, TouchableOpacity, View } from "react-native"
import { Text } from "react-native-paper"

interface StepperProps {
  steps: { key: string; label: string; icon?: string }[]
  currentStep: number
  onStepChange?: (stepIndex: number) => void
  canGoNext?: boolean
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep, onStepChange, canGoNext }) => {
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
        paddingHorizontal: 26,
      }}
    >
      {steps.map((step, idx) => {
        // Only current, previous, and next (if valid) are pressable
        let isDisabled = false
        if (idx === currentStep + 1) isDisabled = !canGoNext
        else if (idx !== currentStep && idx !== currentStep - 1 && idx !== currentStep + 1 && idx > currentStep)
          isDisabled = true
        // Only next step is pressable if valid, previous always pressable, others not
        return (
          <React.Fragment key={step.key}>
            <View style={{ alignItems: "center", flex: 1, minWidth: stepWidth, maxWidth: stepWidth }}>
              <TouchableOpacity
                activeOpacity={isDisabled ? 1 : 0.7}
                onPress={() => {
                  if (!isDisabled) onStepChange?.(idx)
                }}
                style={{
                  width: stepWidth,
                  height: stepWidth,
                  borderRadius: stepWidth / 2,
                  backgroundColor: idx <= currentStep ? theme.colors.brand.red : theme.colors.gray[200],
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: idx === currentStep ? 2 : 0,
                  borderColor: theme.colors.brand.red,
                  opacity: isDisabled ? 0.4 : 1,
                }}
                disabled={isDisabled}
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
              </TouchableOpacity>
            </View>
            {idx < steps.length - 1 && (
              <View
                style={{
                  height: 2,
                  backgroundColor: idx < currentStep ? theme.colors.brand.red : theme.colors.gray[200],
                  flex: 1,
                  alignSelf: "center",
                  marginHorizontal: 4,
                  minWidth: 16,
                  maxWidth: 32,
                  opacity: isDisabled ? 0.4 : 1,
                }}
              />
            )}
          </React.Fragment>
        )
      })}
    </View>
  )
}

export default Stepper
