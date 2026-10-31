
"use client";

import {
  Activity,
  AtSign,
  FileText,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { useMe } from "@/features/user/hooks/use-me";

import { ErrorState } from "@/components/common/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function formatLabel(value: string) {
  return value
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function SettingsProfileSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading profile">
      <Card>
        <CardContent className="flex items-center gap-5 p-6">
          <Skeleton className="size-20 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-48 max-w-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-40 max-w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

type ProfileFieldProps = {
  icon: React.ElementType;
  label: string;
  value: string;
};

function ProfileField({ icon: Icon, label, value }: ProfileFieldProps) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon size={17} />
      </div>

      <div className="min-w-0 space-y-1">
        <p className="text-xs font-medium text-muted-foreground">
          {label}
        </p>
        <p className="break-words text-sm font-medium text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}

export function SettingsProfile() {
  const { data: user, isPending, isError, error, refetch } = useMe();

  if (isPending) {
    return <SettingsProfileSkeleton />;
  }

  if (isError || !user) {
    return (
      <ErrorState
        title="Unable to load your profile"
        description={
          error?.message ?? "Your account information could not be loaded."
        }
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile overview */}
      <Card>
        <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
          <Avatar size="lg" className="size-20 text-xl">
            <AvatarImage
              src={user.avatar ?? undefined}
              alt={user.displayName}
            />
            <AvatarFallback>
              {getInitials(user.displayName) || <UserRound />}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 space-y-2">
            <h2 className="break-words text-xl font-semibold tracking-tight">
              {user.displayName}
            </h2>

            <p className="break-words text-sm text-muted-foreground">
              @{user.username}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">
                {formatLabel(user.role)}
              </Badge>

              <Badge variant="outline">
                {formatLabel(user.accountStatus)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Your personal account details associated with PromptLok.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6 sm:grid-cols-2">
          <ProfileField
            icon={UserRound}
            label="Display Name"
            value={user.displayName}
          />

          <ProfileField
            icon={AtSign}
            label="Username"
            value={`@${user.username}`}
          />

          <ProfileField
            icon={Mail}
            label="Email Address"
            value={user.email}
          />

          <ProfileField
            icon={ShieldCheck}
            label="Account Role"
            value={formatLabel(user.role)}
          />

          <ProfileField
            icon={Activity}
            label="Account Status"
            value={formatLabel(user.accountStatus)}
          />

          <ProfileField
            icon={FileText}
            label="Bio"
            value={user.bio?.trim() || "No bio added yet."}
          />
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Your profile information is currently read-only.
      </p>
    </div>
  );
}
