"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { apiConfig } from "@/config/api.config";
import { roleHomePath } from "@/config/roles.config";
import { useLoginMutation } from "@/features/auth/auth.hooks";
import { type LoginInput, loginSchema } from "@/features/auth/auth.validation";
import { applyZodErrors } from "@/lib/utils/forms";
import { getErrorMessage } from "@/lib/utils/errors";
import { authStorage } from "@/lib/storage/auth-storage";
import { useAuth } from "@/providers/auth-provider";

function LoginPageContent() {
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setSession } = useAuth();
  const loginMutation = useLoginMutation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    defaultValues: {
      mobile: "",
      password: "",
      deviceType: "WEB",
    },
  });

  useEffect(() => {
    let active = true;
    const healthUrl = apiConfig.baseURL.replace(/\/api\/v1$/, "/health");

    fetch(healthUrl)
      .then((response) => {
        if (!active) return;
        setBackendStatus(response.ok ? "online" : "offline");
      })
      .catch(() => {
        if (!active) return;
        setBackendStatus("offline");
      });

    return () => {
      active = false;
    };
  }, []);

  const submitLogin = handleSubmit(async (values) => {
    const result = loginSchema.safeParse(values);
    if (!result.success) {
      applyZodErrors(result.error, setError);
      return;
    }

    try {
      const session = await loginMutation.mutateAsync(result.data);
      authStorage.saveSession(session);
      setSession(session);
      const redirect = searchParams.get("redirect");
      router.push(redirect || roleHomePath[session.user.role]);
    } catch (error) {
      setError("root", { message: getErrorMessage(error, "Login failed") });
    }
  });

  return (
    <main className="app-shell flex min-h-screen items-center justify-center py-10">
      <Card className="w-full max-w-md space-y-5 p-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">Sign In</p>
          <h1 className="text-2xl font-bold">Access your role dashboard</h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            One login form supports customer, captain, shop owner, admin, and super admin roles.
          </p>
        </div>
        <div
          className={`rounded-[var(--radius-md)] px-3 py-2 text-xs ${
            backendStatus === "online"
              ? "bg-[rgba(31,157,85,0.12)] text-[var(--color-success)]"
              : backendStatus === "offline"
                ? "bg-[rgba(200,30,30,0.12)] text-[var(--color-danger)]"
                : "bg-[var(--color-muted)] text-[var(--color-text-muted)]"
          }`}
        >
          {backendStatus === "online"
            ? "Backend reachable"
            : backendStatus === "offline"
              ? `Backend unreachable at ${apiConfig.baseURL}`
              : "Checking backend connection..."}
        </div>
        <form className="space-y-4" noValidate onSubmit={submitLogin}>
          <Input label="Mobile" inputMode="numeric" placeholder="9876543210" error={errors.mobile?.message} {...register("mobile")} />
          <Input label="Password" type="password" placeholder="Enter your password" error={errors.password?.message} {...register("password")} />
          {errors.root?.message ? <p className="text-sm text-[var(--color-danger)]">{errors.root.message}</p> : null}
          <Button className="w-full" loading={loginMutation.isPending} type="submit">
            Login
          </Button>
        </form>
        <div className="flex flex-col gap-2 text-sm text-[var(--color-text-muted)]">
          <Link href="/register">Create a customer account</Link>
          <Link href="/forgot-password">Need password help?</Link>
        </div>
      </Card>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="app-shell py-10">Loading login...</main>}>
      <LoginPageContent />
    </Suspense>
  );
}
