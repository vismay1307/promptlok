"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

export function SonnerProvider() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      position="bottom-right"
      duration={4000}
      closeButton
      richColors={false}
      toastOptions={{
        style: {
          background: "var(--popover)",
          color: "var(--popover-foreground)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          fontFamily: "var(--font-poppins)",
        },
      }}
    />
  );
}