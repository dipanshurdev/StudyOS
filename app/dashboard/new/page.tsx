"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, ChevronLeft, Plus, Sparkles } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function NewDocumentPage() {
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title || "Untitled Document",
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create document")
      }

      const data = await response.json()

      toast.success("Ready to study!", {
        description: "Your document has been created successfully."
      })
      router.push(`/dashboard/${data.id}`)
    } catch (error: any) {
      toast.error("Creation failed", {
        description: error.message
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <div className="mb-8">
          <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center group">
            <div className="w-8 h-8 rounded-none bg-muted border border-border flex items-center justify-center mr-3 group-hover:border-foreground/20 transition-colors">
               <ChevronLeft className="w-4 h-4" />
            </div>
            Back to Dashboard
          </Link>
        </div>
        
        <Card className="border-border bg-card shadow-xs rounded-none overflow-hidden">
          <CardHeader className="pt-10 px-10 pb-6 text-center">
            <div className="w-14 h-14 bg-muted border border-border rounded-none flex items-center justify-center mx-auto mb-6">
               <Plus className="w-7 h-7 text-primary" />
            </div>
            <CardTitle className="text-2xl font-semibold tracking-tight">New Study Material</CardTitle>
            <CardDescription className="text-sm mt-2">
              Start by giving your document a clear title.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-10 pb-10">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Document Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Quantum Physics - Week 3 Notes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isLoading}
                  required
                  autoFocus
                  className="h-11 text-base px-4 placeholder:text-muted-foreground/40"
                />
              </div>
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                 <Button type="submit" disabled={isLoading} className="flex-1 h-11 text-sm font-semibold gap-2">
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Create Document
                      </>
                    )}
                 </Button>
                 <Button type="button" variant="ghost" className="h-11 px-6 text-sm font-medium" asChild>
                   <Link href="/dashboard">Cancel</Link>
                 </Button>
              </div>
            </form>
            
            <div className="mt-8 pt-6 border-t border-border">
               <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/40 p-3 rounded-none border border-border">
                  <div className="w-7 h-7 rounded-none bg-card border border-border flex items-center justify-center flex-shrink-0">
                     <Plus className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <p className="leading-tight text-xs">
                    You can paste text or ask AI for help once the document is created.
                  </p>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
