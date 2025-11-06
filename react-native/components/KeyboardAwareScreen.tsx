import React from "react"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

import type { ReactNode } from "react"
import type { StyleProp, ViewStyle } from "react-native"

interface KeyboardAwareScreenProps {
  children: ReactNode
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
}

export default function KeyboardAwareScreen({ children, style, contentContainerStyle }: KeyboardAwareScreenProps) {
  return (
    <KeyboardAwareScrollView
      style={style}
      contentContainerStyle={contentContainerStyle}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={40}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </KeyboardAwareScrollView>
  )
}
