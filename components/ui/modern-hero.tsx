import Link from "next/link";
import {
  Sparkles,
  Layers,
  ListChecks,
  GitBranch,
  ArrowRight,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface HeroAction {
  text: string;
  url: string;
}

interface Hero7Props {
  primary?: HeroAction;
  secondary?: HeroAction;
}

const AI_ACTIONS = [
  { label: "Summarize", icon: Sparkles, active: true },
  { label: "Flashcards", icon: Layers, active: false },
  { label: "Practice", icon: ListChecks, active: false },
  { label: "Mind map", icon: GitBranch, active: false },
];

const Hero7 = ({
  primary = { text: "Get started free", url: "/login" },
  secondary = { text: "Watch demo", url: "#demo" },
}: Hero7Props) => {
  return (
    <section className="px-6 pt-14 pb-16 md:pt-20 md:pb-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        {/* Left — message */}
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span className="inline-block size-1.5 rounded-full bg-primary" aria-hidden="true" />
            AI study workspace
          </div>
          <h1 className="tracking-display mt-5 text-[2.75rem] font-semibold leading-[1.05] text-foreground sm:text-6xl">
            Turn any material into{" "}
            <span className="text-primary">exam-ready</span> in minutes.
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground md:text-xl">
            Drop in notes, PDFs, or lecture slides. StudyOS writes the summary,
            builds the flashcards, drafts practice questions, and explains what
            you missed — in one workspace.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={primary.url}>
                {primary.text}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            {secondary ? (
              <Button asChild variant="outline" size="lg">
                <Link href={secondary.url}>{secondary.text}</Link>
              </Button>
            ) : null}
          </div>
          <dl className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-border pt-6">
            {[
              { value: "10", label: "free AI actions daily" },
              { value: "6", label: "study tools per document" },
              { value: "PDF", label: "notes & slides import" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="font-mono text-lg font-semibold tabular-nums text-foreground">
                  {stat.value}
                </dt>
                <dd className="mt-0.5 text-xs text-muted-foreground">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right — live product preview */}
        <ProductPreview />
      </div>
    </section>
  );
};

function ProductPreview() {
  return (
    <div className="relative">
      <div
        className="product-shadow overflow-hidden rounded-[18px] border border-border bg-card"
        role="img"
        aria-label="StudyOS turning a biology chapter into an AI summary and a flashcard"
      >
        {/* Document header */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
          </div>
          <span className="ml-2 truncate text-xs font-medium text-foreground">
            Biology · Ch. 12 — Cell Division
          </span>
          <span className="ml-auto font-mono text-[10px] text-muted-foreground">
            2,410 words
          </span>
        </div>

        {/* AI action bar */}
        <div className="flex flex-wrap gap-1.5 border-b border-border bg-muted/40 px-4 py-3">
          {AI_ACTIONS.map(({ label, icon: Icon, active }) => (
            <span
              key={label}
              className={
                active
                  ? "inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground"
                  : "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground"
              }
            >
              <Icon className="size-3.5" />
              {label}
            </span>
          ))}
        </div>

        {/* Generated result */}
        <div className="space-y-4 px-4 py-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Summary
            </p>
            <ul className="space-y-2">
              {[
                "Mitosis produces two genetically identical diploid cells for growth and repair.",
                "Meiosis produces four genetically distinct haploid gametes.",
                "Crossing over in prophase I drives genetic variation.",
              ].map((line) => (
                <li key={line} className="flex gap-2 text-sm leading-6 text-foreground/90">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Flashcard */}
          <div className="rounded-none border border-border bg-muted/40 p-3.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Flashcard 1 / 12
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                Review today
              </span>
            </div>
            <p className="mt-2 text-sm font-medium text-foreground">
              What separates during anaphase of mitosis?
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Sister chromatids are pulled to opposite poles of the cell.
            </p>
          </div>
        </div>
      </div>

      {/* Streaming indicator, honest and subtle */}
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="flex gap-1" aria-hidden="true">
          <span className="typing-dot size-1.5 rounded-full bg-primary" />
          <span className="typing-dot size-1.5 rounded-full bg-primary" />
          <span className="typing-dot size-1.5 rounded-full bg-primary" />
        </span>
        Generated from your document in ~3 seconds
      </div>
    </div>
  );
}

export { Hero7 };
