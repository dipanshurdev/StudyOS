"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, BookOpen, Sparkles } from "lucide-react"
import { useState } from "react"
import { CreateDocumentDialog } from "./create-document-dialog"

export function EmptyState() {
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <Card className="bg-card/50 border-border/50 p-12 text-center max-w-md space-y-6">
        <div className="flex justify-center">
          <BookOpen className="w-16 h-16 text-muted-foreground/50" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to StudyOS</h1>
          <p className="text-muted-foreground">
            Start studying smarter. Create your first document and use AI to summarize, explain, or generate questions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex gap-3 items-start">
            <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="font-semibold text-foreground">Summarize Notes</p>
              <p className="text-muted-foreground text-xs">Turn long notes into concise summaries</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="font-semibold text-foreground">Explain Concepts</p>
              <p className="text-muted-foreground text-xs">Get clear explanations in simple language</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="font-semibold text-foreground">Practice Questions</p>
              <p className="text-muted-foreground text-xs">Generate MCQs and short-answer questions</p>
            </div>
          </div>
        </div>

        <CreateDocumentDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          onDocumentCreated={() => setOpenDialog(false)}
        >
          <Button className="w-full gap-2">
            <Plus className="w-4 h-4" />
            Create your first document
          </Button>
        </CreateDocumentDialog>
      </Card>
    </div>
  )
}
