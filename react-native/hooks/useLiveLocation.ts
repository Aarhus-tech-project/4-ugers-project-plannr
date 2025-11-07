import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Location from "expo-location"
import { useEffect, useRef, useState } from "react"

export interface LiveLocationState {
  location: Location.LocationObject | null
  address: Location.LocationGeocodedAddress | null
  error: string | null
}

export interface UseLiveLocationOptions {
  delay?: number
  distance?: number
  initial?: Partial<LiveLocationState>
}

export function useLiveLocation({
  delay = 5000,
  distance = 5,
  initial,
}: UseLiveLocationOptions = {}): LiveLocationState {
  const [location, setLocation] = useState<Location.LocationObject | null>(initial?.location ?? null)
  const [address, setAddress] = useState<Location.LocationGeocodedAddress | null>(initial?.address ?? null)
  const [error, setError] = useState<string | null>(initial?.error ?? null)
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null)
  const geocodeCache = useRef<{ [key: string]: Location.LocationGeocodedAddress[] }>({})
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  const getCacheKey = (lat: number, lng: number) => `${lat.toFixed(5)},${lng.toFixed(5)}`

  useEffect(() => {
    const startWatching = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== "granted") {
          setError("Permission to access location was denied")
          return
        }
        subscriptionRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Highest,
            timeInterval: delay, // ms between updates
            distanceInterval: distance, // meters moved before update
          },
          (loc) => {
            setLocation(loc)
            const { latitude, longitude } = loc.coords
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
            debounceTimeout.current = setTimeout(async () => {
              const key = getCacheKey(latitude, longitude)
              let geo: Location.LocationGeocodedAddress[] = []
              // Check in-memory cache first
              if (geocodeCache.current[key]) {
                geo = geocodeCache.current[key]
              } else {
                // Check persistent cache
                try {
                  const cached = await AsyncStorage.getItem(`geocode:${key}`)
                  if (cached) {
                    geo = JSON.parse(cached)
                    geocodeCache.current[key] = geo
                  } else {
                    try {
                      geo = await Location.reverseGeocodeAsync({ latitude, longitude })
                      geocodeCache.current[key] = geo
                      await AsyncStorage.setItem(`geocode:${key}`, JSON.stringify(geo))
                    } catch (err: any) {
                      if (typeof err?.message === "string" && err.message.includes("Geocoding rate limit exceeded")) {
                        setError("Geocoding rate limit exceeded. Please wait before trying again.")
                      }
                      geo = []
                    }
                  }
                  // oxlint-disable-next-line no-unused-vars
                } catch (err: any) {
                  try {
                    geo = await Location.reverseGeocodeAsync({ latitude, longitude })
                    geocodeCache.current[key] = geo
                  } catch (err2: any) {
                    if (typeof err2?.message === "string" && err2.message.includes("Geocoding rate limit exceeded")) {
                      setError("Geocoding rate limit exceeded. Please wait before trying again.")
                    }
                    geo = []
                  }
                }
              }
              if (geo && geo.length > 0) {
                const g = geo[0]
                setAddress(g)
              }
            }, 2000)
          }
        )
      } catch {
        setError("Could not fetch location")
      }
    }
    startWatching()
    return () => {
      if (subscriptionRef.current) subscriptionRef.current.remove()
    }
  }, [delay, distance])

  return { location, address, error }
}
