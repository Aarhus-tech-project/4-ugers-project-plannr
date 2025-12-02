import Navbar from "@/components/Navbar"
import { AppProviders } from "@/components/providers/AppProviders"
import { ClientOnly } from "@/components/utils/ClientOnly"

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <html suppressHydrationWarning>
      <body>
        <ClientOnly>
          <AppProviders>
            {/* Show Navbar on all pages except login and signup */}
            <Navbar />
            {children}
          </AppProviders>
        </ClientOnly>
      </body>
    </html>
  )
}