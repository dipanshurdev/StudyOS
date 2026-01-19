"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, ChevronLeft, Plus, Sparkles, BookOpen } from "lucide-react"
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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <div className="mb-8">
          <Link href="/dashboard" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors inline-flex group">
            <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center mr-3 group-hover:bg-primary/10 transition-colors">
               <ChevronLeft className="w-4 h-4" />
            </div>
            Back to Dashboard
          </Link>
        </div>
        
        <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl rounded-[2rem] overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
             <BookOpen className="w-32 h-32" />
          </div>
          <CardHeader className="pt-10 px-10 pb-6 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
               <Plus className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-black tracking-tight">New Study Material</CardTitle>
            <CardDescription className="text-base font-medium mt-2">
              Start by giving your document a clear title.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-10 pb-10">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Document Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Quantum Physics - Week 3 Notes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isLoading}
                  required
                  autoFocus
                  className="h-14 rounded-xl border-border/50 bg-background/50 text-lg font-semibold px-6 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/30"
                />
              </div>
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                 <Button type="submit" disabled={isLoading} className="flex-1 h-14 rounded-xl text-md font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98] transition-all gap-2">
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Create Document
                      </>
                    )}
                 </Button>
                 <Button type="button" variant="ghost" className="h-14 px-8 rounded-xl font-bold" asChild>
                   <Link href="/dashboard">Cancel</Link>
                 </Button>
              </div>
            </form>
            
            <div className="mt-8 pt-8 border-t border-border/20">
               <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/30 p-4 rounded-2xl border border-border/10">
                  <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center flex-shrink-0">
                     <Plus className="w-4 h-4 text-primary" />
                  </div>
                  <p className="leading-tight">
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
