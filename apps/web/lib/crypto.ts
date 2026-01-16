import crypto from "crypto";

/**
 * Normalize content to avoid hash mismatch
 * (trim spaces, normalize line breaks)
 */
export function normalizeContent(content: string) {
  return content.trim().replace(/\r\n/g, "\n");
}

export function hashContent(content: string) {
  return crypto
    .createHash("sha256")
    .update(content)
    .digest("hex");
}
