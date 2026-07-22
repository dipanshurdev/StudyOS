"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface MindMapNode {
  label: string;
  children: MindMapNode[];
}

/**
 * Parse AI mind-map text (markdown headings / indented bullet list) into a tree.
 * Handles:
 *  - "# Heading", "## Sub"  (markdown headings by depth)
 *  - "- item", "  - child"  (indented bullets by leading whitespace)
 *  - numbered lists "1. item"
 */
function parseMindMap(text: string): MindMapNode | null {
  const lines = text
    .split("\n")
    .map((l) => l.replace(/\r$/, ""))
    .filter((l) => l.trim().length > 0);
  if (lines.length === 0) return null;

  const root: MindMapNode = { label: "", children: [] };
  // stack of { node, level }
  const stack: { node: MindMapNode; level: number }[] = [
    { node: root, level: -1 },
  ];

  const clean = (s: string) =>
    s
      .replace(/^#{1,6}\s+/, "")
      .replace(/^[-*+]\s+/, "")
      .replace(/^\d+[.)]\s+/, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .trim();

  for (const raw of lines) {
    let level: number;
    const headingMatch = raw.match(/^(#{1,6})\s+/);
    if (headingMatch) {
      level = headingMatch[1].length; // 1..6
    } else {
      const indent = raw.length - raw.trimStart().length;
      // treat every 2 spaces (or a tab) as one nesting level, offset past headings
      const tabAdjusted = raw.trimStart() === raw ? indent : indent;
      level = 10 + Math.floor(tabAdjusted / 2);
    }

    const label = clean(raw);
    if (!label) continue;

    while (stack.length > 1 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }
    const parent = stack[stack.length - 1].node;
    const node: MindMapNode = { label, children: [] };
    parent.children.push(node);
    stack.push({ node, level });
  }

  if (root.children.length === 0) return null;
  // If there is a single top-level node, use it as the root.
  if (root.children.length === 1) return root.children[0];
  return { label: "Mind Map", children: root.children };
}

function Branch({ node, depth }: { node: MindMapNode; depth: number }) {
  const isRoot = depth === 0;
  return (
    <li className="relative">
      <div
        className={cn(
          "inline-flex items-center rounded-none border text-sm transition-colors",
          isRoot
            ? "border-primary/60 bg-primary/5 px-3 py-1.5 font-semibold text-foreground"
            : "border-border bg-card px-2.5 py-1 text-foreground/90 hover:border-foreground/20"
        )}
      >
        {!isRoot && (
          <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0" />
        )}
        {node.label}
      </div>
      {node.children.length > 0 && (
        <ul className="mt-2 ml-4 space-y-2 border-l border-border pl-4">
          {node.children.map((child, i) => (
            <Branch key={i} node={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function MindMap({ source }: { source: string }) {
  const tree = useMemo(() => parseMindMap(source), [source]);

  if (!tree) {
    return (
      <div className="prose-ai text-sm text-foreground/85 whitespace-pre-wrap">
        {source}
      </div>
    );
  }

  return (
    <div className="text-sm">
      <ul className="space-y-2">
        <Branch node={tree} depth={0} />
      </ul>
    </div>
  );
}
