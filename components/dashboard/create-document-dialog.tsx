"use client"

import { useState, type ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface CreateDocumentDialogProps {
  children: ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  onDocumentCreated: (doc: any) => void
}

export function CreateDocumentDialog({ children, open, onOpenChange, onDocumentCreated }: CreateDocumentDialogProps) {
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error("Title required", {
        description: "Please enter a document title",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      })

      if (!response.ok) throw new Error("Failed to create document")

      const doc = await response.json()
      onDocumentCreated(doc)
      setTitle("")
      toast.success("Document created!")
    } catch (error) {
      toast.error("Error", {
        description: "Failed to create document",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight">Create Study Hub</DialogTitle>
          <DialogDescription className="text-sm font-medium">
            Name your document or upload a PDF inside the editor to get started. 🚀
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="e.g., Biology Chapter 3 Notes"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            autoFocus
          />
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!title.trim() || isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
