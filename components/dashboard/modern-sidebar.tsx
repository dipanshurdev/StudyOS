"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Settings,
  FileText,
  BarChart3,
  Home,
  Sparkles,
  Crown,
  User,
  LogOut,
  Search,
  ChevronDown,
  MoreHorizontal,
  Keyboard,
  HelpCircle,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateDocumentDialog } from "./create-document-dialog";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Document {
  id: string;
  title: string;
  updated_at: string | Date;
  created_at: string | Date;
}

interface ModernSidebarProps {
  user?: { name?: string; email?: string; plan_type?: string };
}

export function ModernSidebar({ user }: ModernSidebarProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Keyboard shortcut: Cmd/Ctrl+N to create a new document.
  // Cmd/Ctrl+K is handled globally by the command palette.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        setOpenDialog(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/documents");
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFormattedDate = (date: string | Date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleDocumentCreated = (newDoc: Document) => {
    setDocuments((prev) => [newDoc, ...prev]);
    setOpenDialog(false);
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navItems = [
    { href: "/dashboard", label: "Home", icon: Home, shortcut: "H" },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3, shortcut: "A" },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname?.startsWith(href);
  };

  const isPro = user?.plan_type === "pro";

  return (
    <TooltipProvider delayDuration={400}>
      <div
        className={cn(
          "w-[240px] flex flex-col h-screen sticky top-0 border-r",
          "bg-[var(--sidebar-bg)] border-[var(--sidebar-border)]",
          "transition-all duration-200"
        )}
      >
        {/* ── Logo ─────────────────────────────────────────── */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-[var(--sidebar-border)]">
          <Link href="/" className="flex items-center gap-2.5 group min-w-0">
            <div className="w-7 h-7 shrink-0 flex items-center justify-center rounded-none bg-muted border border-border group-hover:border-foreground/20 transition-colors">
              <img
                src="/logo.png"
                alt="StudyOS"
                className="w-4 h-4 object-contain"
              />
            </div>
            <span className="font-bold text-[15px] text-foreground tracking-tight truncate">
              Study<span className="text-primary">OS</span>
            </span>
          </Link>
          <ThemeToggle className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground" />
        </div>

        {/* ── New Document ─────────────────────────────────── */}
        <div className="px-3 pt-3 pb-2">
          <CreateDocumentDialog
            open={openDialog}
            onOpenChange={setOpenDialog}
            onDocumentCreated={handleDocumentCreated}
          >
            <Button
              size="sm"
              className="w-full h-8 gap-1.5 text-xs font-semibold rounded-none shadow-none justify-start px-2.5"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              New document
              <kbd className="ml-auto text-[9px] font-mono opacity-60 bg-primary-foreground/10 px-1 py-0.5 rounded">
                ⌘N
              </kbd>
            </Button>
          </CreateDocumentDialog>
        </div>

        {/* ── Search ───────────────────────────────────────── */}
        <div className="px-3 pb-2">
          <div
            className={cn(
              "flex items-center gap-2 h-8 px-2.5 rounded-none border text-xs transition-all duration-150",
              isSearchFocused
                ? "border-ring bg-background ring-1 ring-ring/30"
                : "border-border/60 bg-muted/30 hover:bg-muted/60"
            )}
          >
            <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <input
              id="sidebar-search"
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground/60 text-foreground min-w-0"
            />
            {!isSearchFocused && !searchQuery && (
              <kbd className="text-[9px] font-mono opacity-50 shrink-0">⌘K</kbd>
            )}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* ── Navigation ───────────────────────────────────── */}
        <div className="px-3 pb-2">
          <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest px-1 mb-1.5">
            Main
          </p>
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "sidebar-item",
                      active && "active"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {active && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Documents ────────────────────────────────────── */}
        <div className="px-3 flex-1 min-h-0 flex flex-col">
          <div className="flex items-center justify-between px-1 mb-1.5">
            <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest">
              Documents
            </p>
            <span className="text-[10px] font-semibold text-muted-foreground/50 bg-muted px-1.5 py-0.5 rounded-full">
              {documents.length}
            </span>
          </div>
          <ScrollArea className="flex-1 -mx-1 px-1">
            {isLoading ? (
              <div className="space-y-1 py-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 rounded-none bg-muted/50 animate-pulse" />
                ))}
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="py-6 text-center">
                <FileText className="w-6 h-6 mx-auto mb-2 text-muted-foreground/30" />
                <p className="text-xs text-muted-foreground/60">
                  {searchQuery ? "No results" : "No documents yet"}
                </p>
              </div>
            ) : (
              <div className="space-y-0.5 pb-2">
                {filteredDocuments.slice(0, 12).map((doc) => {
                  const isDocActive = pathname === `/dashboard/${doc.id}`;
                  return (
                    <Link key={doc.id} href={`/dashboard/${doc.id}`}>
                      <div
                        className={cn(
                          "group flex items-center gap-2 px-2 py-1.5 rounded-none cursor-pointer transition-colors",
                          isDocActive
                            ? "bg-accent text-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <FileText className="w-3.5 h-3.5 shrink-0 opacity-70" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate leading-tight">
                            {doc.title}
                          </p>
                          <p className="text-[10px] opacity-50 truncate">
                            {getFormattedDate(doc.updated_at || doc.created_at)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
                {filteredDocuments.length > 12 && (
                  <p className="text-[10px] text-muted-foreground/50 text-center py-1.5">
                    +{filteredDocuments.length - 12} more
                  </p>
                )}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* ── User / Footer ─────────────────────────────────── */}
        <div className="border-t border-[var(--sidebar-border)] p-3 space-y-2">
          {/* Upgrade banner for free users */}
          {!isPro && (
            <Link href="/pricing">
              <div className="group flex items-center gap-2 px-2.5 py-2 rounded-none bg-muted/50 border border-border hover:bg-muted transition-colors cursor-pointer">
                <div className="w-5 h-5 rounded-none bg-primary/10 flex items-center justify-center shrink-0">
                  <Zap className="w-3 h-3 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-foreground leading-tight">Upgrade to Pro</p>
                  <p className="text-[10px] text-muted-foreground truncate">Unlimited AI · $9/mo</p>
                </div>
                <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0 -rotate-90 group-hover:text-foreground transition-colors" />
              </div>
            </Link>
          )}

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-none hover:bg-accent transition-colors text-left group">
                <div className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-foreground">
                    {(user?.name || user?.email || "U")[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate leading-tight">
                    {user?.name || user?.email?.split("@")[0] || "User"}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {isPro ? (
                      <span className="text-primary font-medium">Pro plan</span>
                    ) : (
                      "Free plan"
                    )}
                  </p>
                </div>
                <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" className="w-52 mb-1">
              <div className="px-2 py-1.5 mb-1">
                <p className="text-xs font-semibold text-foreground truncate">
                  {user?.name || user?.email?.split("@")[0]}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="gap-2 cursor-pointer">
                  <Settings className="w-3.5 h-3.5" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/pricing" className="gap-2 cursor-pointer">
                  {isPro ? (
                    <Crown className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  {isPro ? "Manage plan" : "Upgrade to Pro"}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <form action="/auth/signout" method="post" className="w-full">
                  <button type="submit" className="flex items-center gap-2 w-full text-destructive">
                    <LogOut className="w-3.5 h-3.5" />
                    Sign out
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </TooltipProvider>
  );
}
