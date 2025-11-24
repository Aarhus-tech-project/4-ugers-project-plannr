import { AppProviders } from "@/components/providers/AppProviders"
import { ClientOnly } from "@/components/utils/ClientOnly"

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <html suppressHydrationWarning>
      <body>
        <ClientOnly>
          <AppProviders>{children}</AppProviders>
        </ClientOnly>
      </body>
    </html>
  )
}
