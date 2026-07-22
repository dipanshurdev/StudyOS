import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Bell, Shield, Download, User, ChevronLeft } from "lucide-react";
import Link from "next/link";

function SettingsSection({ title, description, icon: Icon, children }: {
  title: string; description: string; icon: any; children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-none overflow-hidden">
      <div className="px-5 py-4 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-none bg-muted flex items-center justify-center">
            <Icon className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function SettingsRow({ label, description, action }: { label: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      {action && <div className="ml-4 shrink-0">{action}</div>}
    </div>
  );
}

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = user.user_metadata.full_name || user.email?.split("@")[0] || "User";
  const initials = name.split(" ").map((p: string) => p[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground">
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="h-4 w-px bg-border" />
          <h1 className="text-sm font-semibold text-foreground">Settings</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-4">
        {/* Account */}
        <SettingsSection title="Account" description="Your profile and login details" icon={User}>
          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-border/50">
            <div className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-foreground">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Email address</label>
              <Input value={user.email || ""} disabled className="h-9 text-sm bg-muted/40" />
              <p className="text-[11px] text-muted-foreground/60">Your email cannot be changed</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Display name</label>
              <Input value={name} disabled className="h-9 text-sm bg-muted/40" />
              <p className="text-[11px] text-muted-foreground/60">Synced from your Google account</p>
            </div>
          </div>
        </SettingsSection>

        {/* Usage */}
        <SettingsSection title="Usage" description="Daily AI action limits" icon={Bell}>
          <div className="bg-muted/50 border border-border rounded-none p-4">
            <p className="text-sm font-semibold text-foreground mb-1">Free Plan</p>
            <p className="text-xs text-muted-foreground mb-3">
              10 free AI actions per day, resetting at midnight UTC.
            </p>
            <Link href="/pricing">
              <Button size="sm" className="h-8 text-xs gap-1.5">Upgrade to Pro</Button>
            </Link>
          </div>
        </SettingsSection>

        {/* Security */}
        <SettingsSection title="Privacy & Security" description="Data and account security settings" icon={Shield}>
          <SettingsRow
            label="Data encryption"
            description="All documents are encrypted in transit via TLS"
            action={<span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground bg-muted border border-border px-2 py-1 rounded-none">Active</span>}
          />
          <SettingsRow
            label="Two-factor authentication"
            description="Add an extra layer of security to your account"
            action={<Button variant="outline" size="sm" className="h-7 text-xs">Enable</Button>}
          />
        </SettingsSection>

        {/* Data */}
        <SettingsSection title="Data & Export" description="Download or manage your data" icon={Download}>
          <p className="text-sm text-muted-foreground mb-4">Export all documents and settings as a backup archive.</p>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
            <Download className="w-3.5 h-3.5" />Export all data
          </Button>
        </SettingsSection>

        {/* Danger zone */}
        <div className="bg-card border border-destructive/30 rounded-none overflow-hidden">
          <div className="px-5 py-4 border-b border-destructive/20">
            <h3 className="text-sm font-semibold text-destructive">Danger zone</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Irreversible and destructive actions</p>
          </div>
          <div className="p-5 space-y-3">
            <p className="text-sm text-muted-foreground">Sign out from all devices and end your current session.</p>
            <form action="/auth/signout" method="post">
              <Button type="submit" variant="destructive" size="sm" className="h-8 text-xs gap-1.5">
                <LogOut className="w-3.5 h-3.5" />Sign out
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
