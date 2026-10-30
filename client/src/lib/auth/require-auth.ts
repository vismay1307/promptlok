import { auth } from "@clerk/nextjs/server";

export async function requireAuth() {
  await auth.protect();
}