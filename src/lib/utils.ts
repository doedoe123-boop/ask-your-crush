import { customAlphabet } from "nanoid";

// Create a custom nanoid with URL-safe characters, excluding ambiguous ones
const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  10,
);

export function generateSlug(): string {
  return nanoid();
}

export function formatMessage(
  message: string,
  recipientName?: string | null,
): string {
  if (!recipientName) {
    return message.replace(/\{\{name\}\}/g, "");
  }
  return message.replace(/\{\{name\}\}/g, recipientName);
}
