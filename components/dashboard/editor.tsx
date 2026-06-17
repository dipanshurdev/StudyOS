"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles, Send, Check, Copy, Save, Share2, Maximize2, Minimize2,
  Trash2, Brain, Zap, Clock, ChevronLeft, Upload, MessageSquare,
  RotateCcw, Loader2, FileText, CreditCard, GitBranch, ThumbsUp,
  ThumbsDown, Minus, ChevronRight, X, AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUsageLimit } from "@/hooks/use-usage-limit";
import { cn } from "@/lib/utils";

interface EditorProps {
  initialDocument: any;
  userId: string;
}

type AiAction = "summarize" | "explain" | "questions" | "flashcards" | "mindmap" | "chat";

const AI_ACTIONS: { value: AiAction; label: string; icon: any; description: string }[] = [
  { value: "summarize", label: "Summary", icon: Sparkles, description: "Condense into key points" },
  { value: "explain", label: "Explain", icon: Brain, description: "Break down concepts" },
  { value: "questions", label: "Practice", icon: FileText, description: "Generate test questions" },
  { value: "flashcards", label: "Flashcards", icon: CreditCard, description: "Spaced repetition cards" },
  { value: "mindmap", label: "Mind Map", icon: GitBranch, description: "Visual concept map" },
  { value: "chat", label: "AI Tutor", icon: MessageSquare, description: "Ask anything" },
];

export function Editor({ initialDocument, userId }: EditorProps) {
  const [title, setTitle] = useState(initialDocument?.title || "");
  const [content, setContent] = useState(initialDocument?.content || "");
  const [aiOutput, setAiOutput] = useState("");
  const [selectedAction, setSelectedAction] = useState<AiAction>("summarize");
  const [flashcards, setFlashcards] = useState<Array<{ front: string; back: string; id?: string }>>([]);
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [chatInput, setChatInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { usage, limit, refreshUsage } = useUsageLimit();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const saveDocument = useDebouncedCallback(async (t: string, c: string) => {
    if (!initialDocument?.id) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/documents/${initialDocument.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: t, content: c }),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      toast.error("Sync failed", { description: "Changes are local. Retrying…" });
    } finally {
      setIsSaving(false);
    }
  }, 1500);

  useEffect(() => { saveDocument(title, content); }, [title, content, saveDocument]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages, isGenerating]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const saveToDocument = () => {
    if (!aiOutput) return;
    setContent((prev: string) => prev + `\n\n---\n\n### AI ${selectedAction.toUpperCase()}\n\n${aiOutput}`);
    toast.success("Appended to document");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are supported");
      return;
    }
    if (typeof window === "undefined") return;
    const tid = toast.loading("Importing PDF…");
    try {
      const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/legacy/build/pdf.worker.min.mjs", import.meta.url).toString();
      const buf = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const tc = await page.getTextContent();
        text += tc.items.map((it: any) => it.str).join(" ") + "\n\n";
      }
      if (!text.trim()) throw new Error("No readable text found in PDF.");
      setContent((prev: string) => prev + (prev.trim() ? "\n\n---\n\n" : "") + text);
      toast.success("PDF imported", { id: tid, description: `${pdf.numPages} pages from ${file.name}` });
    } catch (err: any) {
      toast.error("Import failed", { id: tid, description: err.message });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };


  const handleAiAction = async () => {
    if (usage >= limit) {
      toast.error("Daily limit reached", { description: "Upgrade to Pro for unlimited AI access." });
      return;
    }
    if (!content.trim() && selectedAction !== "chat") {
      toast.error("No content", { description: "Add study material first." });
      return;
    }
    setIsGenerating(true);
    setAiOutput("");
    try {
      if (selectedAction === "flashcards") {
        const res = await fetch("/api/ai", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "flashcards", content, documentId: initialDocument.id }),
        });
        const data = await res.json();
        if (!res.ok) { toast.error(data.error || "Generation failed"); return; }
        try {
          const parsed = JSON.parse(data.result);
          if (Array.isArray(parsed)) {
            setFlashcards(parsed);
            setShowFlashcards(true);
            setCurrentFlashcardIndex(0);
            setFlashcardFlipped(false);
            await fetch("/api/flashcards", {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ documentId: initialDocument.id, flashcards: parsed }),
            });
            toast.success(`${parsed.length} flashcards created`);
          } else { setAiOutput(data.result); }
        } catch { setAiOutput(data.result); }
      } else {
        const res = await fetch("/api/ai", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: selectedAction, content, documentId: initialDocument.id }),
        });
        const data = await res.json();
        if (!res.ok) { toast.error(data.error || "Generation failed"); return; }
        setAiOutput(data.result);
        toast.success("Done");
      }
      refreshUsage();
    } catch { toast.error("Network error", { description: "Check your connection." }); }
    finally { setIsGenerating(false); }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    if (usage >= limit) { toast.error("Daily limit reached"); return; }
    const msg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: msg }]);
    setIsGenerating(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, conversationId, documentId: initialDocument.id, conversationHistory: chatMessages }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Chat failed"); setChatMessages((prev) => prev.slice(0, -1)); return; }
      if (!conversationId) setConversationId(data.conversationId);
      setChatMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
      refreshUsage();
    } catch { toast.error("Network error"); setChatMessages((prev) => prev.slice(0, -1)); }
    finally { setIsGenerating(false); }
  };

  const handleFlashcardReview = async (quality: number) => {
    if (flashcards[currentFlashcardIndex]?.id) {
      await fetch(`/api/flashcards/${flashcards[currentFlashcardIndex].id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quality }),
      });
    }
    if (currentFlashcardIndex < flashcards.length - 1) {
      setCurrentFlashcardIndex((p) => p + 1);
      setFlashcardFlipped(false);
    } else {
      toast.success("Session complete!", { description: "All flashcards reviewed." });
      setShowFlashcards(false);
    }
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = content.replace(/\s/g, "").length;
  const usagePct = Math.min(100, (usage / limit) * 100);


  return (
    <div className={cn(
      "flex flex-col bg-background transition-all duration-300",
      isFullscreen ? "fixed inset-0 z-[100] h-screen" : "h-[calc(100vh-0px)]"
    )}>
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf" className="hidden" />

      {/* ── Top Toolbar ──────────────────────────────────────── */}
      <div className="h-11 border-b border-border/60 px-4 flex items-center justify-between bg-card/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-2">
          {!isFullscreen && (
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground">
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </Link>
          )}
          <div className="h-4 w-px bg-border mx-1" />
          {/* Save status */}
          {isSaving ? (
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Loader2 className="w-3 h-3 animate-spin" />Saving…
            </span>
          ) : saved ? (
            <span className="flex items-center gap-1.5 text-[11px] text-emerald-500">
              <Check className="w-3 h-3" />Saved
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground/50">
              <Clock className="w-3 h-3" />All changes saved
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost" size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-7 gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground"
            disabled={content.length > 0}
          >
            <Upload className="w-3.5 h-3.5" />Upload PDF
          </Button>
          <div className="h-4 w-px bg-border mx-1" />
          <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(!isFullscreen)} className="h-7 w-7 p-0 text-muted-foreground">
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </Button>
          <Button size="sm" variant="outline" className="h-7 gap-1.5 text-[11px]">
            <Share2 className="w-3.5 h-3.5" />Share
          </Button>
        </div>
      </div>

      {/* ── Main Area ────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-8 py-6 overflow-hidden">
            {/* Title */}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled document"
              className="text-2xl font-bold bg-transparent border-0 mb-4 focus:outline-none placeholder:text-muted-foreground/25 text-foreground w-full"
              spellCheck={false}
            />
            {/* Content area */}
            <div className="flex-1 relative flex flex-col rounded-xl border border-border focus-within:border-ring/50 transition-colors bg-card overflow-hidden">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste notes, type your material, or upload a PDF above…"
                className="flex-1 w-full bg-transparent p-5 focus:outline-none resize-none text-sm leading-7 text-foreground/85 placeholder:text-muted-foreground/25"
                spellCheck={false}
              />
              {/* Footer stats */}
              <div className="h-9 px-4 flex items-center justify-between border-t border-border/50 bg-muted/20 shrink-0">
                <span className="text-[10px] text-muted-foreground/50 font-medium uppercase tracking-widest">Markdown</span>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground/50">
                  <span>{wordCount} words</span>
                  <span>{charCount} chars</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: AI Panel */}
        <div className="w-[360px] border-l border-border/60 bg-card flex flex-col shrink-0">
          {/* Panel header */}
          <div className="px-4 pt-4 pb-3 border-b border-border/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-sm font-semibold text-foreground">AI Assistant</span>
              </div>
              <div className="flex items-center gap-1.5">
                {/* Usage indicator */}
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
                  <div className={cn("w-1.5 h-1.5 rounded-full", usagePct >= 90 ? "bg-red-500" : usagePct >= 70 ? "bg-amber-500" : "bg-emerald-500")} />
                  {limit - usage} left
                </div>
              </div>
            </div>

            {/* Action tabs — 2 rows */}
            <div className="space-y-1">
              <div className="grid grid-cols-3 gap-1">
                {AI_ACTIONS.slice(0, 3).map((action) => {
                  const Icon = action.icon;
                  const active = selectedAction === action.value;
                  return (
                    <button
                      key={action.value}
                      onClick={() => { setSelectedAction(action.value); setAiOutput(""); }}
                      className={cn(
                        "flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-semibold transition-all duration-150",
                        active
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="w-3 h-3 shrink-0" />{action.label}
                    </button>
                  );
                })}
              </div>
              <div className="grid grid-cols-3 gap-1">
                {AI_ACTIONS.slice(3).map((action) => {
                  const Icon = action.icon;
                  const active = selectedAction === action.value;
                  return (
                    <button
                      key={action.value}
                      onClick={() => { setSelectedAction(action.value); setAiOutput(""); if (action.value !== "chat") setChatMessages([]); }}
                      className={cn(
                        "flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-semibold transition-all duration-150",
                        active
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="w-3 h-3 shrink-0" />{action.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate button */}
            {selectedAction !== "chat" && (
              <Button
                onClick={handleAiAction}
                disabled={isGenerating || !content.trim()}
                className="w-full h-9 text-xs font-semibold gap-1.5 shadow-sm"
              >
                {isGenerating ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" />Generating…</>
                ) : (
                  <><Zap className="w-3.5 h-3.5" />Generate {AI_ACTIONS.find(a => a.value === selectedAction)?.label}</>
                )}
              </Button>
            )}
          </div>


          {/* Panel body */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* ── CHAT MODE ── */}
            {selectedAction === "chat" ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-auto p-3 space-y-3">
                  {chatMessages.length === 0 && !isGenerating && (
                    <div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-50">
                      <MessageSquare className="w-8 h-8 mb-3 text-muted-foreground" />
                      <p className="text-sm font-medium text-foreground">Ask your AI Tutor</p>
                      <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                        Ask anything about your study material
                      </p>
                    </div>
                  )}
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed",
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-muted text-foreground rounded-bl-sm"
                      )}>
                        <div className="prose-ai">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isGenerating && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-xl rounded-bl-sm px-3 py-2.5 flex gap-1.5">
                        <span className="typing-dot w-1.5 h-1.5 bg-muted-foreground/60 rounded-full inline-block" />
                        <span className="typing-dot w-1.5 h-1.5 bg-muted-foreground/60 rounded-full inline-block" />
                        <span className="typing-dot w-1.5 h-1.5 bg-muted-foreground/60 rounded-full inline-block" />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div className="p-3 border-t border-border/50">
                  <div className="flex gap-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleChatSend()}
                      placeholder="Ask a question…"
                      className="flex-1 h-8 text-xs"
                    />
                    <Button onClick={handleChatSend} disabled={isGenerating || !chatInput.trim()} size="sm" className="h-8 w-8 p-0 shrink-0">
                      <Send className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>

            ) : /* ── FLASHCARD MODE ── */
            showFlashcards && flashcards.length > 0 ? (
              <div className="flex-1 flex flex-col overflow-auto p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground font-medium">
                    {currentFlashcardIndex + 1} / {flashcards.length}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => setShowFlashcards(false)} className="h-6 text-[11px] text-muted-foreground gap-1">
                    <X className="w-3 h-3" />Exit
                  </Button>
                </div>
                {/* Progress bar */}
                <div className="h-1 bg-muted rounded-full mb-4 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${((currentFlashcardIndex + 1) / flashcards.length) * 100}%` }}
                  />
                </div>
                {/* Card */}
                <div
                  onClick={() => setFlashcardFlipped(!flashcardFlipped)}
                  className="flex-1 min-h-[180px] bg-background border-2 border-border rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 transition-colors group"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                    {flashcardFlipped ? "Answer" : "Question"} · click to flip
                  </span>
                  <div className="text-sm text-center text-foreground leading-relaxed prose-ai">
                    <ReactMarkdown>
                      {flashcardFlipped ? flashcards[currentFlashcardIndex].back : flashcards[currentFlashcardIndex].front}
                    </ReactMarkdown>
                  </div>
                </div>
                {/* Controls */}
                <div className="mt-3 space-y-2">
                  {flashcardFlipped ? (
                    <div className="grid grid-cols-3 gap-1.5">
                      <Button variant="outline" size="sm" onClick={() => handleFlashcardReview(1)} className="h-8 text-xs gap-1 border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-950">
                        <ThumbsDown className="w-3 h-3" />Hard
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleFlashcardReview(3)} className="h-8 text-xs gap-1 border-amber-200 dark:border-amber-900 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950">
                        <Minus className="w-3 h-3" />Good
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleFlashcardReview(5)} className="h-8 text-xs gap-1 border-emerald-200 dark:border-emerald-900 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950">
                        <ThumbsUp className="w-3 h-3" />Easy
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full h-8 text-xs" onClick={() => setFlashcardFlipped(true)}>
                      Reveal answer
                    </Button>
                  )}
                </div>
              </div>

            ) : /* ── EMPTY STATE ── */
            !aiOutput && !isGenerating ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center opacity-40">
                <Brain className="w-10 h-10 mb-3 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground mb-1">Ready to assist</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {AI_ACTIONS.find(a => a.value === selectedAction)?.description}
                </p>
              </div>

            ) : /* ── SKELETON ── */
            isGenerating ? (
              <div className="flex-1 p-5 space-y-3">
                {[80, 100, 65, 90, 55, 75].map((w, i) => (
                  <div key={i} className="h-3 bg-muted rounded-full animate-pulse" style={{ width: `${w}%`, animationDelay: `${i * 80}ms` }} />
                ))}
              </div>

            ) : (
              /* ── RESULT ── */
              <div className="flex-1 flex flex-col overflow-hidden animate-fade-in">
                <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 shrink-0">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                    {selectedAction} result
                  </span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(aiOutput)} className="h-6 w-6 p-0 text-muted-foreground">
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={saveToDocument} className="h-6 w-6 p-0 text-muted-foreground">
                      <Save className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setAiOutput("")} className="h-6 w-6 p-0 text-muted-foreground">
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  <div className="prose-ai">
                    <ReactMarkdown>{aiOutput}</ReactMarkdown>
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-border/40 bg-muted/20 shrink-0">
                  <p className="text-[10px] text-muted-foreground/50 text-center">
                    AI can make mistakes — verify important information
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
