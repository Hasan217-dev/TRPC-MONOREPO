"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useMemo } from "react"
import { AppSidebar } from "~/components/app-sidebar"
import { SiteHeader } from "~/components/site-header"
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar"
import { Button } from "~/components/ui/button"
import { useGetFormSubmissions, useListFileds } from "~/hooks/api/form"

type SubmissionValue = {
  formFiledId: string
  value: string
}

type SubmissionRow = {
  id: string
  formId: string | null
  values?: SubmissionValue[] | null
  createdAt: string | null
  updatedAt: string | null
}

export default function FormSubmissionsPage() {
  const params = useParams<{ id: string }>()
  const formId = params?.id ?? ""

  const { fields, isLoading: isFieldsLoading } = useListFileds(formId)
  const { submissions, isLoading: isSubmissionsLoading } = useGetFormSubmissions(formId)

  const columns = useMemo(() => {
    return (fields ?? []).map((field) => field.label)
  }, [fields])

  const rows = useMemo(() => {
    return (submissions ?? []).map((submission: SubmissionRow) => {
      const valuesByFieldId = new Map(
        (submission.values ?? []).map((item) => [item.formFiledId, item.value]),
      )

      return {
        id: submission.id,
        createdAt: submission.createdAt,
        values: (fields ?? []).map((field) => valuesByFieldId.get(field.id) ?? ""),
      }
    })
  }, [submissions, fields])

  const isLoading = isFieldsLoading || isSubmissionsLoading

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
      <SidebarInset className="bg-background/95">
        <SiteHeader />
        
        <div className="flex flex-col gap-6 p-4 lg:p-6 max-w-7xl mx-auto w-full flex-1">
          {/* Header Controls */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-border/60">
            <div>
              <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Form Submissions</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Review captured logs and responses submitted by users.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/forms"
                className="inline-flex items-center justify-center h-10 px-4 rounded-xl border border-border bg-card hover:bg-muted text-sm font-semibold transition-colors"
              >
                ← Back
              </Link>
              
              <Button
                type="button"
                className="h-10 px-4 font-semibold text-xs border border-border bg-card hover:bg-muted text-foreground flex items-center gap-2 cursor-pointer"
                onClick={() => alert("CSV Export feature coming soon!")}
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export CSV
              </Button>
            </div>
          </div>

          {/* Submissions Log Display */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm overflow-hidden flex-1">
            {isLoading ? (
              <div className="p-12 text-center text-sm text-muted-foreground animate-pulse">
                Loading submissions...
              </div>
            ) : rows.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/80 p-16 text-center text-sm text-muted-foreground bg-background/20">
                <svg className="mx-auto size-12 text-muted-foreground/45 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <h4 className="text-base font-semibold text-foreground mb-1">No responses received</h4>
                <p className="text-xs text-muted-foreground/80 max-w-sm mx-auto">This form has no submission history recorded yet. Share the public link to start collecting answers.</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-6">
                <div className="inline-block min-w-full align-middle px-6">
                  <div className="overflow-hidden border border-border/60 rounded-xl">
                    <table className="min-w-full divide-y divide-border/60 text-sm">
                      <thead className="bg-muted/40">
                        <tr className="text-left text-muted-foreground/80">
                          <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">ID</th>
                          <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">Date Submitted</th>
                          {columns.map((column) => (
                            <th key={column} className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 bg-card">
                        {rows.map((row, index) => (
                          <tr key={row.id} className="align-top hover:bg-muted/30 transition-colors duration-150">
                            <td className="px-4 py-3.5 font-mono text-xs font-semibold text-muted-foreground/85">
                              #{index + 1}
                            </td>
                            <td className="px-4 py-3.5 text-xs text-muted-foreground font-medium">
                              {row.createdAt
                                ? new Date(row.createdAt).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })
                                : "Recently"}
                            </td>
                            {row.values.map((value, valueIndex) => (
                              <td key={`${row.id}-${valueIndex}`} className="max-w-60 px-4 py-3.5 text-xs text-foreground font-medium whitespace-pre-wrap break-words leading-relaxed">
                                {value || "—"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
