"use client"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { useSignIn } from "~/hooks/api/auth"

type LoginFormValues = {
  email: string
  password: string
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const {signInUserWithEmailAndPasswordAsync} = useSignIn()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>()

  const onSubmit = async (data: LoginFormValues) => {
    console.log("Login values:", data)
    const {id} = await signInUserWithEmailAndPasswordAsync({
      email : data.email ,
      password : data.password
    });
    router.replace("/dashboard")
  }

  return (
    <div className={cn("relative flex flex-col gap-6", className)} {...props}>
      {/* Decorative top colored line */}
      <div className="absolute -top-1 inset-x-0 h-1 bg-gradient-to-r from-primary via-indigo-500 to-cyan-400 rounded-t-xl z-20" />
      
      <Card className="relative overflow-hidden border-border/80 bg-card/65 backdrop-blur-md shadow-xl transition-all duration-300">
        <CardHeader className="space-y-1.5 pb-6">
          <div className="flex items-center gap-2 mb-2 justify-center lg:justify-start">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/20">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </span>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Streamyst Forms</span>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-center lg:text-left">Welcome back</CardTitle>
          <CardDescription className="text-center lg:text-left text-muted-foreground/90">
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="space-y-4">

              {/* Email */}
              <Field className="space-y-1.5">
                <FieldLabel htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="h-11 border-border/60 bg-background/50 transition-all duration-200 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Enter a valid email",
                    },
                  })}
                />
                {errors.email && (
                  <FieldDescription className="text-[11px] text-destructive font-medium flex items-center gap-1 mt-1 animate-in fade-in slide-in-from-top-1">
                    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {errors.email.message}
                  </FieldDescription>
                )}
              </Field>

              {/* Password */}
              <Field className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Password</FieldLabel>
                  <a
                    href="#"
                    className="text-xs font-medium text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>

                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-11 border-border/60 bg-background/50 transition-all duration-200 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 characters",
                    },
                  })}
                />

                {errors.password && (
                  <FieldDescription className="text-[11px] text-destructive font-medium flex items-center gap-1 mt-1 animate-in fade-in slide-in-from-top-1">
                    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {errors.password.message}
                  </FieldDescription>
                )}
              </Field>

              {/* Action Buttons */}
              <Field className="pt-2 space-y-3">
                <Button type="submit" className="w-full h-11 font-semibold tracking-wide bg-primary hover:bg-primary/95 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all cursor-pointer">
                  Log in to dashboard
                </Button>

                <div className="relative flex items-center justify-center my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <span className="relative bg-card px-3 text-xs text-muted-foreground uppercase tracking-wider font-semibold">Or continue with</span>
                </div>

                <Button variant="outline" type="button" className="w-full h-11 border-border/80 bg-background/30 hover:bg-muted font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer">
                  <svg className="size-4 text-muted-foreground" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google account</span>
                </Button>

                <FieldDescription className="text-center text-sm mt-4 text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <a href="/signup" className="font-semibold text-primary hover:underline underline-offset-4">
                    Create account
                  </a>
                </FieldDescription>
              </Field>

            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}