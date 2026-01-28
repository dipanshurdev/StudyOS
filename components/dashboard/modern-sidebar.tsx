"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Settings,
  FileText,
  BarChart3,
  Home,
  CreditCard,
  GitBranch,
  MessageSquare,
  Sparkles,
  Zap,
  Crown,
  User,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CreateDocumentDialog } from "./create-document-dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
  const pathname = usePathname();

  useEffect(() => {
    fetchDocuments();
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
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleDocumentCreated = (newDoc: Document) => {
    setDocuments((prev) => [newDoc, ...prev]);
    setOpenDialog(false);
  };

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="w-72 bg-gradient-to-b from-background to-background/95 border-r border-border/50 flex flex-col h-screen sticky top-0 shadow-lg">
      {/* Logo & Brand */}
      <div className="p-6 border-b border-border/50">
        <Link href="/" className="flex items-center gap-3 mb-6 group">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
            <img
              src="/logo.png"
              alt="StudyOS"
              className="w-full h-full object-contain p-1.5"
            />
          </div>
          <div>
            <span className="font-black text-xl text-foreground tracking-tight block">
              Study<span className="text-primary">OS</span>
            </span>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-70">
              AI Study Platform
            </p>
          </div>
        </Link>

        <CreateDocumentDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          onDocumentCreated={handleDocumentCreated}
        >
          <Button
            size="lg"
            className="w-full gap-2 rounded-xl shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary font-semibold"
          >
            <Plus className="w-5 h-5" />
            <span>New Document</span>
          </Button>
        </CreateDocumentDialog>
      </div>

      {/* Navigation */}
      <div className="px-4 py-4 border-b border-border/50">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-2 mb-3">
          Navigation
        </p>
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer group",
                    active
                      ? "bg-primary/10 text-primary font-semibold shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  <Icon className={cn("w-4 h-4", active && "text-primary")} />
                  <span className="text-sm">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Documents Section */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3 px-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Documents
            </p>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
              {documents.length}
            </Badge>
          </div>
          {isLoading ? (
            <div className="text-xs text-muted-foreground text-center py-8">
              Loading...
            </div>
          ) : documents.length === 0 ? (
            <div className="text-xs text-muted-foreground text-center py-8 px-2">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No documents yet</p>
              <p className="mt-1 opacity-70">Create one to get started</p>
            </div>
          ) : (
            <div className="space-y-1">
              {documents.slice(0, 10).map((doc) => {
                const isDocActive = pathname === `/dashboard/${doc.id}`;
                return (
                  <Link key={doc.id} href={`/dashboard/${doc.id}`}>
                    <div
                      className={cn(
                        "p-3 rounded-lg transition-all cursor-pointer group border",
                        isDocActive
                          ? "bg-primary/5 border-primary/20 shadow-sm"
                          : "border-transparent hover:bg-muted/30 hover:border-border/50",
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <FileText
                          className={cn(
                            "w-4 h-4 mt-0.5 flex-shrink-0",
                            isDocActive
                              ? "text-primary"
                              : "text-muted-foreground",
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              "text-sm font-medium truncate",
                              isDocActive
                                ? "text-primary"
                                : "text-foreground group-hover:text-primary transition-colors",
                            )}
                          >
                            {doc.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {getFormattedDate(doc.updated_at || doc.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
              {documents.length > 10 && (
                <div className="text-xs text-muted-foreground text-center py-2">
                  +{documents.length - 10} more documents
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      <Separator className="bg-border/50" />

      {/* User Section */}
      <div className="p-4 space-y-2">
        {/* Plan Badge */}
        {user?.plan_type && (
          <div
            className={cn(
              "px-3 py-2 rounded-lg border mb-2",
              user.plan_type === "pro"
                ? "bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20"
                : "bg-muted/30 border-border/50",
            )}
          >
            <div className="flex items-center gap-2">
              {user.plan_type === "pro" ? (
                <Crown className="w-4 h-4 text-primary" />
              ) : (
                <Sparkles className="w-4 h-4 text-muted-foreground" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground capitalize">
                  {user.plan_type} Plan
                </p>
                {user.plan_type === "free" && (
                  <Link
                    href="/pricing"
                    className="text-[10px] text-primary hover:underline"
                  >
                    Upgrade to Pro
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* User Info */}
        <div className="px-3 py-2.5 bg-muted/30 rounded-lg border border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                {user?.name || user?.email?.split("@")[0] || "User"}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {user?.email || ""}
              </p>
            </div>
          </div>
        </div>

        {/* Settings & Logout */}
        <div className="flex gap-2">
          <Link href="/dashboard/settings" className="flex-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg text-xs"
            >
              <Settings className="w-3.5 h-3.5 mr-2" />
              Settings
            </Button>
          </Link>
          <form action="/auth/signout" method="post" className="flex-1">
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg text-xs"
            >
              <LogOut className="w-3.5 h-3.5 mr-2" />
              Logout
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
