"use client"

import { useParams } from "next/navigation"
import { useMemo } from "react"
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
        values: (fields ?? []).map((field) => valuesByFieldId.get(field.id) ?? ""),
      }
    })
  }, [submissions, fields])

  const isLoading = isFieldsLoading || isSubmissionsLoading

  if (isLoading) {
    return (
      <main className="p-6">
        <p className="text-sm text-muted-foreground">Loading submissions...</p>
      </main>
    )
  }

  return (
    <main className="space-y-6 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Form submissions</h1>
        <p className="text-sm text-muted-foreground">
          Review each response grouped by the form fields.
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-sm text-muted-foreground">
          No submissions have been received for this form yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-foreground">Submission</th>
                {columns.map((column) => (
                  <th key={column} className="px-4 py-3 text-left font-medium text-foreground">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background">
              {rows.map((row, index) => (
                <tr key={row.id} className="align-top">
                  <td className="px-4 py-3 font-medium text-muted-foreground">#{index + 1}</td>
                  {row.values.map((value, valueIndex) => (
                    <td key={`${row.id}-${valueIndex}`} className="max-w-60 px-4 py-3 whitespace-pre-wrap wraap-break">
                      {value || "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
