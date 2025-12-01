function formatAddress(addressObj: any): string {
  // Try to extract house_number, road, city, town, village
  const parts = []
  if (addressObj.house_number) parts.push(addressObj.house_number)
  if (addressObj.road) parts.push(addressObj.road)
  if (addressObj.city) parts.push(addressObj.city)
  else if (addressObj.town) parts.push(addressObj.town)
  else if (addressObj.village) parts.push(addressObj.village)
  return parts.join(" ")
}
import { Box, Button, HStack, Input, Text, VStack } from "@chakra-ui/react"
import MapPicker from "@components/MapPicker"
import { useState } from "react"
import { FaMapMarkerAlt, FaSearchLocation } from "react-icons/fa"

interface LocationStepProps {
  value: { lat: number; lng: number; address?: string; city?: string; country?: string }
  onChange: (val: { lat: number; lng: number; address?: string; city?: string; country?: string }) => void
}

export default function LocationStep({ value, onChange }: LocationStepProps) {
  const [search, setSearch] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!search.trim()) return
    setLoading(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          search
        )}&addressdetails=1&limit=5`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "Plannr/1.0 (your@email.com)",
          },
        }
      )
      const data = await res.json()
      setSuggestions(data)
    } catch {
      setSuggestions([])
    }
    setLoading(false)
  }

  const handlePickSuggestion = (sugg: any) => {
    const formatted = sugg.address ? formatAddress(sugg.address) : sugg.display_name
    const city = sugg.address?.city || sugg.address?.town || sugg.address?.village || ""
    const country = sugg.address?.country || ""
    onChange({
      lat: parseFloat(sugg.lat),
      lng: parseFloat(sugg.lon),
      address: formatted,
      city,
      country,
    })
    setSearch(formatted)
    setSuggestions([])
  }

  return (
    <VStack alignItems="stretch" gap={0} width="100%">
      <HStack gap={2} mb={2}>
        <Box color="brand.red" fontSize="2xl">
          <FaMapMarkerAlt />
        </Box>
        <Text fontWeight="bold" fontSize="lg">
          Where is your event?
        </Text>
      </HStack>
      <Box borderBottom="1px" borderColor="gray.200" mb={4} />
      <Text fontSize="sm" color="gray.500" mb={1}>
        Search for an address or pick a location on the map
      </Text>
      <HStack gap={2} mb={2}>
        <Input
          placeholder="Search address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          borderRadius="md"
          bg="white"
          borderColor="gray.300"
          style={{ flex: 1 }}
        />
        <Button onClick={handleSearch} colorScheme="brand" loading={loading}>
          <Box as="span" mr={2} display="inline-flex">
            <FaSearchLocation />
          </Box>
          Search
        </Button>
      </HStack>
      {suggestions.length > 0 && (
        <Box borderWidth={1} borderRadius="md" p={2} bg="gray.50" mb={2}>
          {suggestions.map((sugg) => (
            <Button
              key={sugg.place_id}
              variant="ghost"
              width="100%"
              justifyContent="flex-start"
              onClick={() => handlePickSuggestion(sugg)}
              mb={1}
            >
              {sugg.address ? formatAddress(sugg.address) : sugg.display_name}
            </Button>
          ))}
        </Box>
      )}
      <Box borderBottom="1px" borderColor="gray.200" my={4} />
      <Box width="100%" overflow="hidden">
        <MapPicker
          lat={value.lat}
          lng={value.lng}
          onPick={async (coords) => {
            // Reverse geocode using Nominatim
            try {
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&addressdetails=1`,
                {
                  headers: {
                    Accept: "application/json",
                    "User-Agent": "Plannr/1.0 (your@email.com)",
                  },
                }
              )
              const data = await res.json()
              const formatted = data.address ? formatAddress(data.address) : data.display_name
              const city = data.address?.city || data.address?.town || data.address?.village || ""
              const country = data.address?.country || ""
              onChange({ ...coords, address: formatted, city, country })
              setSearch(formatted)
            } catch {
              onChange({ ...coords, address: `${coords.lat}, ${coords.lng}` })
              setSearch(`${coords.lat}, ${coords.lng}`)
            }
          }}
        />
      </Box>
    </VStack>
  )
}
