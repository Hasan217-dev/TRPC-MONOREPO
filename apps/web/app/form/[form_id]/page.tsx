"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useMemo, useState, type FormEvent } from "react"
import { useGetFormById, useSubmitForm } from "~/hooks/api/form"
import { Button } from "~/components/ui/button"

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
      className: "w-full rounded-xl border border-border/80 bg-background/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-xs",
      required: field.isRequired,
    }

    switch (field.type) {
      case "EMAIL":
        return <input {...commonProps} type="email" placeholder={field.placeholder ?? "you@example.com"} />
      case "PASSWORD":
        return <input {...commonProps} type="password" placeholder={field.placeholder ?? "Enter secure password"} />
      case "NUMBER":
        return <input {...commonProps} type="number" placeholder={field.placeholder ?? "0"} />
      case "YES_NO":
        return (
          <select {...commonProps} className={`${commonProps.className} cursor-pointer`}>
            <option value="">Select an option...</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        )
      default:
        if (field.type === "TEXT") {
          return <textarea {...commonProps} rows={4} placeholder={field.placeholder ?? "Type your response here..."} className={`${commonProps.className} resize-none`} />
        }
        return <input {...commonProps} type="text" placeholder={field.placeholder ?? "Type your response..."} />
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
      <main className="relative flex min-h-screen items-center justify-center bg-background px-6 py-16 overflow-hidden">
        <div className="ambient-blob ambient-blob-1 w-[400px] h-[400px] -top-20 -left-20" />
        <div className="ambient-blob ambient-blob-2 w-[400px] h-[400px] -bottom-20 -right-20" />
        <div className="z-10 text-center space-y-3">
          <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-muted-foreground animate-pulse">Loading secure form...</p>
        </div>
      </main>
    )
  }

  if (isError || !form) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-background px-6 py-16 overflow-hidden">
        <div className="ambient-blob ambient-blob-1 w-[400px] h-[400px] -top-20 -left-20" />
        <div className="ambient-blob ambient-blob-2 w-[400px] h-[400px] -bottom-20 -right-20" />
        <div className="z-10 rounded-2xl border border-destructive/20 bg-card/75 backdrop-blur-md p-8 text-center shadow-2xl max-w-sm w-full">
          <span className="flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive mx-auto mb-4">
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </span>
          <h1 className="text-xl font-bold tracking-tight">Form not found</h1>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            The link you followed might be incorrect or the form creator has closed submissions.
          </p>
          <div className="pt-6">
            <Link href="/" className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-xs font-bold text-primary-foreground transition-all active:scale-[0.98] shadow-md shadow-primary/20">
              Return Home
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-6 py-16 overflow-hidden">
      {/* Dynamic glowing blobs */}
      <div className="ambient-blob ambient-blob-1 w-[450px] h-[450px] -top-30 -left-20" />
      <div className="ambient-blob ambient-blob-2 w-[450px] h-[450px] -bottom-30 -right-20" />

      <div className="relative w-full max-w-2xl rounded-2xl border border-border/80 bg-card/65 backdrop-blur-md p-8 shadow-2xl z-10 transition-all duration-300">
        {/* Top visual indicator line */}
        <div className="absolute -top-0.5 inset-x-0 h-1 bg-gradient-to-r from-primary via-indigo-500 to-cyan-400 rounded-t-2xl" />

        <div className="space-y-3 pb-6 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
              Secure Submission
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              Powered by Streamyst
            </span>
          </div>
          
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{form.title}</h1>
          
          {form.description ? (
            <p className="text-sm text-muted-foreground/90 leading-relaxed font-medium">
              {form.description}
            </p>
          ) : null}
        </div>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          {fields.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/80 p-8 text-center text-sm text-muted-foreground bg-background/10">
              This form does not have any fields configured yet.
            </div>
          ) : (
            fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="text-sm font-semibold text-foreground/90 flex items-center gap-1">
                  {field.label}
                  {field.isRequired ? <span className="text-rose-500 font-bold">*</span> : null}
                </label>
                {field.description ? (
                  <p className="text-[11px] text-muted-foreground leading-normal mt-0.5">
                    {field.description}
                  </p>
                ) : null}
                {renderInput(field)}
              </div>
            ))
          )}

          {submitted || isSubmitSuccess ? (
            <div className="rounded-xl border border-emerald-600/20 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-600 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm shadow-emerald-500/20">
                ✓
              </span>
              <span>Your response has been submitted successfully. Thank you!</span>
            </div>
          ) : null}

          {submitError ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-xs font-semibold text-destructive flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-destructive text-white shadow-sm shadow-destructive/20">
                !
              </span>
              <span>We could not submit your response right now. Please try again.</span>
            </div>
          ) : null}

          <div className="pt-2 flex items-center justify-between">
            <Button
              type="submit"
              disabled={isPending || submitted || isSubmitSuccess}
              className="h-11 px-6 font-semibold bg-primary hover:bg-primary/95 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Submitting..." : "Submit response"}
            </Button>

            <span className="text-xs text-muted-foreground/60 font-medium">
              Response is saved securely
            </span>
          </div>
        </form>
      </div>
    </main>
  )
}
