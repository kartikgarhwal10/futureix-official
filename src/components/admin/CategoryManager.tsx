"use client";

import { useState } from "react";
import { FolderTree, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, X, Search } from "lucide-react";
import { saveCategoryAction, deleteCategoryAction } from "@/lib/cms/actions";
import { CMSCategory } from "@/lib/cms/types";

interface CategoryManagerProps {
  initialCategories: CMSCategory[];
}

export function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const [categories, setCategories] = useState<CMSCategory[]>(initialCategories);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditClick = (cat: CMSCategory) => {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setDescription("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await saveCategoryAction(name.trim(), description.trim(), editingId || undefined);
      if (res.success && res.category) {
        if (editingId) {
          setCategories((prev) => prev.map((c) => (c.id === editingId ? res.category! : c)));
          setFeedback({ type: "success", text: "Category updated successfully." });
        } else {
          setCategories((prev) => [...prev, res.category!]);
          setFeedback({ type: "success", text: "New category created successfully." });
        }
        handleCancelEdit();
      } else {
        setFeedback({ type: "error", text: "Failed to save category." });
      }
    } catch {
      setFeedback({ type: "error", text: "Error saving category." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"?`)) return;

    try {
      const res = await deleteCategoryAction(id);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        setFeedback({ type: "success", text: "Category removed." });
      }
    } catch {
      setFeedback({ type: "error", text: "Error deleting category." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-signal/10 px-3 py-0.5 text-[10px] font-mono-label font-bold uppercase tracking-wider text-signal mb-1">
            <FolderTree size={12} />
            <span>Taxonomy Engine</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Categories Management
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Organize articles into thematic silos to optimize technical SEO hierarchy.
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form (4 cols) */}
        <div className="lg:col-span-4 p-5 sm:p-6 rounded-3xl bg-white border border-border shadow-sm space-y-4">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
            {editingId ? "Edit Category" : "Add New Category"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono-label uppercase text-muted mb-1">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. AI Automation"
                className="w-full text-xs p-3 rounded-xl border border-border bg-black/[0.02] focus:bg-white focus:border-signal outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-label uppercase text-muted mb-1">
                Description (Optional)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of topics covered in this category..."
                className="w-full text-xs p-3 rounded-xl border border-border bg-black/[0.02] focus:bg-white focus:border-signal outline-none resize-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-full bg-signal text-white text-xs font-bold shadow-[2px_2px_0_0_#0d0d0a] hover:scale-102 active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} />
                <span>{editingId ? "Save Changes" : "Create Category"}</span>
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2.5 rounded-full glass text-xs font-semibold text-muted hover:text-foreground cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: Categories List (8 cols) */}
        <div className="lg:col-span-8 p-5 sm:p-6 rounded-3xl bg-white border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
              Existing Categories ({categories.length})
            </h3>
            <div className="relative w-48">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Filter categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-border bg-black/[0.02] outline-none"
              />
            </div>
          </div>

          <div className="divide-y divide-border/60">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="py-3.5 flex items-center justify-between gap-4 group hover:bg-black/[0.01] px-2 rounded-xl transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-bold text-sm text-foreground">
                      {cat.name}
                    </h4>
                    <span className="font-mono text-[10px] text-muted">
                      /{cat.slug}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-black/5 font-mono-label text-[10px] text-foreground font-bold">
                      {cat.count ?? 0} posts
                    </span>
                  </div>
                  {cat.description && (
                    <p className="text-xs text-muted mt-0.5 line-clamp-1">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEditClick(cat)}
                    className="p-1.5 rounded-lg bg-black/5 hover:bg-black/10 text-muted hover:text-foreground transition-colors cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1.5 rounded-lg text-muted hover:text-red-600 transition-colors cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
