"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Send, Check, AlertCircle, Copy, Save, Share2, Maximize2, Minimize2, Trash2, Brain, Zap, Clock, Bookmark, ChevronLeft, FileText, Upload } from "lucide-react"
import { toast } from "sonner"
import { useDebouncedCallback } from "use-debounce"
import ReactMarkdown from "react-markdown"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useUsageLimit } from "@/hooks/use-usage-limit"
import * as pdfjsLib from 'pdfjs-dist'

// Set worker for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface EditorProps {
  initialDocument: any
  userId: string
}

export function Editor({ initialDocument, userId }: EditorProps) {
  const [title, setTitle] = useState(initialDocument?.title || "")
  const [content, setContent] = useState(initialDocument?.content || "")
  const [aiOutput, setAiOutput] = useState("")
  const [selectedAction, setSelectedAction] = useState<"summarize" | "explain" | "questions">("summarize")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const { usage, limit, refreshUsage } = useUsageLimit()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const router = useRouter()
  const contentRef = useRef<HTMLTextAreaElement>(null)

  // Auto-save functionality
  const saveDocument = useDebouncedCallback(async (titleVal: string, contentVal: string) => {
    if (!initialDocument?.id) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/documents/${initialDocument.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: titleVal, content: contentVal }),
      })
      
      if (!response.ok) throw new Error("Auto-save failed")
      
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      toast.error("Cloud sync failed", {
        description: "Your changes are still local. We'll try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }, 1500)

  useEffect(() => {
    saveDocument(title, content)
  }, [title, content, saveDocument])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  const saveToDocument = () => {
    if (!aiOutput) return
    const appendedContent = content + "\n\n--- AI " + selectedAction.toUpperCase() + " ---\n\n" + aiOutput
    setContent((prev: string) => prev + "\n\n--- AI " + selectedAction.toUpperCase() + " ---\n\n" + aiOutput)
    toast.success("Added to document", {
      description: "The AI result has been appended to your notes.",
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      toast.error("Format not supported", { description: "Please upload a PDF file." })
      return
    }

    const toastId = toast.loading("Processing PDF...", { description: "Extracting educational content..." })
    
    try {
      const arrayBuffer = await file.arrayBuffer()
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
      const pdf = await loadingTask.promise
      
      let fullText = ""
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ")
        fullText += pageText + "\n\n"
      }

      if (!fullText.trim()) {
        throw new Error("No readable text found in PDF.")
      }

      const separator = content.trim() ? "\n\n--- PDF UPLOAD ---\n\n" : ""
      setContent((prev: string) => prev + separator + fullText)
      
      toast.success("Import Successful", { 
        id: toastId,
        description: `Imported ${pdf.numPages} pages from ${file.name}` 
      })
    } catch (error: any) {
      console.error("PDF Parsing error:", error)
      toast.error("Import Failed", { 
        id: toastId,
        description: error.message || "Could not extract text from this PDF." 
      })
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleAiAction = async () => {
    if (usage >= limit) {
      toast.error("Limit reached", {
        description: "You've reached your free daily limit. Contact dv451197@gmail.com for upgrades.",
      })
      return
    }

    if (!content.trim()) {
      toast.error("No material provided", {
        description: "Please paste your study notes first.",
      })
      return
    }

    setIsGenerating(true)
    setAiOutput("") 
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: selectedAction,
          content,
          documentId: initialDocument.id
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Generation failed", {
          description: data.message || "Please try again shortly.",
        })
        return
      }

      setAiOutput(data.result)
      refreshUsage() // Important to update the UI
      toast.success("AI Insights Ready", {
        description: `Successfully ${selectedAction}d your notes!`,
      })
    } catch (error) {
      toast.error("Network Error", {
        description: "Could not reach AI services. Check your connection.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className={`flex flex-col h-[calc(100vh-64px)] bg-background transition-all duration-500 overflow-hidden ${isFullscreen ? "fixed inset-0 z-[100] h-screen" : ""}`}>
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept=".pdf" 
        className="hidden" 
      />

      {/* Editor Toolbar */}
      <div className="h-12 border-b border-border/40 px-4 flex items-center justify-between bg-card/30 backdrop-blur-md">
        <div className="flex items-center gap-2">
          {!isFullscreen && (
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </Link>
          )}
          <div className="flex items-center gap-2 px-2 text-xs font-medium text-muted-foreground border-l border-border/40 ml-1">
            {isSaving ? (
              <span className="flex items-center gap-2 text-amber-500 animate-pulse">
                <div className="h-1.5 w-1.5 rounded-full bg-current" />
                Syncing...
              </span>
            ) : saved ? (
              <span className="flex items-center gap-2 text-emerald-500">
                <Check className="h-3.5 w-3.5" />
                Saved to cloud
              </span>
            ) : (
              <span className="flex items-center gap-2 opacity-50">
                <Clock className="h-3.5 w-3.5" />
                All changes saved
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => fileInputRef.current?.click()}
            className="h-8 gap-2 text-xs font-bold text-primary hover:bg-primary/10 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload PDF
          </Button>
          <div className="h-4 w-px bg-border/40 mx-2" />
          <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(!isFullscreen)} className="h-8 w-8 p-0">
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10">
            <Trash2 className="w-4 h-4" />
          </Button>
          <div className="h-4 w-px bg-border/40 mx-2" />
          <Button size="sm" className="h-8 rounded-lg font-semibold shadow-sm hover:shadow-md transition-shadow">
            <Share2 className="w-3.5 h-3.5 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Main Editor */}
        <div className="flex-1 flex flex-col bg-card/10 p-6 md:p-8 overflow-hidden">
          <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your material a title..."
              className="text-3xl md:text-4xl font-extrabold bg-transparent border-0 px-0 mb-6 focus-visible:ring-0 placeholder:text-muted-foreground/30 text-foreground tracking-tight w-full"
              spellCheck={false}
            />
            
            <div className="flex-1 relative group rounded-2xl border border-border/40 focus-within:border-primary/40 transition-colors bg-background/50 backdrop-blur-sm overflow-hidden flex flex-col">
              <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-background/80 backdrop-blur-md border border-border/40 rounded-lg p-1.5 flex gap-1 shadow-sm">
                   <Button variant="ghost" size="icon" className="h-7 w-7"><Bookmark className="w-3.5 h-3.5" /></Button>
                   <Button variant="ghost" size="icon" className="h-7 w-7"><Maximize2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
              <textarea
                ref={contentRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your study material here, then use the AI assistant on the right to summarize or explain it..."
                className="flex-1 w-full bg-transparent p-8 focus:outline-none resize-none text-lg leading-relaxed text-foreground/80 placeholder:text-muted-foreground/20 scrollbar-thin scrollbar-thumb-primary/10 transition-all font-sans"
                spellCheck={false}
              />
              <div className="h-12 px-6 flex items-center justify-between border-t border-border/20 bg-muted/30">
                 <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Markdown Supported</div>
                 <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground/60">
                    <span>{content.replace(/\s/g, '').length} chars</span>
                    <span>{content.trim().split(/\s+/).filter(Boolean).length} words</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: AI Assistant Panel */}
        <div className="w-[400px] border-l border-border/40 bg-card/30 backdrop-blur-xl flex flex-col shadow-2xl relative">
          <div className="p-6 border-b border-border/40">
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground">AI Study Partner</h3>
               </div>
               <div className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">Llama-3.1</div>
            </div>
            
            <div className="bg-background/40 p-1 rounded-xl border border-border/40 mb-4">
              <Tabs value={selectedAction} onValueChange={(v) => setSelectedAction(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-transparent border-0 p-0">
                  <TabsTrigger value="summarize" className="rounded-lg py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all text-xs font-bold">
                    Summary
                  </TabsTrigger>
                  <TabsTrigger value="explain" className="rounded-lg py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all text-xs font-bold">
                    Explain
                  </TabsTrigger>
                  <TabsTrigger value="questions" className="rounded-lg py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all text-xs font-bold">
                    Practice
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <Button
              onClick={handleAiAction}
              disabled={isGenerating || !content.trim()}
              className="w-full h-11 rounded-xl font-bold gap-2 text-sm shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 group active:scale-[0.98]"
            >
              {isGenerating ? (
                 <>
                   <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   Thinking...
                 </>
              ) : (
                <>
                  <Zap className="w-4 h-4 group-hover:fill-current transition-colors" />
                  Generate {selectedAction === 'questions' ? 'Practice Questions' : selectedAction.charAt(0).toUpperCase() + selectedAction.slice(1)}
                </>
              )}
            </Button>
          </div>

          <div className="flex-1 overflow-auto p-0 flex flex-col relative group">
            {!aiOutput && !isGenerating ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-40 group-hover:opacity-60 transition-opacity">
                 <div className="w-16 h-16 rounded-3xl bg-muted/50 flex items-center justify-center mb-6">
                    <Brain className="w-8 h-8" />
                 </div>
                 <h4 className="font-bold text-foreground mb-2">Ready to assist</h4>
                 <p className="text-sm text-muted-foreground leading-relaxed">
                   Select an action above and the AI will analyze your notes to help you study more effectively.
                 </p>
              </div>
            ) : isGenerating ? (
               <div className="flex-1 flex flex-col p-10 space-y-4">
                  <div className="h-4 bg-muted/50 rounded-lg w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-muted/50 rounded-lg w-full animate-pulse"></div>
                  <div className="h-4 bg-muted/50 rounded-lg w-5/6 animate-pulse delay-75"></div>
                  <div className="h-4 bg-muted/50 rounded-lg w-2/3 animate-pulse delay-150"></div>
                  <div className="pt-6 space-y-4 opacity-50">
                    <div className="h-32 bg-muted/30 rounded-xl w-full animate-pulse"></div>
                  </div>
               </div>
            ) : (
              <div className="flex-1 flex flex-col bg-background/5 p-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-border/20">
                   <h4 className="text-sm font-bold text-foreground/60 uppercase tracking-widest">{selectedAction} Result</h4>
                   <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted" onClick={() => copyToClipboard(aiOutput)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted" onClick={saveToDocument}>
                        <Save className="w-4 h-4" />
                      </Button>
                   </div>
                </div>
                <div className="prose-ai">
                  <ReactMarkdown>{aiOutput}</ReactMarkdown>
                </div>
              </div>
            )}
            
            {/* AI Assistant Overlay/Hint */}
            {aiOutput && (
              <div className="p-4 mt-auto border-t border-border/20 bg-muted/20">
                 <p className="text-[10px] text-muted-foreground text-center font-medium uppercase tracking-tighter italic">
                   AI-generated content can occasionally be incorrect. Double check important facts.
                 </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
