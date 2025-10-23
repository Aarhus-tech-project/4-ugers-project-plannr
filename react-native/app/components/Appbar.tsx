import { Appbar as PaperAppbar, useTheme } from "react-native-paper"
export default function Appbar() {
  const theme = useTheme()
  const bg = theme.colors.background
  return (
    <PaperAppbar
      style={{
        backgroundColor: bg,
      }}
      children={undefined}
    />
  )
}
