"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"
import {
  useCreateFiled,
  useDeleteFiled,
  useGetFiled,
  useListFileds,
  useUpdateFiled,
} from "~/hooks/api/form"

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

  // Modal Open/Close State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const { createFiledAsync, status: createStatus } = useCreateFiled()
  const { field, refetch: refetchField } = useGetFiled(fieldId)
  const { updateFiledAsync, status: updateStatus } = useUpdateFiled()
  const { deleteFiledAsync, status: deleteStatus } = useDeleteFiled()
  const { fields, refetch: refetchFields } = useListFileds(formId ?? "")

  const resetForm = () => {
    setLabel("")
    setDescription("")
    setPlaceholder("")
    setIsRequired(false)
    setIndex((fields?.length ?? 0) + 1)
    setType("TEXT")
    setFieldId("")
  }

  const handleOpenCreateModal = () => {
    resetForm()
    setIsEditing(false)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (selectedField: any) => {
    setFieldId(selectedField.id)
    setLabel(selectedField.label ?? "")
    setDescription(selectedField.description ?? "")
    setPlaceholder(selectedField.placeholder ?? "")
    setIsRequired(selectedField.isRequired ?? false)
    setIndex(Number(selectedField.index ?? 1))
    setType(selectedField.type ?? "TEXT")
    setIsEditing(true)
    setIsModalOpen(true)
  }

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
    resetForm()
    setIsModalOpen(false)
    await refetchFields()
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
    await refetchFields()
    setIsModalOpen(false)
    resetForm()
  }

  const handleDeleteField = async (idToDelete: string) => {
    await deleteFiledAsync({ id: idToDelete })
    if (fieldId === idToDelete) {
      setFieldId("")
    }
    await refetchFields()
  }

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Form Builder
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Form ID: <span className="font-mono">{formId}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/forms"
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to forms
          </Link>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
          >
            <span>+</span> Add Field
          </button>
        </div>
      </div>

      {/* Fields List View (Matching Image Layout) */}
      <div className="space-y-3">
        {(fields ?? []).length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center text-sm text-muted-foreground">
            No fields created yet. Click <span className="font-semibold text-foreground">"+ Add Field"</span> to create your first field.
          </div>
        ) : (
          fields?.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between rounded-xl border bg-card/60 p-4 shadow-sm hover:border-primary/40 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground text-sm">
                    {f.label || "Untitled Field"}
                  </span>
                  <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {f.type}
                  </span>
                  {f.isRequired && (
                    <span className="rounded bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
                      Required
                    </span>
                  )}
                </div>
                {f.description && (
                  <p className="text-xs text-muted-foreground">
                    {f.description}
                  </p>
                )}
                {f.labelKey && (
                  <p className="text-xs font-mono text-muted-foreground/70">
                    {f.labelKey}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(f)}
                  className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
                  title="Edit Field"
                >
                  {/* Pencil Icon */}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteField(f.id)}
                  className="p-2 text-destructive/70 hover:text-destructive rounded-md hover:bg-destructive/10 transition-colors"
                  title="Delete Field"
                >
                  {/* Trash Icon */}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pop-up Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-semibold">
                {isEditing ? "Edit Field" : "Create New Field"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <label className="block space-y-1 text-xs font-medium">
                <span>Label</span>
                <input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="e.g. Full Name"
                />
              </label>

              <label className="block space-y-1 text-xs font-medium">
                <span>Description</span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full min-h-17.5 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
                  placeholder="Optional field description..."
                />
              </label>

              <label className="block space-y-1 text-xs font-medium">
                <span>Placeholder</span>
                <input
                  value={placeholder}
                  onChange={(e) => setPlaceholder(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="e.g. Enter your name"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block space-y-1 text-xs font-medium">
                  <span>Order Index</span>
                  <input
                    type="number"
                    step="0.1"
                    value={index}
                    onChange={(e) => setIndex(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </label>

                <label className="block space-y-1 text-xs font-medium">
                  <span>Field Type</span>
                  <select
                    value={type}
                    onChange={(e) =>
                      setType(e.target.value as (typeof fieldTypes)[number])
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {fieldTypes.map((fieldType) => (
                      <option key={fieldType} value={fieldType}>
                        {fieldType}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="flex items-center gap-2 text-xs font-medium pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRequired}
                  onChange={(e) => setIsRequired(e.target.checked)}
                  className="h-4 w-4 rounded border-input text-primary"
                />
                <span>Required Field</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-md border border-input px-3 py-1.5 text-xs font-medium hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={isEditing ? handleUpdateField : handleCreateField}
                className="rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
              >
                {isEditing ? "Save Changes" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}