interface FormLabelProps {
  htmlFor: string
  children: React.ReactNode
  required?: boolean
}

export function FormLabel({ htmlFor, children, required }: FormLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        fontWeight: "bold",
        marginBottom: "0.25rem",
        display: "block",
        color: "#434343",
      }}
    >
      {children}
      {required && <span style={{ color: "#E53E3E", marginLeft: "0.25rem" }}>*</span>}
    </label>
  )
}
