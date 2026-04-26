"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRegisterMutation } from "@/features/auth/auth.hooks";
import { type RegisterInput, registerSchema } from "@/features/auth/auth.validation";
import { getErrorMessage } from "@/lib/utils/errors";
import { applyZodErrors } from "@/lib/utils/forms";

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegisterMutation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterInput>();

  const onSubmit = handleSubmit(async (values) => {
    const result = registerSchema.safeParse(values);
    if (!result.success) {
      applyZodErrors(result.error, setError);
      return;
    }

    try {
      await registerMutation.mutateAsync(result.data);
      router.push("/login");
    } catch (error) {
      setError("root", { message: getErrorMessage(error, "Registration failed") });
    }
  });

  return (
    <main className="app-shell flex min-h-screen items-center justify-center py-10">
      <Card className="w-full max-w-lg space-y-5 p-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">Create Account</p>
          <h1 className="text-2xl font-bold">Customer registration</h1>
        </div>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <div className="md:col-span-2">
            <Input label="Full Name" error={errors.name?.message} {...register("name")} />
          </div>
          <Input label="Mobile" error={errors.mobile?.message} {...register("mobile")} />
          <Input label="Email" error={errors.email?.message} {...register("email")} />
          <Input label="Password" type="password" error={errors.password?.message} {...register("password")} />
          <Input label="Confirm Password" type="password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
          {errors.root?.message ? <p className="md:col-span-2 text-sm text-[var(--color-danger)]">{errors.root.message}</p> : null}
          <div className="md:col-span-2 flex items-center gap-3">
            <Button loading={registerMutation.isPending} type="submit">
              Register
            </Button>
            <Link href="/login" className="text-sm text-[var(--color-text-muted)]">
              Already have an account?
            </Link>
          </div>
        </form>
      </Card>
    </main>
  );
}
