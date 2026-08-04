"use client"

import Link from "next/link"
import * as React from "react"
import { toast } from "sonner"

import { AppSidebar } from "~/components/app-sidebar"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { SiteHeader } from "~/components/site-header"
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar"
import { Textarea } from "~/components/ui/textarea"
import { useCreateForm, useListForms } from "~/hooks/api/form"

export default function FormsPage() {
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const { createFormAsync, status } = useCreateForm()
  const { forms, isLoading, refetch } = useListForms()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedTitle = title.trim()
    const trimmedDescription = description.trim()

    if (!trimmedTitle) {
      toast.error("Please enter a form title")
      return
    }

    try {
      await createFormAsync({
        title: trimmedTitle,
        description: trimmedDescription ? trimmedDescription : undefined,
      })

      toast.success("Form created successfully")
      setTitle("")
      setDescription("")
      setOpen(false)
      void refetch()
    } catch {
      toast.error("Failed to create the form. Please try again.")
    }
  }

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
        
        <div className="flex flex-1 flex-col">
          <div className="flex flex-col gap-6 p-4 lg:p-6 max-w-7xl mx-auto w-full">
            
            {/* Header section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Forms Manager</h2>
                <p className="text-sm text-muted-foreground">
                  Build, share, and monitor responses of your questionnaires.
                </p>
              </div>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="h-10 px-5 font-semibold text-sm bg-primary hover:bg-primary/95 text-primary-foreground shadow-md shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all cursor-pointer">
                    <svg className="size-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Create new form
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md rounded-2xl border border-border bg-card shadow-2xl p-6">
                  <DialogHeader className="space-y-1.5 pb-2 border-b border-border/60">
                    <DialogTitle className="text-xl font-bold tracking-tight">Create a new form</DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                      Define the name and purpose of your new data collection form.
                    </DialogDescription>
                  </DialogHeader>

                  <form className="space-y-4 pt-4" onSubmit={handleSubmit}>
                    <div className="space-y-1.5">
                      <Label htmlFor="form-title" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Title</Label>
                      <Input
                        id="form-title"
                        placeholder="e.g., Customer satisfaction survey"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        className="h-11 border-border/60 bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="form-description" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Description</Label>
                      <Textarea
                        id="form-description"
                        placeholder="Briefly state the goal of this questionnaire..."
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        rows={4}
                        className="border-border/60 bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                      />
                    </div>

                    <DialogFooter className="pt-4 flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="h-10 cursor-pointer"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={status === "pending"} className="h-10 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-4 cursor-pointer">
                        {status === "pending" ? "Creating..." : "Create form"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Main forms listing grid */}
            <div>
              {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="rounded-2xl border border-border/60 bg-card p-6 space-y-4 animate-pulse">
                      <div className="h-4 w-28 bg-muted rounded" />
                      <div className="h-3 w-48 bg-muted rounded" />
                      <div className="h-8 w-full bg-muted rounded" />
                    </div>
                  ))}
                </div>
              ) : (forms?.length ?? 0) === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/80 p-16 text-center text-sm text-muted-foreground bg-card">
                  <svg className="mx-auto size-12 text-muted-foreground/50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <h4 className="text-base font-semibold text-foreground mb-1">No forms found</h4>
                  <p className="text-xs text-muted-foreground/80 max-w-sm mx-auto mb-4">You haven't created any forms yet. Launch a new questionnaire and start gathering insights.</p>
                  <Button onClick={() => setOpen(true)} className="h-9 px-4 font-semibold text-xs cursor-pointer">Create your first form</Button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {(forms ?? []).map((form) => (
                    <div
                      key={form.id}
                      className="group rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/60 transition-all duration-200 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded">
                            Standard Form
                          </span>
                          <span className="text-xs text-muted-foreground/75 font-medium">
                            {form.createdAt
                              ? new Date(form.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
                              : "—"}
                          </span>
                        </div>

                        <h3 className="text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                          <Link href={`/dashboard/forms/${form.id}`}>
                            {form.title}
                          </Link>
                        </h3>

                        <p className="text-xs text-muted-foreground/90 line-clamp-2 h-8 leading-relaxed">
                          {form.description ?? "No description provided."}
                        </p>
                      </div>

                      {/* Action buttons footer */}
                      <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between gap-2">
                        <Link
                          href={`/dashboard/forms/${form.id}`}
                          className="inline-flex items-center justify-center h-8.5 rounded-lg border border-border/80 bg-background/50 hover:bg-muted text-xs font-semibold px-3 transition-colors text-foreground"
                        >
                          Builder
                        </Link>
                        
                        <Link
                          href={`/dashboard/forms/${form.id}/submission`}
                          className="inline-flex items-center justify-center h-8.5 rounded-lg border border-border/80 bg-background/50 hover:bg-muted text-xs font-semibold px-3 transition-colors text-foreground"
                        >
                          Submissions
                        </Link>

                        <Link
                          href={`/form/${form.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center size-8.5 rounded-lg border border-border/80 bg-background/50 hover:bg-muted hover:text-primary transition-colors"
                          title="Open Public Link"
                        >
                          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
