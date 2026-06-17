import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://studyos.app"

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "StudyOS - Study Smarter with AI",
  description: "AI-powered study platform to help students study faster and smarter",
  applicationName: "StudyOS",
  keywords: ["AI study app", "flashcards", "study planner", "exam prep", "AI tutor"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: appUrl,
    title: "StudyOS - Study Smarter with AI",
    description: "Turn notes into summaries, flashcards, mind maps, and exam-ready practice.",
    siteName: "StudyOS",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "StudyOS" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "StudyOS - Study Smarter with AI",
    description: "AI-powered platform for summaries, flashcards, and exam prep.",
    images: ["/logo.png"],
  },
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    apple: "/logo.png",
  },
}

import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster richColors position="bottom-right" />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
