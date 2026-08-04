import { LoginForm } from "~/components/login-form"

export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10 overflow-hidden bg-background">
      {/* Ambient background glowing blobs */}
      <div className="ambient-blob ambient-blob-1 w-[400px] h-[400px] -top-20 -left-20" />
      <div className="ambient-blob ambient-blob-2 w-[450px] h-[450px] -bottom-20 -right-20" />
      
      <div className="w-full max-w-md z-10">
        <LoginForm />
      </div>
    </div>
  )
}
