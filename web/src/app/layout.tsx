import { AppProviders } from "@/shared/components/providers/AppProviders"
import { ClientOnly } from "@/shared/components/utils/ClientOnly"

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
