import { unwrapResponse } from "@/lib/api/api-client";
import api from "@/lib/api/api-client";
import type { User } from "@/types/domain";
import type { ProfileInput } from "@/features/users/user.validation";
import { optionalTrimmedString } from "@/lib/utils/payload";

const sanitizeProfilePayload = (payload: ProfileInput) => ({
  name: payload.name.trim(),
  email: optionalTrimmedString(payload.email),
  profileImage: optionalTrimmedString(payload.profileImage),
});

export const userApi = {
  getMe: () => unwrapResponse<User>(api.get("/users/me")),
  updateMe: (payload: ProfileInput) =>
    unwrapResponse<User>(api.patch("/users/me", sanitizeProfilePayload(payload))),
};
