import { ColorModeButton } from "@/components/ColorModeButton"
import { AppProviders } from "@/components/providers/AppProviders"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <body style={{ backgroundColor: "var(--chakra-colors-gray-50)", color: "var(--chakra-colors-gray-900)" }}>
        <AppProviders>
          <ColorModeButton />
          {children}
        </AppProviders>
      </body>
    </html>
  )
}
