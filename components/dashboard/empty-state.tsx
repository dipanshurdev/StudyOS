"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, BookOpen, Sparkles } from "lucide-react";
import { useState } from "react";
import { CreateDocumentDialog } from "./create-document-dialog";

export function EmptyState() {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <Card className="bg-card/50 border-border/50 p-8 md:p-10 text-center max-w-md space-y-5">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-primary" />
          </div>
        </div>

        <div>
          <h1 className="text-xl font-bold text-foreground mb-1.5">
            Your study hub is ready
          </h1>
          <p className="text-muted-foreground text-sm">
            Create a document to get started. Use AI to summarize, make
            flashcards, or chat with the tutor—all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 text-sm w-full max-w-sm">
          <div className="flex gap-3 items-start">
            <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="font-semibold text-foreground">Summarize</p>
              <p className="text-muted-foreground text-xs">
                Turn long notes into exam-focused summaries
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="font-semibold text-foreground">
                Flashcards & questions
              </p>
              <p className="text-muted-foreground text-xs">
                Generate cards and practice questions in one click
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="font-semibold text-foreground">AI tutor</p>
              <p className="text-muted-foreground text-xs">
                Ask questions and get instant explanations
              </p>
            </div>
          </div>
        </div>

        <CreateDocumentDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          onDocumentCreated={() => setOpenDialog(false)}
        >
          <Button className="w-full gap-2 shadow-sm">
            <Plus className="w-4 h-4" />
            Create your first document
          </Button>
        </CreateDocumentDialog>
      </Card>
    </div>
  );
}
