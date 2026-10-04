import type { users } from "../db/schema/users.schema.js";

declare global {
  namespace Express {
    interface Request {
      user: typeof users.$inferSelect | null;

      auth?: {
        clerkUserId: string;
      };
    }
  }
}

export {};