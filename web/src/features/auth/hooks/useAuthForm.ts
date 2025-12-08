import { useState } from "react"

export function useAuthForm<T>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const resetForm = () => {
    setValues(initialValues)
    setError("")
  }

  return {
    values,
    setValues,
    error,
    setError,
    isLoading,
    setIsLoading,
    handleChange,
    resetForm,
  }
}
