import { unwrapResponse } from "@/lib/api/api-client";
import api from "@/lib/api/api-client";
import type { AuthSession, User } from "@/types/domain";
import type {
  CaptainRegisterInput,
  ChangePasswordInput,
  LoginInput,
  RegisterInput,
} from "@/features/auth/auth.validation";
import { optionalTrimmedString } from "@/lib/utils/payload";

export const authApi = {
  login: (payload: LoginInput) => unwrapResponse<AuthSession>(api.post("/auth/login", payload)),
  registerCustomer: ({ confirmPassword: _confirmPassword, email, ...payload }: RegisterInput) =>
    unwrapResponse<User>(
      api.post("/auth/customer/register", {
        ...payload,
        email: optionalTrimmedString(email),
      })
    ),
  registerCaptain: (payload: CaptainRegisterInput) =>
    unwrapResponse<User>(api.post("/captains/register", payload)),
  getMe: () => unwrapResponse<User>(api.get("/users/me")),
  logout: (refreshToken?: string | null) =>
    unwrapResponse<null>(api.post("/auth/logout", { refreshToken })),
  changePassword: (payload: ChangePasswordInput) =>
    unwrapResponse<null>(api.post("/auth/change-password", payload)),
};
