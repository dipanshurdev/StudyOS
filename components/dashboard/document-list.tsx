"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Edit3, Plus } from "lucide-react"
import { CreateDocumentDialog } from "./create-document-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Document {
  _id: string | { $oid: string }
  title: string
  updatedAt: string | Date
}

interface DocumentListProps {
  initialDocuments: any[]
}

export function DocumentList({ initialDocuments }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [openDialog, setOpenDialog] = useState(false)

  const getDocId = (doc: Document) => {
    return typeof doc._id === "string" ? doc._id : doc._id.$oid || doc._id.toString()
  }

  const getFormattedDate = (date: string | Date) => {
    const d = new Date(date)
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/documents/${id}`, { method: "DELETE" })
      setDocuments((prev) => prev.filter((doc) => getDocId(doc) !== id))
    } catch (error) {
      console.error("Failed to delete:", error)
    }
    setDeleteId(null)
  }

  const handleDocumentCreated = (newDoc: Document) => {
    setDocuments((prev) => [newDoc, ...prev])
    setOpenDialog(false)
  }

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Your documents</h1>
          <p className="text-muted-foreground mt-1">{documents.length} document(s)</p>
        </div>
        <CreateDocumentDialog open={openDialog} onOpenChange={setOpenDialog} onDocumentCreated={handleDocumentCreated}>
          <Button gap="2" className="gap-2">
            <Plus className="w-4 h-4" />
            New document
          </Button>
        </CreateDocumentDialog>
      </div>

      {documents.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <Card className="bg-card/50 border-border/50 p-12 text-center max-w-md">
            <h2 className="text-xl font-semibold text-foreground mb-2">No documents yet</h2>
            <p className="text-muted-foreground mb-6">
              Create your first study document to get started with AI-powered studying
            </p>
            <CreateDocumentDialog
              open={openDialog}
              onOpenChange={setOpenDialog}
              onDocumentCreated={handleDocumentCreated}
            >
              <Button className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Create document
              </Button>
            </CreateDocumentDialog>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => {
            const id = getDocId(doc)
            return (
              <Link key={id} href={`/dashboard/${id}`}>
                <Card className="bg-card/50 border-border/50 p-6 hover:border-primary/50 transition-colors cursor-pointer h-full group">
                  <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors mb-2">
                    {doc.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">Updated {getFormattedDate(doc.updatedAt)}</p>

                  <div className="flex gap-2 pt-4 border-t border-border/30">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.preventDefault()
                      }}
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.preventDefault()
                        setDeleteId(id)
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete document?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The document will be permanently deleted.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
