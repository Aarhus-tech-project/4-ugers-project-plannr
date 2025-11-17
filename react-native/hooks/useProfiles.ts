import { api } from "@/config/api"
import { useAsyncFn } from "./useAsyncFn"

export function useProfiles() {
  const fetchProfiles = useAsyncFn(api.profiles.list)
  const updateProfile = useAsyncFn(api.profiles.update)
  const createProfile = useAsyncFn(api.profiles.create)

  return { fetchProfiles, updateProfile, createProfile }
}
