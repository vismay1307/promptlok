
"use client";

import { useState } from "react";
import {
  FileText,
  LayoutDashboard,
  Settings,
  Sparkles,
  MoreHorizontal,
  Plus,
  Check,
} from "lucide-react";
import { toast } from "sonner";

import { ThemeToggle } from "@/components/common/theme-toggle";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { PageLoadingSkeleton } from "@/components/common/page-loading-skeleton";
import { ConfirmDialog } from "@/components/common/confirm-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  const [category, setCategory] = useState("writing");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl space-y-12 px-5 py-10 sm:px-8">

        {/* Header */}
        <PageHeader
          eyebrow="PromptLok / FE-2.6"
          title="Design System Gallery"
          description="A visual showcase of PromptLok's reusable components, design tokens and interaction patterns."
          actions={
            <>
              <Badge variant="outline">Development Preview</Badge>
              <ThemeToggle />
            </>
          }
        />

        {/* Demo notice */}
        <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
          <Sparkles className="mt-0.5 size-5 text-orange-500" />
          <div>
            <p className="font-medium">Welcome to the design system</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Switch between light and dark themes to review all components.
              Interactive actions on this page are demonstrations only.
            </p>
          </div>
        </div>

        {/* Navigation preview */}
        <Section
          title="Navigation & Actions"
          description="Primary application navigation and common actions."
        >
          <Card>
            <CardContent className="flex flex-wrap items-center gap-3 py-4">
              <Button variant="default">
                <Plus /> New Prompt
              </Button>
              <Button variant="outline">
                <LayoutDashboard /> Dashboard
              </Button>
              <Button variant="secondary">
                <Settings /> Settings
              </Button>
              <Button variant="ghost">
                <FileText /> My Prompts
              </Button>
              <Button variant="destructive">
                Delete
              </Button>
              <Button variant="outline" size="icon" aria-label="More actions">
                <MoreHorizontal />
              </Button>
            </CardContent>
          </Card>
        </Section>

        {/* Color tokens */}
        <Section
          title="Color Palette"
          description="Cream light mode and black/gray dark mode with blue, orange and yellow accents."
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { name: "Background", color: "bg-background", border: true },
              { name: "Card", color: "bg-card", border: true },
              { name: "Muted", color: "bg-muted", border: true },
              { name: "Primary Blue", color: "bg-blue-600" },
              { name: "Orange", color: "bg-orange-500" },
              { name: "Yellow", color: "bg-yellow-400" },
            ].map((item) => (
              <div key={item.name} className="space-y-2">
                <div
                  className={`h-16 rounded-xl ${item.color} ${
                    item.border ? "border border-border" : ""
                  }`}
                />
                <p className="text-xs text-muted-foreground">{item.name}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Typography */}
        <Section
          title="Typography"
          description="Poppins is the primary typeface across the application."
        >
          <Card>
            <CardContent className="space-y-4 py-6">
              <h1 className="text-4xl font-bold tracking-tight">
                PromptLok
              </h1>
              <h2 className="text-2xl font-semibold">
                Manage your AI prompts.
              </h2>
              <p className="text-base">
                Create, organize and manage your reusable AI prompts in one place.
              </p>
              <p className="text-sm text-muted-foreground">
                Supporting text, descriptions and metadata use muted foreground colors.
              </p>
              <p className="text-xs text-muted-foreground">
                SMALL LABEL · 12PX · UPPERCASE
              </p>
            </CardContent>
          </Card>
        </Section>

        {/* Buttons */}
        <Section title="Buttons" description="Different action hierarchy and states.">
          <Card>
            <CardContent className="flex flex-wrap gap-3 py-6">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button disabled>Disabled</Button>
              <Button size="sm">Small</Button>
              <Button size="lg">Large</Button>
            </CardContent>
          </Card>
        </Section>

        {/* Forms */}
        <Section title="Form Controls" description="Input, textarea, label and select.">
          <Card>
            <CardContent className="grid gap-6 py-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="demo-title">Prompt title</Label>
                <Input id="demo-title" placeholder="Enter a prompt title" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="demo-description">Description</Label>
                <Input
                  id="demo-description"
                  placeholder="Short description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="demo-category">Category</Label>
                <Select
                  value={category}
                  onValueChange={(value) => setCategory(value ?? "writing")}
                >
                  <SelectTrigger id="demo-category" className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="writing">Writing</SelectItem>
                    <SelectItem value="coding">Coding</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Disabled input</Label>
                <Input disabled placeholder="Not editable" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="demo-content">Prompt content</Label>
                <Textarea
                  id="demo-content"
                  placeholder="Write your prompt here..."
                  rows={5}
                />
                <p className="text-xs text-muted-foreground">
                  Multiline content editor preview.
                </p>
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* Badges */}
        <Section title="Badges" description="Status labels and categories.">
          <Card>
            <CardContent className="flex flex-wrap gap-3 py-6">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Private</Badge>
              <Badge variant="destructive">Archived</Badge>
              <Badge className="bg-orange-500 text-white hover:bg-orange-600">
                Featured
              </Badge>
              <Badge className="bg-yellow-400 text-black hover:bg-yellow-500">
                Draft
              </Badge>
            </CardContent>
          </Card>
        </Section>

        {/* Cards */}
        <Section title="Cards" description="Reusable content surfaces.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {["Writing Assistant", "Code Generator", "Research Helper"].map(
              (name, index) => (
                <Card key={name}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">Private</Badge>
                      <FileText className="size-5 text-muted-foreground" />
                    </div>
                    <CardTitle>{name}</CardTitle>
                    <CardDescription>
                      Sample prompt card for visual inspection.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      A reusable prompt designed to demonstrate card layout,
                      spacing and content hierarchy.
                    </p>
                  </CardContent>
                  <CardFooter className="justify-between">
                    <span className="text-xs text-muted-foreground">
                      Sample category {index + 1}
                    </span>
                    <Button variant="ghost" size="sm">View</Button>
                  </CardFooter>
                </Card>
              ),
            )}
          </div>
        </Section>

        {/* Skeleton */}
        <Section title="Loading States" description="Skeleton patterns for async content.">
          <Card>
            <CardContent className="space-y-4 py-6">
              <div className="flex gap-3">
                <Skeleton className="size-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
              <Skeleton className="h-24 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </CardContent>
          </Card>
          <PageLoadingSkeleton count={3} />
        </Section>

        {/* Avatar */}
        <Section title="Avatars" description="User identity and profile representation.">
          <Card>
            <CardContent className="flex items-center gap-4 py-6">
              <Avatar>
                <AvatarFallback>VT</AvatarFallback>
              </Avatar>
              <Avatar className="size-12">
                <AvatarFallback>PL</AvatarFallback>
              </Avatar>
              <Avatar className="size-14">
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
            </CardContent>
          </Card>
        </Section>

        {/* Dialogs */}
        <Section title="Dialogs" description="Modal and confirmation patterns.">
          <Card>
            <CardContent className="flex flex-wrap gap-3 py-6">

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger
                  render={<Button variant="outline">Open Dialog</Button>}
                />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dialog Preview</DialogTitle>
                    <DialogDescription>
                      This is a sample PromptLok dialog.
                    </DialogDescription>
                  </DialogHeader>
                  <p className="text-sm text-muted-foreground">
                    Test spacing, typography, background and borders.
                  </p>
                  <DialogFooter>
                    <Button onClick={() => setDialogOpen(false)}>
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogTrigger
                  render={
                    <Button variant="destructive">
                      Alert Dialog Preview
                    </Button>
                  }
                />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete preview?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This is a demonstration only. No real data will be deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      onClick={() => setAlertOpen(false)}
                    >
                      Confirm Preview
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button variant="outline" onClick={() => setConfirmOpen(true)}>
                ConfirmDialog Preview
              </Button>
            </CardContent>
          </Card>
        </Section>

        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Confirm action?"
          description="This is a design-system demonstration. No real operation will take place."
          confirmLabel="Confirm Preview"
          destructive
          onConfirm={() => setConfirmOpen(false)}
        />

        {/* Dropdown */}
        <Section title="Dropdown Menu" description="Contextual action menus.">
          <Card>
            <CardContent className="py-6">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button variant="outline">Prompt Actions</Button>}
                />
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Prompt options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => toast.info("Edit preview")}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Copy preview")}>
                    Copy
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => toast.info("Delete preview")}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        </Section>

        {/* Sheet */}
        <Section title="Sheet / Drawer" description="Responsive mobile-friendly panels.">
          <Card>
            <CardContent className="py-6">
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger
                  render={<Button variant="outline">Open Sheet</Button>}
                />
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>PromptLok Navigation</SheetTitle>
                    <SheetDescription>
                      Preview of a mobile navigation drawer.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex flex-col gap-3 p-4">
                    <Button variant="ghost" className="justify-start">
                      <LayoutDashboard /> Dashboard
                    </Button>
                    <Button variant="ghost" className="justify-start">
                      <FileText /> My Prompts
                    </Button>
                    <Button variant="ghost" className="justify-start">
                      <Settings /> Settings
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </CardContent>
          </Card>
        </Section>

        {/* Tooltip + Popover */}
        <Section title="Tooltip & Popover" description="Helpful contextual interactions.">
          <Card>
            <CardContent className="flex flex-wrap items-center gap-4 py-6">
              <Tooltip>
                <TooltipTrigger
                  render={<Button variant="outline" size="sm">Hover me</Button>}
                />
                <TooltipContent>
                  Helpful contextual information
                </TooltipContent>
              </Tooltip>

              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger
                  render={<Button variant="outline">Open Popover</Button>}
                />
                <PopoverContent>
                  <PopoverHeader>
                    <PopoverTitle>Prompt Information</PopoverTitle>
                    <PopoverDescription>
                      Contextual information preview.
                    </PopoverDescription>
                  </PopoverHeader>
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>
        </Section>

        {/* Empty State */}
        <Section title="Empty State" description="For pages without available content.">
          <EmptyState
            icon={<FileText />}
            title="No prompts yet"
            description="Create your first prompt to start building your personal prompt library."
            action={
              <Button onClick={() => toast.info("Create prompt preview")}>
                <Plus /> Create your first prompt
              </Button>
            }
          />
        </Section>

        {/* Error State */}
        <Section title="Error State" description="Consistent error feedback and recovery.">
          <ErrorState
            title="Unable to load prompts"
            description="Something went wrong while loading the content. Please try again."
            onRetry={() => toast.success("Retry action preview")}
          />
        </Section>

        {/* Page Header */}
        <Section title="Page Header" description="Shared heading and action layout.">
          <Card>
            <CardContent className="py-6">
              <PageHeader
                eyebrow="Your Library"
                title="My Prompts"
                description="Manage and organize your saved AI prompts."
                actions={
                  <Button>
                    <Plus /> New Prompt
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </Section>

        {/* Sonner */}
        <Section title="Toast Notifications" description="Application feedback through Sonner.">
          <Card>
            <CardContent className="flex flex-wrap gap-3 py-6">
              <Button onClick={() => toast.success("Changes saved successfully!")}>
                <Check /> Success
              </Button>
              <Button
                variant="destructive"
                onClick={() => toast.error("Something went wrong.")}
              >
                Error
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.info("This is an informational message.")}
              >
                Info
              </Button>
            </CardContent>
          </Card>
        </Section>

        {/* Footer */}
        <footer className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
          PromptLok Design System · FE-2.6 · Development Preview
        </footer>
      </div>
    </main>
  );
}
