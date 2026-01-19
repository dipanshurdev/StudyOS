import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { LogOut, Bell, Shield, Download } from "lucide-react"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }
  
  // Fetch profile if needed, or rely on user metadata
  const name = user.user_metadata.full_name || user.email?.split('@')[0] || "User"

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="max-w-2xl mx-auto px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Account Settings */}
          <Card className="border-border/50 bg-card/40 backdrop-blur-sm rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg">Account Information</CardTitle>
              <CardDescription>Your account details and profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <Input
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="bg-muted/50 text-muted-foreground border-border/50"
                />
                <p className="text-xs text-muted-foreground">Your email address cannot be changed</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <Input
                  type="text"
                  value={name}
                  disabled
                  className="bg-muted/50 text-muted-foreground border-border/50"
                />
                <p className="text-xs text-muted-foreground">Linked from your Google account</p>
              </div>
            </CardContent>
          </Card>

          <Separator className="bg-border/30" />

          {/* Usage Settings */}
          <Card className="border-border/50 bg-card/40 backdrop-blur-sm rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Usage Tracking
              </CardTitle>
              <CardDescription>Control how your usage is tracked and displayed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Your Daily Limit</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  You get 5 free AI actions per day. This resets daily at midnight UTC.
                </p>
                <Button variant="outline" size="sm">
                  View Usage Details
                </Button>
              </div>
            </CardContent>
          </Card>

          <Separator className="bg-border/30" />

          {/* Privacy Settings */}
          <Card className="border-border/50 bg-card/40 backdrop-blur-sm rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>Manage your data and security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">Data Encryption</p>
                    <p className="text-xs text-muted-foreground">Your documents are encrypted in transit</p>
                  </div>
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400">Enabled</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">Two-Factor Auth</p>
                    <p className="text-xs text-muted-foreground">Add extra security to your account</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="bg-border/30" />

          {/* Data Export */}
          <Card className="border-border/50 bg-card/40 backdrop-blur-sm rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Download className="w-5 h-5" />
                Data & Export
              </CardTitle>
              <CardDescription>Download or manage your personal data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Export all your documents and settings as a backup.</p>
              <Button variant="outline" className="w-full bg-transparent">
                Export All Data
              </Button>
            </CardContent>
          </Card>

          <Separator className="bg-border/30" />

          {/* Danger Zone */}
          <Card className="border-destructive/50 bg-destructive/5 rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form
                action="/auth/signout" 
                method="post"
                className="space-y-3"
              >
                <p className="text-sm text-muted-foreground">Sign out from all devices and end your current session.</p>
                <Button
                  type="submit"
                  variant="destructive"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
