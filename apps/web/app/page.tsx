"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "~/hooks/api/auth"
import { useListForms } from "~/hooks/api/form"
import { trpc } from "~/trpc/client"

type SubmissionSummary = {
  id: string
  formId: string | null
  values?: Array<{ formFiledId: string; value: string }> | null
  createdAt?: string | null
}

export default function Home() {
  const { user } = useUser()
  const router = useRouter()
  const { forms, isLoading: isFormsLoading } = useListForms()

  const formIds = useMemo(() => (forms ?? []).map((form) => form.id), [forms])

  const submissionQueries = trpc.useQueries((t) =>
    formIds.map((formId) => t.form.getFormSubmissions({ formId })),
  )

  useEffect(() => {
    if (user && user.id) {
      router.replace("/dashboard")
    } else {
      router.replace("login")
    }
  }, [router, user])

  const submissions = useMemo(() => {
    return submissionQueries
      .flatMap((query) => (query.data ?? []) as SubmissionSummary[])
      .sort((a: SubmissionSummary, b: SubmissionSummary) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return bTime - aTime
      })
      .slice(0, 5)
  }, [submissionQueries])

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-3xl rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Quick overview</p>
          <h1 className="text-2xl font-semibold tracking-tight">Recent submissions</h1>
          <p className="text-sm text-muted-foreground">
            Latest responses from your forms appear here for a quick glance.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {isFormsLoading ? (
            <p className="text-sm text-muted-foreground">Loading recent submissions...</p>
          ) : submissions.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
              No submissions yet.
            </div>
          ) : (
            submissions.map((submission) => (
              <div key={submission.id} className="rounded-lg border border-border bg-background p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">
                    Submission #{submission.id.slice(0, 8)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {submission.createdAt ? new Date(submission.createdAt).toLocaleString() : "Recently received"}
                  </p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {(submission.values ?? []).length > 0
                    ? `${(submission.values ?? []).length} answer${(submission.values ?? []).length > 1 ? "s" : ""} captured`
                    : "No field values recorded"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  )
}

