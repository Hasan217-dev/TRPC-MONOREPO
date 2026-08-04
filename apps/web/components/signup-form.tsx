"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { useSignup } from "~/hooks/api/auth"

type SignupFormValues = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export function SignupForm({ className, ...props }: React.ComponentProps<"form">) {
  
  const {createUserWithEmailAndPasswordAsync} = useSignup();
  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>()

  const password = watch("password")

  const onSubmit = async (data: SignupFormValues) => {
    console.log("Form values:", data)
    const { id } = await createUserWithEmailAndPasswordAsync({
      email: data.email,
      password: data.password,
      fullName: data.name,
    })
    console.log(`user created with id=${id}`)
    router.replace("/dashboard")
  }

  return (
    <div className={cn("relative flex flex-col gap-6", className)}>
      <div className="absolute -top-1 inset-x-0 h-1 bg-gradient-to-r from-primary via-indigo-500 to-cyan-400 rounded-t-xl z-20" />
      
      <div className="relative overflow-hidden rounded-xl border border-border/80 bg-card/65 backdrop-blur-md p-6 shadow-xl transition-all duration-300">
        <form
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          {...props}
        >
          <FieldGroup className="space-y-4">
            <div className="flex flex-col items-center gap-1 text-center pb-2">
              <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
              <p className="text-xs text-balance text-muted-foreground">
                Get started today and build forms in seconds
              </p>
            </div>

            {/* Full Name */}
            <Field className="space-y-1.5">
              <FieldLabel htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="h-10 border-border/60 bg-background/50 transition-all duration-200 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
                {...register("name", { required: "Full name is required" })}
              />
              {errors.name && (
                <FieldDescription className="text-[11px] text-destructive font-medium flex items-center gap-1 mt-1 animate-in fade-in slide-in-from-top-1">
                  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {errors.name.message}
                </FieldDescription>
              )}
            </Field>

            {/* Email */}
            <Field className="space-y-1.5">
              <FieldLabel htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="h-10 border-border/60 bg-background/50 transition-all duration-200 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Enter a valid email",
                  },
                })}
              />
              {errors.email ? (
                <FieldDescription className="text-[11px] text-destructive font-medium flex items-center gap-1 mt-1 animate-in fade-in slide-in-from-top-1">
                  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {errors.email.message}
                </FieldDescription>
              ) : (
                <FieldDescription className="text-[10px] text-muted-foreground/75 leading-normal mt-1">
                  We will use this to contact you and verify your identity.
                </FieldDescription>
              )}
            </Field>

            {/* Password */}
            <Field className="space-y-1.5">
              <FieldLabel htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="Minimum 8 characters"
                className="h-10 border-border/60 bg-background/50 transition-all duration-200 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Must be at least 8 characters long",
                  },
                })}
              />
              {errors.password ? (
                <FieldDescription className="text-[11px] text-destructive font-medium flex items-center gap-1 mt-1 animate-in fade-in slide-in-from-top-1">
                  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {errors.password.message}
                </FieldDescription>
              ) : (
                <FieldDescription className="text-[10px] text-muted-foreground/75 leading-normal mt-1">
                  Must contain letters, numbers and special symbols.
                </FieldDescription>
              )}
            </Field>

            {/* Confirm Password */}
            <Field className="space-y-1.5">
              <FieldLabel htmlFor="confirm-password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Confirm Password</FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Re-enter password"
                className="h-10 border-border/60 bg-background/50 transition-all duration-200 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              {errors.confirmPassword ? (
                <FieldDescription className="text-[11px] text-destructive font-medium flex items-center gap-1 mt-1 animate-in fade-in slide-in-from-top-1">
                  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {errors.confirmPassword.message}
                </FieldDescription>
              ) : (
                <FieldDescription className="text-[10px] text-muted-foreground/75 leading-normal mt-1">
                  Double check your spelling.
                </FieldDescription>
              )}
            </Field>

            {/* Signup Button */}
            <Field className="pt-2">
              <Button type="submit" className="w-full h-11 font-semibold bg-primary hover:bg-primary/95 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all cursor-pointer">
                Create new account
              </Button>
            </Field>

            <FieldSeparator className="text-muted-foreground/60">Or sign up with</FieldSeparator>

            {/* OAuth Sign up */}
            <Field className="space-y-3">
              <Button variant="outline" type="button" className="w-full h-11 border-border/80 bg-background/30 hover:bg-muted font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer">
                <svg className="size-4 text-foreground" viewBox="0 0 24 24">
                  <path
                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                    fill="currentColor"
                  />
                </svg>
                <span>GitHub account</span>
              </Button>
              <FieldDescription className="px-6 text-center text-sm text-muted-foreground mt-4">
                Already have an account?{" "}
                <a href="/login" className="font-semibold text-primary hover:underline underline-offset-4">
                  Sign in
                </a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  )
}