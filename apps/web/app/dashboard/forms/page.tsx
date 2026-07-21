"use client"

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
import { useCreateForm } from "~/hooks/api/form"

export default function FormsPage() {
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const { createFormAsync, status } = useCreateForm()

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
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:px-6 md:py-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">Forms</h2>
                  <p className="text-muted-foreground">
                    Create and manage your forms here.
                  </p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button>Create new form</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-120">
                    <DialogHeader>
                      <DialogTitle>Create a new form</DialogTitle>
                      <DialogDescription>
                        Add a title and optional description to start collecting responses.
                      </DialogDescription>
                    </DialogHeader>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <div className="space-y-2">
                        <Label htmlFor="form-title">Title</Label>
                        <Input
                          id="form-title"
                          placeholder="Customer feedback"
                          value={title}
                          onChange={(event) => setTitle(event.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="form-description">Description</Label>
                        <Textarea
                          id="form-description"
                          placeholder="Tell respondents what this form is for"
                          value={description}
                          onChange={(event) => setDescription(event.target.value)}
                          rows={4}
                        />
                      </div>

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={status === "pending"}>
                          {status === "pending" ? "Creating..." : "Create form"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
