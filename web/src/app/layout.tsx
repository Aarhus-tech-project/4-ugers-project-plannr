import { ColorModeButton } from "@/components/ColorModeButton"
import { AppProviders } from "@/components/providers/AppProviders"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <body>
        <AppProviders>
          <ColorModeButton />
          {children}
        </AppProviders>
      </body>
    </html>
  )
}
