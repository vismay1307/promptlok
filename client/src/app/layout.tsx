import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Poppins } from "next/font/google";

import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SonnerProvider } from "@/components/providers/sonner-provider";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "PromptLok",
  description: "AI-agnostic prompt management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={poppins.variable}
        suppressHydrationWarning
      >
        <body className="font-sans">
          <ThemeProvider>
  <TooltipProvider>
    <QueryProvider>
      {children}
    </QueryProvider>

    <SonnerProvider />
  </TooltipProvider>
</ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}