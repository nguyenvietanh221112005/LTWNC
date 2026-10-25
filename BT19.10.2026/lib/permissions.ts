import type { Role } from "./role";

export type Action = "product:write" | "user:manage";

const permissions: Record<Role, Action[]> = {
  user: [],
  admin: ["product:write", "user:manage"],
};

export function can(role: Role, action: Action): boolean {
  return permissions[role].includes(action);
}
