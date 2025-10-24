import { useSession } from "@/hooks/useSession"
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "@env"
import { FontAwesome } from "@expo/vector-icons"
import * as AuthSession from "expo-auth-session"
import { useRouter } from "expo-router"
import React from "react"
import { Button, Surface, useTheme } from "react-native-paper"

export default function Login() {
  const router = useRouter()
  const [loginProvider, setLoginProvider] = React.useState<"google" | "github" | null>(null)
  const { setSession } = useSession()
  const [loading, setLoading] = React.useState(false)
  const theme = useTheme()

  const handleGoogleLogin = async () => {
    setLoginProvider("google")
    setLoginProvider(null)
    // Implement Google OAuth login flow here
  }
  const handleGithubLogin = async () => {
    setLoginProvider("github")
    if (loading) return
    setLoading(true)
    const clientId = GITHUB_CLIENT_ID || ""
    const redirectUri = AuthSession.makeRedirectUri()
    const discovery = {
      authorizationEndpoint: "https://github.com/login/oauth/authorize",
      tokenEndpoint: "https://github.com/login/oauth/access_token",
    }
    const request = new AuthSession.AuthRequest({
      clientId,
      redirectUri,
      scopes: ["read:user", "user:email"],
      responseType: AuthSession.ResponseType.Code,
    })
    await request.makeAuthUrlAsync(discovery)

    try {
      const result = await request.promptAsync(discovery)
      if (result.type === "success" && result.params?.code) {
        // Exchange code for access token (demo only, do this on backend in production)
        const code = result.params.code
        const clientId = GITHUB_CLIENT_ID || ""
        const clientSecret = GITHUB_CLIENT_SECRET || ""
        const codeVerifier = request.codeVerifier // PKCE code_verifier
        const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier,
          }),
        })
        const tokenData = await tokenResponse.json()
        if (tokenData.access_token) {
          try {
            const userRes = await fetch("https://api.github.com/user", {
              headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
                Accept: "application/vnd.github+json",
              },
            })
            const userData = await userRes.json()
            // Fetch emails
            let email = userData.email
            if (!email) {
              try {
                const emailRes = await fetch("https://api.github.com/user/emails", {
                  headers: {
                    Authorization: `Bearer ${tokenData.access_token}`,
                    Accept: "application/vnd.github+json",
                  },
                })
                const emails = await emailRes.json()
                if (Array.isArray(emails)) {
                  const primaryEmail = emails.find((e) => e.primary && e.verified)
                  email = primaryEmail?.email || emails[0]?.email || null
                }
              } catch (emailErr) {
                console.error("Failed to fetch GitHub emails:", emailErr)
              }
            }
            setSession({
              user: {
                name: userData.name,
                avatarUrl: userData.avatar_url,
                email,
                location: userData.location,
              },
              provider: "github",
              token: tokenData.access_token,
            })
            router.replace("/(tabs)")
          } catch (err) {
            console.error("Failed to fetch GitHub user info:", err)
          }
        }
      }
    } catch (error) {
      console.error("GitHub login error (exception):", error)
    } finally {
      setLoading(false)
      setLoginProvider(null)
    }
  }

  return (
    <Surface
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        elevation: 0,
      }}
    >
      <Button
        mode="contained-tonal"
        onPress={handleGoogleLogin}
        style={{
          borderRadius: 24,
          marginVertical: 8,
          width: 260,
          backgroundColor: theme.colors.secondary,
          opacity: loading ? 0.6 : 1,
        }}
        labelStyle={{
          color: theme.colors.onSecondary,
          fontSize: theme.fonts.bodyLarge.fontSize,
          letterSpacing: 0.2,
        }}
        disabled={loading}
        icon={() => <FontAwesome name="google" size={22} color={theme.colors.onSecondary} style={{ marginRight: 8 }} />}
      >
        {loading && loginProvider === "google" ? "Logging in..." : "Login with Google"}
      </Button>
      <Button
        mode="contained-tonal"
        onPress={handleGithubLogin}
        style={{
          borderRadius: 24,
          marginVertical: 8,
          width: 260,
          backgroundColor: theme.colors.primary,
        }}
        labelStyle={{
          color: theme.colors.onPrimary,
          fontSize: theme.fonts.bodyLarge.fontSize,
          letterSpacing: 0.2,
        }}
        icon={() => <FontAwesome name="github" size={22} color={theme.colors.onPrimary} style={{ marginRight: 8 }} />}
      >
        {loading && loginProvider === "github" ? "Logging in..." : "Login with GitHub"}
      </Button>
    </Surface>
  )
}
