"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authApi } from "@/features/auth/auth.api";
import { changePasswordSchema } from "@/features/auth/auth.validation";
import { userApi } from "@/features/users/user.api";
import { profileSchema } from "@/features/users/user.validation";
import { applyZodErrors } from "@/lib/utils/forms";
import { useAuth } from "@/providers/auth-provider";

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const profileForm = useForm({
    defaultValues: { name: "", email: "", profileImage: "" },
  });
  const passwordForm = useForm({ defaultValues: { oldPassword: "", newPassword: "" } });
  const profileImage = profileForm.watch("profileImage") || "";

  useEffect(() => {
    profileForm.reset({
      name: user?.name || "",
      email: user?.email || "",
      profileImage: user?.profileImage || "",
    });
  }, [profileForm, user]);

  const submitProfile = profileForm.handleSubmit(async (values) => {
    const result = profileSchema.safeParse(values);
    if (!result.success) {
      applyZodErrors(result.error as never, profileForm.setError as never);
      return;
    }
    await userApi.updateMe(result.data);
  });

  const submitPassword = passwordForm.handleSubmit(async (values) => {
    const result = changePasswordSchema.safeParse(values);
    if (!result.success) {
      applyZodErrors(result.error as never, passwordForm.setError as never);
      return;
    }
    await authApi.changePassword(result.data);
    passwordForm.reset();
  });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="space-y-4">
        <h2 className="text-lg font-semibold">Profile</h2>
        <form className="space-y-3" onSubmit={submitProfile}>
          <Input label="Name" {...profileForm.register("name")} />
          <Input label="Email" {...profileForm.register("email")} />
          <input type="hidden" {...profileForm.register("profileImage")} />
          <ImageUploadField
            folder="profiles"
            helperText="Admin profile images upload directly to S3 and the saved form value remains the object key only."
            label="Profile Image"
            onChange={(nextValue) =>
              profileForm.setValue("profileImage", nextValue, { shouldDirty: true, shouldValidate: true })
            }
            previewUrl={user?.profileImageUrl || ""}
            value={profileImage}
          />
          <Button type="submit">Save Profile</Button>
        </form>
      </Card>
      <Card className="space-y-4">
        <h2 className="text-lg font-semibold">Change Password</h2>
        <form className="space-y-3" onSubmit={submitPassword}>
          <Input label="Current Password" type="password" {...passwordForm.register("oldPassword")} />
          <Input label="New Password" type="password" {...passwordForm.register("newPassword")} />
          <Button type="submit">Update Password</Button>
        </form>
      </Card>
    </div>
  );
}
