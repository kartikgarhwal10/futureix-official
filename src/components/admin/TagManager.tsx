"use client";

import { useState } from "react";
import { Tags, Plus, Trash2, Search, CheckCircle2, AlertCircle, X } from "lucide-react";
import { saveTagAction, deleteTagAction } from "@/lib/cms/actions";
import { CMSTag } from "@/lib/cms/types";

interface TagManagerProps {
  initialTags: CMSTag[];
}

export function TagManager({ initialTags }: TagManagerProps) {
  const [tags, setTags] = useState<CMSTag[]>(initialTags);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const filteredTags = tags.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await saveTagAction(name.trim());
      if (res.success && res.tag) {
        if (!tags.some((t) => t.id === res.tag!.id)) {
          setTags((prev) => [...prev, res.tag!]);
        }
        setName("");
        setFeedback({ type: "success", text: "Tag added successfully." });
      }
    } catch {
      setFeedback({ type: "error", text: "Error creating tag." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTag = async (id: string, tagName: string) => {
    if (!confirm(`Are you sure you want to delete tag "#${tagName}"?`)) return;

    try {
      const res = await deleteTagAction(id);
      if (res.success) {
        setTags((prev) => prev.filter((t) => t.id !== id));
        setFeedback({ type: "success", text: "Tag removed." });
      }
    } catch {
      setFeedback({ type: "error", text: "Error removing tag." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-signal/10 px-3 py-0.5 text-[10px] font-mono-label font-bold uppercase tracking-wider text-signal mb-1">
            <Tags size={12} />
            <span>Tag Engine</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Tags Management
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Micro-taxonomies used for article cross-linking and user discovery.
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-2xl flex items-center justify-between text-xs font-medium ${
            feedback.type === "success"
              ? "bg-green-50 text-green-900 border border-green-200"
              : "bg-red-50 text-red-900 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{feedback.text}</span>
          </div>
          <button type="button" onClick={() => setFeedback(null)} className="p-1 cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="p-6 rounded-3xl bg-white border border-border shadow-sm space-y-6">
        {/* Create Tag Bar */}
        <form onSubmit={handleAddTag} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-lg">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Next.js 16, Meta Ads, SEO"
            className="flex-1 text-xs p-3 rounded-full border border-border bg-black/[0.02] focus:bg-white focus:border-signal outline-none"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-full bg-signal text-white text-xs font-bold shadow-[2px_2px_0_0_#0d0d0a] hover:scale-102 active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus size={14} />
            <span>Add Tag</span>
          </button>
        </form>

        {/* Filter Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="font-mono-label text-xs uppercase text-muted font-bold">
            All Tags ({tags.length})
          </span>
          <div className="relative w-48">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-border bg-black/[0.02] outline-none"
            />
          </div>
        </div>

        {/* Tag Cloud Pills */}
        <div className="flex flex-wrap gap-2.5 pt-2">
          {filteredTags.map((t) => (
            <div
              key={t.id}
              className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.03] hover:bg-black/[0.06] border border-border text-xs text-foreground transition-colors"
            >
              <span className="font-mono-label font-bold text-signal">#{t.name}</span>
              <span className="text-[10px] font-mono text-muted">({t.count ?? 0})</span>
              <button
                type="button"
                onClick={() => handleDeleteTag(t.id, t.name)}
                className="opacity-40 group-hover:opacity-100 hover:text-red-600 transition-opacity p-0.5 cursor-pointer"
                title="Delete Tag"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
