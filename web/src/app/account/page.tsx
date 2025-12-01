"use client"
import { Avatar, Box, Button, Heading, Input, Text } from "@chakra-ui/react"
import { useSession } from "next-auth/react"
import * as React from "react"

export default function AccountPage() {
  console.log("AccountPage rendered")
  const { data: session, status } = useSession()
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    bio: "",
    phone: "",
    image: "",
  })
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Populate fields when session loads
  React.useEffect(() => {
    if (session?.user) {
      setForm((prev) => ({
        ...prev,
        name: session.user?.name || "",
        email: session.user?.email || "",
        image: session.user?.image || "",
        bio: (session as any).user?.bio || "",
        phone: (session as any).user?.phone || "",
      }))
    }
  }, [session])

  if (status === "loading") return null
  if (!session || !session.user) return <Text>You must be logged in to view account settings.</Text>

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError(null)
    try {
      const jwt = (session as any)?.jwt
      const profileId = (session as any)?.profileId
      if (!jwt || !profileId) {
        setError("Missing authentication or profile ID.")
        setLoading(false)
        return
      }
      const body: any = {}
      if (form.name) body.Name = form.name
      if (form.email) body.Email = form.email
      if (form.bio) body.Bio = form.bio
      if (form.phone) body.Phone = form.phone
      const res = await fetch(`/api/profiles/${profileId}/info`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        setError("Failed to update profile.")
        setLoading(false)
        return
      }
      setSuccess(true)
    } catch {
      setError("Unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box maxW="md" mx="auto" mt={16} p={8} borderWidth={0} borderRadius="2xl" bg="brand.white" boxShadow="lg">
      <Heading mb={6} color="brand.red" fontWeight="extrabold">
        Account Settings
      </Heading>
      {/* Replace Avatar usage with slot API */}
      <Box display="flex" alignItems="center" mb={6} gap={4}>
        <Avatar.Root size="xl" colorPalette="red" shape="full">
          <Avatar.Fallback name={session?.user?.name ?? "?"} />
          {session?.user?.image && <Avatar.Image src={session.user.image} alt={session.user.name ?? "Avatar"} />}
        </Avatar.Root>
        <Box>
          <Text fontWeight="bold" fontSize="lg" color="gray.900">
            {session?.user?.name}
          </Text>
          <Text fontSize="md" color="gray.700">
            {session?.user?.email}
          </Text>
        </Box>
      </Box>
      <form onSubmit={handleUpdate}>
        {success && (
          <Text color="green.600" mb={2} fontWeight="bold">
            Profile updated successfully!
          </Text>
        )}
        {error && (
          <Text color="red.600" mb={2} fontWeight="bold">
            {error}
          </Text>
        )}
        <Box mb={4}>
          <label htmlFor="name" style={{ fontWeight: "bold", marginBottom: 4, display: "block", color: "#434343ff" }}>
            Name
          </label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            bg="gray.50"
            borderRadius="md"
          />
        </Box>
        <Box mb={4}>
          <label htmlFor="email" style={{ fontWeight: "bold", marginBottom: 4, display: "block", color: "#434343ff" }}>
            Email
          </label>
          <Input
            id="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            bg="gray.50"
            borderRadius="md"
          />
        </Box>
        <Box mb={4}>
          <label htmlFor="bio" style={{ fontWeight: "bold", marginBottom: 4, display: "block", color: "#434343ff" }}>
            Bio
          </label>
          <Input
            id="bio"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            bg="gray.50"
            borderRadius="md"
          />
        </Box>
        <Box mb={4}>
          <label htmlFor="phone" style={{ fontWeight: "bold", marginBottom: 4, display: "block", color: "#434343ff" }}>
            Phone
          </label>
          <Input
            id="phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            bg="gray.50"
            borderRadius="md"
          />
        </Box>
        <Button
          colorScheme="brand"
          bg="brand.red"
          color="white"
          type="submit"
          width="full"
          borderRadius="lg"
          fontWeight="bold"
          _hover={{ bg: "brand.red", opacity: 0.85 }}
          loading={loading}
          onClick={() => console.log("Update button clicked")}
        >
          Update
        </Button>
      </form>
    </Box>
  )
}
