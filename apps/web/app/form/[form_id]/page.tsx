"use client"

import { useParams } from "next/navigation"
import { useMemo, useState, type FormEvent } from "react"
import { useGetFormById, useSubmitForm } from "~/hooks/api/form"

type FieldType = "TEXT" | "NUMBER" | "YES_NO" | "EMAIL" | "PASSWORD"

export default function PublicFormPage() {
  const params = useParams<{ form_id: string }>()
  const formId = params?.form_id ?? ""
  const { form, isLoading, isError } = useGetFormById(formId)
  const { submitFormAsync, isPending, isSuccess: isSubmitSuccess, error: submitError } = useSubmitForm()
  const [values, setValues] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const fields = form?.fields ?? []

  const renderInput = (field: { id: string; label: string; type: FieldType; placeholder?: string | null; description?: string | null; isRequired: boolean }) => {
    const value = values[field.id] ?? ""
    const commonProps = {
      value,
      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setValues((current) => ({ ...current, [field.id]: event.target.value })),
      className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring",
      required: field.isRequired,
    }

    switch (field.type) {
      case "EMAIL":
        return <input {...commonProps} type="email" placeholder={field.placeholder ?? "you@example.com"} />
      case "PASSWORD":
        return <input {...commonProps} type="password" placeholder={field.placeholder ?? "Enter password"} />
      case "NUMBER":
        return <input {...commonProps} type="number" placeholder={field.placeholder ?? "0"} />
      case "YES_NO":
        return (
          <select {...commonProps}>
            <option value="">Select an option</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        )
      default:
        if (field.type === "TEXT") {
          return <textarea {...commonProps} rows={4} placeholder={field.placeholder ?? "Type your answer"} />
        }
        return <input {...commonProps} type="text" placeholder={field.placeholder ?? "Type your answer"} />
    }
  }

  const submissionText = useMemo(() => {
    if (!form) return ""
    return `Fill out the public form for ${form.title}`
  }, [form])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!formId) return

    const submissionValues = fields.map((field) => ({
      formFiledId: field.id,
      value: values[field.id] ?? "",
    }))

    try {
      await submitFormAsync({
        formId,
        values: submissionValues,
      })
      setSubmitted(true)
    } catch {
      setSubmitted(false)
    }
  }

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-16">
        <p className="text-sm text-muted-foreground">Loading form...</p>
      </main>
    )
  }

  if (isError || !form) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-16">
        <div className="rounded-xl border border-destructive/20 bg-background p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold">Form not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">This form could not be loaded right now.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-16">
      <div className="w-full rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Public form</p>
          <h1 className="text-3xl font-semibold tracking-tight">{form.title}</h1>
          {form.description ? <p className="text-sm text-muted-foreground">{form.description}</p> : null}
          <p className="text-sm text-muted-foreground">{submissionText}</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {fields.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
              This form does not have any fields yet.
            </div>
          ) : (
            fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {field.label}
                  {field.isRequired ? <span className="ml-1 text-destructive">*</span> : null}
                </label>
                {field.description ? <p className="text-sm text-muted-foreground">{field.description}</p> : null}
                {renderInput(field)}
              </div>
            ))
          )}

          {submitted || isSubmitSuccess ? (
            <div className="rounded-lg border border-green-600/20 bg-green-50 p-4 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-400">
              Your response has been submitted successfully.
            </div>
          ) : null}

          {submitError ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
              We could not submit your response right now.
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </main>
  )
}
