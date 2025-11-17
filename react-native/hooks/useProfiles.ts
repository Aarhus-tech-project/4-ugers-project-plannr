import { api } from "@/config/api"
import type { Profile } from "@/interfaces/profile"
import { useAsyncFn } from "./useAsyncFn"

export function useProfiles() {
  const fetchProfiles = useAsyncFn(api.profiles.list)
  const updateProfile = useAsyncFn((id: string, data: Profile) => api.profiles.update(id, data)) // PUT for arbitrary fields
  const createProfile = useAsyncFn(api.profiles.create)
  return { fetchProfiles, updateProfile, createProfile }
}
