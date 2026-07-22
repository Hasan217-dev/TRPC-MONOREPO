"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"
import { useCreateFiled, useDeleteFiled, useGetFiled, useUpdateFiled } from "~/hooks/api/form"

const fieldTypes = ["TEXT", "NUMBER", "YES_NO", "EMAIL", "PASSWORD"] as const

export default function FormBuilderPage() {
  const { id: formId } = useParams<{ id: string }>()
  const [label, setLabel] = useState("")
  const [description, setDescription] = useState("")
  const [placeholder, setPlaceholder] = useState("")
  const [isRequired, setIsRequired] = useState(false)
  const [index, setIndex] = useState(1)
  const [type, setType] = useState<(typeof fieldTypes)[number]>("TEXT")
  const [fieldId, setFieldId] = useState("")

  const { createFiledAsync, createFiled, status: createStatus } = useCreateFiled()
  const { field, refetch: refetchField } = useGetFiled(fieldId)
  const { updateFiledAsync, status: updateStatus } = useUpdateFiled()
  const { deleteFiledAsync, status: deleteStatus } = useDeleteFiled()

  const handleCreateField = async () => {
    if (!formId) return

    const result = await createFiledAsync({
      label,
      description,
      placeholder,
      isRequired,
      index,
      type,
      formId,
    })

    setFieldId(result.id)

       // Reset the form after successful creation
    setLabel("")
    setDescription("")
    setPlaceholder("")
    setIsRequired(false)
    setIndex(1)
    setType("TEXT")
  }

  const handleUpdateField = async () => {
    if (!fieldId) return

    await updateFiledAsync({
      id: fieldId,
      label,
      description,
      placeholder,
      isRequired,
      index,
      type,
    })

    await refetchField()
  }

  const handleDeleteField = async () => {
    if (!fieldId) return

    await deleteFiledAsync({ id: fieldId })
    setFieldId("")
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Form builder</h2>
          <p className="text-muted-foreground">
            Build and edit this form&apos;s fields.
          </p>
        </div>
        <Link
          href="/dashboard/forms"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Back to forms
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Builder content for form ID: <span className="font-medium text-foreground">{formId}</span>
            </p>
            <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
              {createStatus}
            </span>
          </div>

          <div className="grid gap-3">
            <label className="grid gap-1 text-sm">
              <span>Label</span>
              <input
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                className="rounded-md border px-3 py-2"
                placeholder="Field label"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span>Description</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="min-h-24 rounded-md border px-3 py-2"
                placeholder="Optional field description"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span>Placeholder</span>
              <input
                value={placeholder}
                onChange={(event) => setPlaceholder(event.target.value)}
                className="rounded-md border px-3 py-2"
                placeholder="Optional placeholder"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1 text-sm">
                <span>Index</span>
                <input
                  type="number"
                  step="0.1"
                  value={index}
                  onChange={(event) => setIndex(Number(event.target.value))}
                  className="rounded-md border px-3 py-2"
                />
              </label>

              <label className="grid gap-1 text-sm">
                <span>Type</span>
                <select
                  value={type}
                  onChange={(event) => setType(event.target.value as (typeof fieldTypes)[number])}
                  className="rounded-md border px-3 py-2"
                >
                  {fieldTypes.map((fieldType) => (
                    <option key={fieldType} value={fieldType}>
                      {fieldType}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isRequired}
                onChange={(event) => setIsRequired(event.target.checked)}
              />
              Required field
            </label>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCreateField}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Create field
              </button>

              <button
                type="button"
                onClick={handleUpdateField}
                className="rounded-md border px-4 py-2 text-sm font-medium"
              >
                Update field
              </button>

              <button
                type="button"
                onClick={handleDeleteField}
                className="rounded-md border px-4 py-2 text-sm font-medium text-destructive"
              >
                Delete field
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Field inspector</h3>
            <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
              {updateStatus}
            </span>
          </div>

          <label className="mb-4 grid gap-1 text-sm">
            <span>Field ID</span>
            <input
              value={fieldId}
              onChange={(event) => setFieldId(event.target.value)}
              className="rounded-md border px-3 py-2"
              placeholder="Enter field id"
            />
          </label>

          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Field loaded:</span> {field?.id ?? "No field selected"}
            </p>
            <p>
              <span className="font-medium">Label:</span> {field?.label ?? "-"}
            </p>
            <p>
              <span className="font-medium">Label key:</span> {field?.labelKey ?? "-"}
            </p>
            <p>
              <span className="font-medium">Type:</span> {field?.type ?? "-"}
            </p>
            <p>
              <span className="font-medium">Index:</span> {field?.index ?? "-"}
            </p>
            <p>
              <span className="font-medium">Required:</span> {field?.isRequired ? "Yes" : "No"}
            </p>
            <p>
              <span className="font-medium">Status:</span> {deleteStatus}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
