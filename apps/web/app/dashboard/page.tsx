"use client"

import { useMemo } from "react"
import { AppSidebar } from "~/components/app-sidebar"
import { SiteHeader } from "~/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "~/components/ui/sidebar"
import { useListForms, useListFileds } from "~/hooks/api/form"
import { trpc } from "~/trpc/client"

type SubmissionSummary = {
  id: string
  formId: string | null
  values?: Array<{ formFiledId: string; value: string }> | null
  createdAt?: string | null
}

export default function Page() {
  const { forms } = useListForms()

  const submissionQueries = trpc.useQueries((t) =>
    (forms ?? []).map((form) => t.form.getFormSubmissions({ formId: form.id })),
  )

  const formIds = useMemo(() => (forms ?? []).map((form) => form.id), [forms])
  const fieldQueries = trpc.useQueries((t) =>
    formIds.map((formId) => t.form.listFileds({ formId })),
  )

  const recentSubmissions = useMemo(() => {
    const submissions = submissionQueries
      .flatMap((query) => (query.data ?? []) as SubmissionSummary[])
      .sort((a: SubmissionSummary, b: SubmissionSummary) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return bTime - aTime
      })
      .slice(0, 8)

    return submissions.map((submission) => {
      const formIndex = forms?.findIndex((form) => form.id === submission.formId) ?? -1
      const fields = formIndex >= 0 ? (fieldQueries[formIndex]?.data ?? []) : []
      const valuesByFieldId = new Map(
        (submission.values ?? []).map((item) => [item.formFiledId, item.value]),
      )

      return {
        ...submission,
        displayValues: fields.map((field) => ({
          label: field.label,
          value: valuesByFieldId.get(field.id) ?? "—",
        })),
      }
    })
  }, [submissionQueries, fieldQueries, forms])
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">Recent submissions</h2>
                      <p className="text-sm text-muted-foreground">
                        Latest responses from your forms
                      </p>
                    </div>
                  </div>

                  {recentSubmissions.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
                      No submissions yet.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-border text-sm">
                        <thead>
                          <tr className="text-left text-muted-foreground">
                            <th className="px-3 py-2 font-medium">Submission</th>
                            <th className="px-3 py-2 font-medium">Received</th>
                            {recentSubmissions[0]?.displayValues?.map((value) => (
                              <th key={value.label} className="px-3 py-2 font-medium">
                                {value.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {recentSubmissions.map((submission) => (
                            <tr key={submission.id} className="align-top">
                              <td className="px-3 py-2 font-medium text-foreground">
                                #{submission.id.slice(0, 8)}
                              </td>
                              <td className="px-3 py-2 text-muted-foreground">
                                {submission.createdAt
                                  ? new Date(submission.createdAt).toLocaleString()
                                  : "Recently received"}
                              </td>
                              {submission.displayValues?.map((value) => (
                                <td key={`${submission.id}-${value.label}`} className="px-3 py-2 text-muted-foreground">
                                  {value.value}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
