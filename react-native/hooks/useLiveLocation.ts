import * as Location from "expo-location"
import { useEffect, useRef, useState } from "react"

export function useLiveLocation({ delay = 5000, distance = 5 } = {}) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const [address, setAddress] = useState("")
  const [error, setError] = useState<string | null>(null)
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
              setAddress(
                `${g.name ? g.name + ", " : ""}${g.street ? g.street + ", " : ""}${g.city ? g.city + ", " : ""}${
                  g.region ? g.region + ", " : ""
                }${g.country || ""}`
              )
            }
          }
        )
        // oxlint-disable-next-line no-unused-vars
      } catch (err) {
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
