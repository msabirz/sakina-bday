/**
 * Client-side SHA-256 via the Web Crypto API. Used only to gate the admin
 * panel behind a password. This is NOT real security — it just keeps the
 * password out of plaintext in the repo. Anyone with devtools access to a
 * deployed build can bypass this. Do not put anything truly sensitive
 * behind it.
 */
export async function sha256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
