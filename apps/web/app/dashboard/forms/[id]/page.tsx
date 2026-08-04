"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useState, useMemo } from "react"
import { AppSidebar } from "~/components/app-sidebar"
import { SiteHeader } from "~/components/site-header"
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar"
import { Button } from "~/components/ui/button"
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

  const sortedFields = useMemo(() => {
    return [...(fields ?? [])].sort((a, b) => Number(a.index) - Number(b.index))
  }, [fields])

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
          {/* Top Header Controls */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-border/60">
            <div>
              <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Form Builder</h2>
              <p className="text-xs font-mono text-muted-foreground mt-1">
                ID: {formId}
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
                onClick={handleOpenCreateModal}
                className="h-10 px-5 font-semibold text-sm bg-primary hover:bg-primary/95 text-primary-foreground shadow-md shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all cursor-pointer"
              >
                + Add Field
              </Button>
            </div>
          </div>

          {/* Dual Panel Editor Workspace */}
          <div className="grid gap-6 lg:grid-cols-5 flex-1 items-start">
            
            {/* Left Column: Form Fields List Manager */}
            <div className="lg:col-span-3 space-y-4">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-base font-bold tracking-tight">Form Outline</h3>
                  <p className="text-xs text-muted-foreground">Manage order and details of fields inside your form.</p>
                </div>

                <div className="space-y-3">
                  {sortedFields.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border/80 p-12 text-center text-sm text-muted-foreground">
                      <svg className="mx-auto size-10 text-muted-foreground/50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      No fields created yet. Click <span className="font-semibold text-foreground">"+ Add Field"</span> to start building.
                    </div>
                  ) : (
                    sortedFields.map((f) => (
                      <div
                        key={f.id}
                        className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 p-4 shadow-xs hover:border-primary/50 transition-all premium-card-hover"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-indigo-500 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                              #{f.index}
                            </span>
                            <span className="font-semibold text-foreground text-sm">
                              {f.label || "Untitled Field"}
                            </span>
                            <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                              {f.type}
                            </span>
                            {f.isRequired && (
                              <span className="rounded bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive">
                                Required
                              </span>
                            )}
                          </div>
                          {f.description && (
                            <p className="text-xs text-muted-foreground leading-normal">
                              {f.description}
                            </p>
                          )}
                          {f.placeholder && (
                            <p className="text-[11px] font-medium text-muted-foreground/70">
                              Placeholder: <span className="italic">"{f.placeholder}"</span>
                            </p>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(f)}
                            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted border border-transparent hover:border-border/60 transition-all cursor-pointer"
                            title="Edit Field"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteField(f.id)}
                            className="p-2 text-destructive/70 hover:text-destructive rounded-lg hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all cursor-pointer"
                            title="Delete Field"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Form Live Preview */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sticky top-24">
                <div className="mb-6 pb-4 border-b border-border/60 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold tracking-tight">Live Preview</h3>
                    <p className="text-xs text-muted-foreground">See exactly what respondents will see.</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Interactive
                  </span>
                </div>

                {/* Mock Form Wrapper */}
                <div className="rounded-xl border border-border/80 bg-background/40 p-5 space-y-5">
                  <div className="space-y-1">
                    <h4 className="font-bold text-base text-foreground">Interactive Form Preview</h4>
                    <p className="text-[11px] text-muted-foreground">This updates in real-time as you customize fields.</p>
                  </div>

                  <div className="space-y-4">
                    {sortedFields.length === 0 ? (
                      <div className="text-center py-8 text-xs text-muted-foreground">
                        Your preview is empty. Add form fields.
                      </div>
                    ) : (
                      sortedFields.map((f) => (
                        <div key={f.id} className="space-y-1.5">
                          <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1">
                            {f.label || "Untitled Field"}
                            {f.isRequired && <span className="text-rose-500">*</span>}
                          </label>
                          {f.description && (
                            <p className="text-[10px] text-muted-foreground leading-normal">{f.description}</p>
                          )}
                          
                          {f.type === "YES_NO" ? (
                            <select disabled className="w-full h-10 px-3 py-1.5 text-xs rounded-lg border border-border bg-background/50 text-muted-foreground cursor-not-allowed">
                              <option>Select Option...</option>
                              <option>Yes</option>
                              <option>No</option>
                            </select>
                          ) : (
                            <input
                              type={f.type === "PASSWORD" ? "password" : f.type === "EMAIL" ? "email" : f.type === "NUMBER" ? "number" : "text"}
                              placeholder={f.placeholder || "Enter answer here..."}
                              disabled
                              className="w-full h-10 px-3 py-1.5 text-xs rounded-lg border border-border bg-background/50 text-muted-foreground cursor-not-allowed"
                            />
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-2">
                    <Button disabled className="w-full h-10 text-xs font-semibold cursor-not-allowed opacity-60">
                      Submit Response
                    </Button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </SidebarInset>

      {/* Pop-up Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="text-base font-bold tracking-tight">
                {isEditing ? "Edit Field" : "Create New Field"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5">
              <label className="block space-y-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                <span>Field Label</span>
                <input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full h-10 rounded-lg border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
                  placeholder="e.g. Email Address"
                />
              </label>

              <label className="block space-y-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                <span>Description</span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full min-h-16 rounded-lg border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all resize-none"
                  placeholder="Tell users why this field is required..."
                />
              </label>

              <label className="block space-y-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                <span>Placeholder</span>
                <input
                  value={placeholder}
                  onChange={(e) => setPlaceholder(e.target.value)}
                  className="w-full h-10 rounded-lg border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
                  placeholder="e.g. you@domain.com"
                />
              </label>

              <div className="grid grid-cols-2 gap-3.5">
                <label className="block space-y-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                  <span>Order Index</span>
                  <input
                    type="number"
                    step="1"
                    value={index}
                    onChange={(e) => setIndex(Number(e.target.value))}
                    className="w-full h-10 rounded-lg border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
                  />
                </label>

                <label className="block space-y-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                  <span>Field Type</span>
                  <select
                    value={type}
                    onChange={(e) =>
                      setType(e.target.value as (typeof fieldTypes)[number])
                    }
                    className="w-full h-10 rounded-lg border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
                  >
                    {fieldTypes.map((fieldType) => (
                      <option key={fieldType} value={fieldType}>
                        {fieldType}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 pt-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isRequired}
                  onChange={(e) => setIsRequired(e.target.checked)}
                  className="h-4.5 w-4.5 rounded border-border text-primary focus:ring-primary/20"
                />
                <span>Required Field</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/60">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg border border-border px-4 py-2 text-xs font-semibold hover:bg-muted cursor-pointer h-10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={isEditing ? handleUpdateField : handleCreateField}
                className="rounded-lg bg-primary px-5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/95 cursor-pointer h-10 transition-all shadow-md shadow-primary/20 hover:shadow-primary/30"
              >
                {isEditing ? "Save Changes" : "Create Field"}
              </button>
            </div>
          </div>
        </div>
      )}
    </SidebarProvider>
  )
}