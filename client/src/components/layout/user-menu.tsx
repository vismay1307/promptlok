"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { ChevronDown, LogOut, Settings } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu() {
  const { isLoaded, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const [isSigningOut, setIsSigningOut] = useState(false);

  const displayName =
    user?.fullName ??
    user?.firstName ??
    "PromptLok User";

  const email =
    user?.primaryEmailAddress?.emailAddress ??
    "No email available";

  const initials =
    displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "PL";

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      await signOut({
        redirectUrl: "/sign-in",
      });
    } catch {
      toast.error("Unable to sign out. Please try again.");
      setIsSigningOut(false);
    }
  }

  if (!isLoaded || !user) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Avatar>
          <AvatarFallback>...</AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isSigningOut}
        render={
          <Button
            type="button"
            variant="ghost"
            className="h-auto max-w-[220px] gap-2 px-2 py-1.5"
            aria-label="Open user menu"
          >
            <Avatar className="size-9">
              <AvatarImage src={user.imageUrl} alt={displayName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <span className="hidden min-w-0 text-left sm:block">
              <span className="block truncate text-sm font-medium">
                {displayName}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {email}
              </span>
            </span>

            <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
          </Button>
        }
      />

      <DropdownMenuContent align="end" sideOffset={8} className="w-60">
        <DropdownMenuLabel className="font-normal">
          <p className="truncate text-sm font-semibold">{displayName}</p>
          <p className="truncate text-xs text-muted-foreground">{email}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => router.push("/settings")}>
          <Settings />
          Account settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          disabled={isSigningOut}
          onClick={() => void handleSignOut()}
        >
          <LogOut />
          {isSigningOut ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}