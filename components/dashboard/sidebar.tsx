"use client"

import { useState, useEffect } from "react"
import { Plus, Settings, FileText, BarChart3 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CreateDocumentDialog } from "./create-document-dialog"

interface Document {
  id: string
  title: string
  updated_at: string | Date
  created_at: string | Date
}

export function Sidebar({ user }: { user?: { name?: string; email?: string } }) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/documents")
      const data = await response.json()
      setDocuments(data.documents || [])
    } catch (error) {
      console.error("Failed to fetch documents:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getFormattedDate = (date: string | Date) => {
    const d = new Date(date)
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const handleDocumentCreated = (newDoc: Document) => {
    setDocuments((prev) => [newDoc, ...prev])
    setOpenDialog(false)
  }

  return (
    <div className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-3 mb-8 group">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-background shadow-md border border-border/50 p-1.5 transition-all group-hover:shadow-lg group-hover:border-primary/20">
            <img src="/logo.png" alt="StudyOS" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-black text-xl text-sidebar-foreground tracking-tight">Study<span className="text-primary">OS</span></span>
            <p className="text-[10px] font-bold text-sidebar-muted-foreground uppercase tracking-widest opacity-60">Study with AI</p>
          </div>
        </Link>

        <CreateDocumentDialog open={openDialog} onOpenChange={setOpenDialog} onDocumentCreated={handleDocumentCreated}>
          <Button size="lg" className="w-full gap-2 rounded-lg shadow-md hover:shadow-lg transition-all">
            <Plus className="w-5 h-5" />
            <span>New document</span>
          </Button>
        </CreateDocumentDialog>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-1">
          <p className="text-xs font-semibold text-sidebar-muted-foreground px-2 mb-3">YOUR DOCUMENTS</p>
          {isLoading ? (
            <div className="text-xs text-sidebar-muted-foreground text-center py-8">Loading...</div>
          ) : documents.length === 0 ? (
            <div className="text-xs text-sidebar-muted-foreground text-center py-8 px-2">
              <p>No documents yet</p>
              <p className="mt-1">Create one to get started</p>
            </div>
          ) : (
            documents.map((doc) => (
              <Link key={doc.id} href={`/dashboard/${doc.id}`}>
                <div className="p-3 rounded-lg hover:bg-sidebar-accent transition-all duration-200 cursor-pointer group">
                  <p className="text-sm font-medium text-sidebar-foreground truncate group-hover:text-sidebar-primary transition-colors">
                    {doc.title}
                  </p>
                  <p className="text-xs text-sidebar-muted-foreground mt-1">{getFormattedDate(doc.updated_at || doc.created_at)}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </ScrollArea>

      <Separator className="bg-sidebar-border" />

      {/* Navigation Links */}
      <div className="p-4 space-y-2 border-b border-sidebar-border">
        <Link href="/dashboard/analytics" className="block">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent/50 rounded-lg font-medium"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
        </Link>
      </div>

      <div className="p-4 space-y-2">
        <div className="px-2 py-3 mb-2 bg-sidebar-accent/30 rounded-lg">
          <p className="text-xs font-medium text-sidebar-foreground truncate">{user?.email || "User"}</p>
          <p className="text-xs text-sidebar-muted-foreground">{user?.name || "Demo"}</p>
        </div>

        <Link href="/dashboard/settings" className="block">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent/50 rounded-lg"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </Link>
      </div>
    </div>
  )
}
