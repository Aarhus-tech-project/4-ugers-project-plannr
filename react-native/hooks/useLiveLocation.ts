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
          async (loc) => {
            setLocation(loc)
            const geo = await Location.reverseGeocodeAsync({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            })
            if (geo && geo.length > 0) {
              const g = geo[0]
              setAddress(g)
            }
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
