"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Home,
  BarChart3,
  Settings,
  Plus,
  FileText,
  Moon,
  Sun,
  CreditCard,
} from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

interface Document {
  id: string;
  title: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  // Global Cmd/Ctrl+K opens the palette.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Allow other components to open the palette via a custom event.
  useEffect(() => {
    const opener = () => setOpen(true);
    window.addEventListener("open-command-palette", opener);
    return () => window.removeEventListener("open-command-palette", opener);
  }, []);

  // Lazily fetch documents when the palette first opens.
  useEffect(() => {
    if (!open || documents.length > 0) return;
    fetch("/api/documents")
      .then((res) => res.json())
      .then((data) => setDocuments(data.documents || []))
      .catch(() => {});
  }, [open, documents.length]);

  const run = useCallback((action: () => void) => {
    setOpen(false);
    action();
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search documents or run a command..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => run(() => router.push("/dashboard/new"))}>
            <Plus />
            <span>New document</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => run(() => router.push("/dashboard"))}>
            <Home />
            <span>Home</span>
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push("/dashboard/analytics"))}>
            <BarChart3 />
            <span>Analytics</span>
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push("/dashboard/settings"))}>
            <Settings />
            <span>Settings</span>
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push("/pricing"))}>
            <CreditCard />
            <span>Pricing</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Preferences">
          <CommandItem
            onSelect={() => run(() => setTheme(isDark ? "light" : "dark"))}
          >
            {isDark ? <Sun /> : <Moon />}
            <span>Toggle theme</span>
          </CommandItem>
        </CommandGroup>

        {documents.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Documents">
              {documents.slice(0, 20).map((doc) => (
                <CommandItem
                  key={doc.id}
                  value={`document ${doc.title}`}
                  onSelect={() => run(() => router.push(`/dashboard/${doc.id}`))}
                >
                  <FileText />
                  <span className="truncate">{doc.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
