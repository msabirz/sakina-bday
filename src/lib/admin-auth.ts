import { createHash } from "node:crypto";
import { missionConfig } from "@/lib/config";

/** Server-side password check shared by the admin API routes. */
export function isValidAdminPassword(password: unknown): boolean {
  if (typeof password !== "string" || password.length === 0) return false;
  const hash = createHash("sha256").update(password).digest("hex");
  return hash === missionConfig.adminPasswordHash;
}
