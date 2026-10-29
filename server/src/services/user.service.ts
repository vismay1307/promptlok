import { clerkClient } from "@clerk/express";
import {
  createUser,
  findUserByClerkUserId,
} from "../repositories/user.repository.js";

type DatabaseError = { code?: string; constraint?: string };

const isUniqueViolation = (error: unknown): error is DatabaseError => {
  if (!error || typeof error !== "object") {
    return false;
  }
  const dbError = error as DatabaseError;
  return dbError.code === "23505";
};

const sanitizeUsername = (value: string): string => {
  const cleaned = value
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 40);
  return cleaned;
};

const generateUsername = (
  email: string,
  clerkUserId: string,
  attempt: number,
): string => {
  const emailPrefix = email.split("@")[0] ?? "";
  const baseUsername = sanitizeUsername(emailPrefix);
  if (baseUsername) {
    if (attempt === 0) {
      return baseUsername.slice(0, 50);
    }
    const suffix = `${attempt}${clerkUserId.slice(-4).toLowerCase()}`;
    return `${baseUsername.slice(0, 50 - suffix.length - 1)}_${suffix}`;
  }
  const fallback = `user_${clerkUserId.slice(-8).toLowerCase()}`;
  if (attempt === 0) {
    return fallback;
  }
  return `${fallback.slice(0, 50 - String(attempt).length - 1)}_${attempt}`;
};

const getDisplayName = (
  firstName: string | null,
  lastName: string | null,
): string => {
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  return fullName || "PromptLok User";
};


export const findOrCreateLocalUser = async (clerkUserId: string) => {
  /* * STEP 1 * * Check whether the Clerk user already has * a PromptLok database user. */ 
  const existingUser = await findUserByClerkUserId(clerkUserId);
  if (existingUser) {
    return existingUser;
  }
  /* * STEP 2 * * User does not exist locally. * * Fetch the user's profile from Clerk. */ 
  const clerkUser = await clerkClient.users.getUser(clerkUserId);
  const email = clerkUser.primaryEmailAddress?.emailAddress;
  if (!email) {
    throw new Error(
      "Authenticated Clerk user does not have a primary email address.",
    );
  }
  const displayName = getDisplayName(clerkUser.firstName, clerkUser.lastName);
  /* * STEP 3 * * Try creating the user. * * We retry only when username is already taken. */
   for (
    let attempt = 0;
    attempt < 5;
    attempt++
  ) {
    const username = generateUsername(email, clerkUserId, attempt);
    try {
      const newUser = await createUser({
        clerkUserId,
        email,
        username,
        displayName,
        avatar: clerkUser.imageUrl ?? null,
      });
      if (!newUser) {
        throw new Error("Failed to create local user.");
      }
      return newUser;
    } catch (error) {
      /* * PostgreSQL unique violation. * * PostgreSQL error code 23505 means: * unique_violation */
       if (
        !isUniqueViolation(error)
      ) {
        throw error;
      }
      /* * RACE CONDITION: * * Request A: * SELECT → user not found * * Request B: * SELECT → user not found *
       * Request A: * INSERT → success * * Request B: * INSERT → clerkUserId unique violation * * In this situation, 
      Request B should * fetch the user created by Request A. */ 
      if (
        error.constraint === "users_clerk_user_id_idx"
      ) {
        const raceWinnerUser = await findUserByClerkUserId(clerkUserId);
        if (raceWinnerUser) {
          return raceWinnerUser;
        }
        throw new Error(
          "User creation conflicted, but the existing user could not be found.",
        );
      }

      /* * Username already exists. * * Try again with another username. */ if (
        error.constraint === "users_username_idx"
      ) {
        continue;
      }
      /* * Email already exists. * * We do NOT silently attach this Clerk identity * to another local account. */
       if (
        error.constraint === "users_email_idx"
      ) {
        throw new Error(
          "A PromptLok user already exists with this email address.",
        );
      }
      /* * Some other unique constraint failed. * * Do not hide it. */ throw error;
    }
  }
  throw new Error(
    "Unable to generate a unique username after multiple attempts.",
  );
};

export const getExistingLocalUser = async (clerkUserId: string) => {
  return await findUserByClerkUserId(clerkUserId);
};