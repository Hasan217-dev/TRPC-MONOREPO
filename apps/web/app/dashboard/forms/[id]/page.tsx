import Link from "next/link"

export default async function FormBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

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

      <div className="rounded-lg border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Builder content for form ID: <span className="font-medium text-foreground">{id}</span>
        </p>
      </div>
    </div>
  )
}
