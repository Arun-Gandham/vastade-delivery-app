import { loginSchema, registerSchema } from "@/features/auth/auth.validation";

describe("auth validation", () => {
  it("accepts a valid login payload", () => {
    expect(
      loginSchema.safeParse({
        mobile: "9876543210",
        password: "Password1",
        deviceType: "WEB",
      }).success
    ).toBe(true);
  });

  it("rejects mismatched register passwords", () => {
    const result = registerSchema.safeParse({
      name: "Arun",
      mobile: "9876543210",
      email: "arun@example.com",
      password: "Password1",
      confirmPassword: "Password2",
    });

    expect(result.success).toBe(false);
  });
});
