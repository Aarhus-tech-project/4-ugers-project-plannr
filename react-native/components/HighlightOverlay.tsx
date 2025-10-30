import React, { forwardRef, useImperativeHandle, useRef } from "react"
import { StyleSheet, View } from "react-native"
import AuraSVG from "./AuraSVG"

export interface HighlightOverlayProps {
  onDismiss: () => void
  targetRef: React.RefObject<any>
  auraColor?: string
  duration?: number // ms, if set, auto-dismiss after this many ms
  children?: React.ReactNode
}

export interface HighlightOverlayHandle {
  show: () => void
}

/**
 * Renders a full-screen overlay with a soft, diffused (smoke/dust) aura highlight around a target area.
 * The aura is a blurred, colored circle. The overlay dims the background and is dismissible by tap.
 */
const HighlightOverlay = forwardRef<HighlightOverlayHandle, HighlightOverlayProps>(
  ({ onDismiss, targetRef, auraColor = "#FF5F6D", duration, children }, ref) => {
    const [visible, setVisible] = React.useState(false)
    const [position, setPosition] = React.useState<{ top: number; left: number; size: number } | null>(null)
    const dismissed = useRef(false)

    // Expose show() method via ref
    useImperativeHandle(ref, () => ({
      show: () => {
        if (targetRef.current) {
          targetRef.current.measureInWindow((x: number, y: number, width: number, height: number) => {
            setPosition({
              top: y,
              left: x,
              size: Math.max(width, height),
            })
            setVisible(true)
            dismissed.current = false
          })
        }
      },
    }))

    // Auto-dismiss if duration is set
    React.useEffect(() => {
      if (!visible || !duration) return
      const timer = setTimeout(() => {
        if (!dismissed.current) {
          dismissed.current = true
          setVisible(false)
          setPosition(null)
          onDismiss()
        }
      }, duration)
      return () => clearTimeout(timer)
    }, [visible, duration, onDismiss])

    const handleDismiss = () => {
      if (!dismissed.current) {
        dismissed.current = true
        setVisible(false)
        setPosition(null)
        onDismiss()
      }
    }
    if (!visible || !position) return null
    const { top, left, size } = position
    const auraSize = size + 120
    const borderSize = auraSize
    return (
      <View style={styles.overlay} pointerEvents="box-none">
        {/* Dismiss area */}
        <View style={StyleSheet.absoluteFill} onTouchEnd={handleDismiss} />
        {/* SVG Aura: true ring, transparent center, centered on target */}
        <View
          pointerEvents="auto"
          onTouchEnd={handleDismiss}
          style={[
            styles.aura,
            {
              top: top - (borderSize - size) / 2,
              left: left - (borderSize - size) / 2,
              width: borderSize,
              height: borderSize,
              borderRadius: borderSize / 2,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <AuraSVG size={borderSize} color={auraColor} opacity={0.35} />
        </View>
        {children}
      </View>
    )
  }
)

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 100,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  aura: {
    position: "absolute",
    // The rest is set dynamically
  },
})

export default HighlightOverlay
