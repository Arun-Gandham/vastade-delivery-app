"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CustomerAppShell } from "@/components/layout/customer-app-shell";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { PageContainer } from "@/components/shared/page-container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { userApi } from "@/features/users/user.api";
import { type ProfileInput, profileSchema } from "@/features/users/user.validation";
import { applyZodErrors } from "@/lib/utils/forms";
import { useAuth } from "@/providers/auth-provider";

export default function CustomerProfilePage() {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({
    defaultValues: { name: "", email: "", profileImage: "" },
  });
  const profileImage = watch("profileImage") || "";

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email || "",
        profileImage: user.profileImage || "",
      });
    }
  }, [reset, user]);

  const onSubmit = handleSubmit(async (values) => {
    const result = profileSchema.safeParse(values);
    if (!result.success) {
      applyZodErrors(result.error, setError);
      return;
    }
    await userApi.updateMe(result.data);
  });

  return (
    <CustomerAppShell>
      <PageContainer title="Profile" description="Update your customer identity and contact details.">
        <Card className="max-w-xl space-y-4">
          <form className="space-y-4" onSubmit={onSubmit}>
            <Input label="Name" error={errors.name?.message} {...register("name")} />
            <Input label="Email" error={errors.email?.message} {...register("email")} />
            <input type="hidden" {...register("profileImage")} />
            <ImageUploadField
              error={errors.profileImage?.message}
              folder="profiles"
              helperText="Profile images upload directly to S3. Existing saved images stay visible while editing."
              label="Profile Image"
              onChange={(nextValue) => setValue("profileImage", nextValue, { shouldDirty: true, shouldValidate: true })}
              previewUrl={user?.profileImageUrl || ""}
              value={profileImage}
            />
            <Button loading={isSubmitting} type="submit">
              Save Profile
            </Button>
          </form>
        </Card>
      </PageContainer>
    </CustomerAppShell>
  );
}
