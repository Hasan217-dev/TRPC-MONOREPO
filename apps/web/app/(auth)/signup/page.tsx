import { GalleryVerticalEnd } from "lucide-react"
import { SignupForm } from "~/components/signup-form"

export default function SignupPage() {
  return (
    <div className="relative grid min-h-svh lg:grid-cols-2 overflow-hidden bg-background">
      {/* Decorative blobs for background */}
      <div className="ambient-blob ambient-blob-1 w-[350px] h-[350px] -top-20 -left-20" />
      <div className="ambient-blob ambient-blob-2 w-[350px] h-[350px] bottom-10 right-[50%]" />

      {/* Left Column (Signup Form) */}
      <div className="flex flex-col gap-4 p-6 md:p-10 z-10 border-r border-border/20">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2.5 font-bold tracking-tight text-foreground transition-opacity hover:opacity-90">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/20">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <span>Streamyst Forms</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center py-6">
          <div className="w-full max-w-sm">
            <SignupForm />
          </div>
        </div>
      </div>

      {/* Right Column (Visual Showcase / Interactive Mockup) */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-slate-950 text-white z-10">
        {/* Subtle grid pattern background overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />
        
        {/* Right side glowing blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-[80px]" />
        <div className="absolute bottom-[-15%] left-[10%] w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[100px]" />

        <div className="relative flex items-center gap-2">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-indigo-200 border border-white/10 backdrop-blur-sm">
            What's new v2.0
          </span>
        </div>

        {/* Dashboard Visual Mockup Box */}
        <div className="relative my-auto flex flex-col items-center">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-6 shadow-2xl animate-float">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-rose-500/80" />
                <span className="size-3 rounded-full bg-amber-500/80" />
                <span className="size-3 rounded-full bg-emerald-500/80" />
                <span className="text-[11px] font-mono text-slate-400 ml-2">builder_live_preview.json</span>
              </div>
              <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded">Active</span>
            </div>

            <div className="space-y-4">
              {/* Mock Form Title */}
              <div className="space-y-1">
                <div className="h-4 w-28 bg-slate-700 rounded-sm" />
                <div className="h-2 w-48 bg-slate-800 rounded-sm" />
              </div>

              {/* Mock Inputs */}
              <div className="space-y-3 pt-2">
                <div className="space-y-1.5">
                  <div className="h-3 w-16 bg-slate-700 rounded-sm" />
                  <div className="h-9 w-full bg-slate-800/80 rounded-md border border-white/5" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 w-24 bg-slate-700 rounded-sm" />
                  <div className="h-9 w-full bg-slate-800/80 rounded-md border border-white/5" />
                </div>
              </div>

              {/* Mock button */}
              <div className="pt-2 flex justify-between items-center">
                <div className="h-8 w-24 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-md shadow-md" />
                <div className="flex gap-2">
                  <div className="h-3 w-8 bg-slate-800 rounded-sm" />
                  <div className="h-3 w-12 bg-slate-800 rounded-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Floating decorative metric badge */}
          <div className="absolute -bottom-6 -right-6 rounded-xl border border-white/10 bg-slate-900/90 p-4 shadow-xl flex items-center gap-3 backdrop-blur-md animate-float-delayed">
            <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Submissions</p>
              <h4 className="text-lg font-bold text-white leading-none">12,492 +18%</h4>
            </div>
          </div>
        </div>

        {/* Brand statement / description */}
        <div className="relative mt-auto space-y-2">
          <h2 className="text-xl font-bold tracking-tight">Streamline customer interactions</h2>
          <p className="text-sm text-slate-300 leading-relaxed max-w-md">
            Deploy beautiful surveys, contact requests, feedback forms, and quizzes. Analyze results with dynamic dashboards and charts.
          </p>
        </div>
      </div>
    </div>
  )
}