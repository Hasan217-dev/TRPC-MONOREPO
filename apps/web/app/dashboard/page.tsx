"use client"

import { useMemo } from "react"
import { AppSidebar } from "~/components/app-sidebar"
import { SiteHeader } from "~/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "~/components/ui/sidebar"
import { useListForms } from "~/hooks/api/form"
import { trpc } from "~/trpc/client"
import { ChartAreaInteractive } from "~/components/chart-area-interactive"

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

  const totalSubmissions = useMemo(() => {
    return submissionQueries.reduce((acc, query) => acc + (query.data?.length ?? 0), 0)
  }, [submissionQueries])

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
        
        <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {/* Dashboard Header greeting */}
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              Welcome back. Here is what is happening with your forms.
            </p>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Total Forms Card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 text-primary/10 group-hover:text-primary/20 transition-colors">
                <svg className="size-20 -mr-4 -mt-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex p-2.5 rounded-xl bg-primary/10 text-primary">
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </span>
                <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Total Forms</span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight">{forms?.length ?? 0}</span>
                <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">Live</span>
              </div>
            </div>

            {/* Total Submissions Card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 text-indigo-500/10 group-hover:text-indigo-500/20 transition-colors">
                <svg className="size-20 -mr-4 -mt-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </span>
                <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Responses</span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight">{totalSubmissions}</span>
                <span className="text-[11px] font-semibold text-indigo-500 bg-indigo-500/10 px-1.5 py-0.5 rounded">+12% new</span>
              </div>
            </div>

            {/* Interaction Rate Card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group sm:col-span-2 lg:col-span-1">
              <div className="absolute top-0 right-0 p-3 text-cyan-500/10 group-hover:text-cyan-500/20 transition-colors">
                <svg className="size-20 -mr-4 -mt-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600">
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </span>
                <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Submission Rate</span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight">87.4%</span>
                <span className="text-[11px] font-semibold text-cyan-600 bg-cyan-500/10 px-1.5 py-0.5 rounded">Optimal</span>
              </div>
            </div>
          </div>

          {/* Interactive Area Chart */}
          <div className="grid gap-6">
            <ChartAreaInteractive />
          </div>

          {/* Recent Submissions Table */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm overflow-hidden">
            <div className="mb-6 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold tracking-tight">Recent submissions</h3>
                <span className="text-xs text-muted-foreground/80 font-medium">Showing latest 8 responses</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Review recently captured data from your online visitors.
              </p>
            </div>

            {recentSubmissions.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/80 p-12 text-center text-sm text-muted-foreground">
                <svg className="mx-auto size-10 text-muted-foreground/50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4a2 2 0 012-2m14 0h-2m-8 0H6m8 0a2 2 0 012 2v1.5a.5.5 0 01-.5.5h-2a.5.5 0 01-.5-.5V15a2 2 0 012-2z" />
                </svg>
                No submissions yet. Create forms to start collecting data.
              </div>
            ) : (
              <div className="overflow-x-auto -mx-6">
                <div className="inline-block min-w-full align-middle px-6">
                  <div className="overflow-hidden border border-border/60 rounded-xl">
                    <table className="min-w-full divide-y divide-border/60 text-sm">
                      <thead className="bg-muted/40">
                        <tr className="text-left text-muted-foreground/80">
                          <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">Submission ID</th>
                          <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">Received At</th>
                          {recentSubmissions[0]?.displayValues?.map((value) => (
                            <th key={value.label} className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">
                              {value.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 bg-card">
                        {recentSubmissions.map((submission) => (
                          <tr key={submission.id} className="align-top hover:bg-muted/30 transition-colors duration-150">
                            <td className="px-4 py-3.5 font-mono text-xs font-semibold text-primary">
                              #{submission.id.slice(0, 8)}
                            </td>
                            <td className="px-4 py-3.5 text-xs text-muted-foreground font-medium">
                              {submission.createdAt
                                ? new Date(submission.createdAt).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })
                                : "Recently received"}
                            </td>
                            {submission.displayValues?.map((value) => (
                              <td key={`${submission.id}-${value.label}`} className="px-4 py-3.5 text-xs text-foreground font-medium">
                                {value.value}
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
