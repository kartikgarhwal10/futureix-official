"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  PlusCircle,
  Edit,
  Eye,
  Trash2,
  Copy,
  Archive,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import {
  deleteBlogAction,
  publishBlogAction,
  unpublishBlogAction,
  duplicateBlogAction,
  bulkBlogStatusAction,
  archiveBlogAction,
} from "@/lib/cms/actions";
import { CMSBlog, BlogStatus } from "@/lib/cms/types";

interface BlogListTableProps {
  initialBlogs: CMSBlog[];
  categories: string[];
}

export function BlogListTable({ initialBlogs, categories }: BlogListTableProps) {

  const [blogs, setBlogs] = useState<CMSBlog[]>(initialBlogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Filtered and searched blogs
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      searchQuery === "" ||
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "published" && blog.status === "published") ||
      (selectedStatus === "draft" && blog.status === "draft") ||
      (selectedStatus === "scheduled" && blog.status === "scheduled") ||
      (selectedStatus === "archived" && blog.status === "archived");

    const matchesCategory =
      selectedCategory === "all" || blog.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredBlogs.length / pageSize) || 1;
  const paginatedBlogs = filteredBlogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Checkbox selections
  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedBlogs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedBlogs.map((b) => b.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Actions
  const handlePublish = async (id: string) => {
    setActionInProgress(id);
    const res = await publishBlogAction(id);
    if (res.success && res.blog) {
      setBlogs((prev) => prev.map((b) => (b.id === id ? res.blog! : b)));
    }
    setActionInProgress(null);
  };

  const handleUnpublish = async (id: string) => {
    setActionInProgress(id);
    const res = await unpublishBlogAction(id);
    if (res.success && res.blog) {
      setBlogs((prev) => prev.map((b) => (b.id === id ? res.blog! : b)));
    }
    setActionInProgress(null);
  };

  const handleArchive = async (id: string) => {
    if (!confirm("Are you sure you want to archive this article? It will be hidden from public listings.")) return;
    setActionInProgress(id);
    const res = await archiveBlogAction(id);
    if (res.success && res.blog) {
      setBlogs((prev) => prev.map((b) => (b.id === id ? res.blog! : b)));
    }
    setActionInProgress(null);
  };

  const handleDuplicate = async (id: string) => {
    setActionInProgress(id);
    const res = await duplicateBlogAction(id);
    if (res.success && res.blog) {
      setBlogs((prev) => [res.blog!, ...prev]);
    }
    setActionInProgress(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article? This action cannot be undone.")) return;
    setActionInProgress(id);
    const res = await deleteBlogAction(id, true);
    if (res.success) {
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
    setActionInProgress(null);
  };

  // Bulk Actions
  const handleBulkStatus = async (status: BlogStatus) => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to change status to "${status.toUpperCase()}" for ${selectedIds.length} article(s)?`)) return;

    setActionInProgress("bulk");
    const res = await bulkBlogStatusAction(selectedIds, status);
    if (res.success) {
      setBlogs((prev) =>
        prev.map((b) => (selectedIds.includes(b.id) ? { ...b, status } : b))
      );
      setSelectedIds([]);
    }
    setActionInProgress(null);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header Bar */}
      <div className="p-5 rounded-3xl bg-white border border-border shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search by title, slug, or author..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-full border border-border bg-black/[0.02] focus:bg-white focus:border-signal outline-none transition-all"
            />
          </div>

          {/* New Article Action */}
          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2.5 text-xs font-bold text-white shadow-[2px_2px_0_0_#0d0d0a] hover:scale-105 active:scale-95 transition-all cursor-pointer self-start md:self-auto shrink-0"
          >
            <PlusCircle size={15} />
            <span>Create New Article</span>
          </Link>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/70 text-xs">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {["all", "published", "draft", "scheduled", "archived"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  setSelectedStatus(st);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer ${
                  selectedStatus === st
                    ? "bg-foreground text-background shadow-xs"
                    : "bg-black/5 text-muted hover:text-foreground"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Category Dropdown Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <Filter size={13} className="text-muted" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs font-medium p-1.5 rounded-lg border border-border bg-black/[0.02] outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Action Strip (appears when items selected) */}
      {selectedIds.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-foreground text-background flex flex-wrap items-center justify-between gap-3 shadow-md animate-in fade-in duration-200">
          <div className="text-xs font-bold">
            {selectedIds.length} article(s) selected
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleBulkStatus("published")}
              disabled={actionInProgress === "bulk"}
              className="px-3 py-1 rounded-full bg-green-500 text-white text-[11px] font-bold hover:bg-green-600 cursor-pointer"
            >
              Publish Selected
            </button>
            <button
              type="button"
              onClick={() => handleBulkStatus("draft")}
              disabled={actionInProgress === "bulk"}
              className="px-3 py-1 rounded-full bg-zinc-700 text-white text-[11px] font-bold hover:bg-zinc-600 cursor-pointer"
            >
              Unpublish to Draft
            </button>
            <button
              type="button"
              onClick={() => handleBulkStatus("archived")}
              disabled={actionInProgress === "bulk"}
              className="px-3 py-1 rounded-full bg-amber-600 text-white text-[11px] font-bold hover:bg-amber-700 cursor-pointer"
            >
              Archive Selected
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1 text-[11px] text-white/70 hover:text-white cursor-pointer"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Main Table Container */}
      <div className="rounded-3xl bg-white border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8f6f0] border-b border-border font-mono-label uppercase text-[10px] text-muted tracking-wider">
              <tr>
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === paginatedBlogs.length && paginatedBlogs.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded accent-signal"
                  />
                </th>
                <th className="py-3 px-4">Article</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">SEO Health</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {paginatedBlogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted">
                    No articles found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedBlogs.map((blog) => {
                  const isBusy = actionInProgress === blog.id;
                  const hasGoodSeo = Boolean(blog.metaTitle && blog.metaDescription && blog.primaryKeyword && blog.image);

                  return (
                    <tr
                      key={blog.id}
                      className="hover:bg-black/[0.01] transition-colors group"
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(blog.id)}
                          onChange={() => toggleSelectOne(blog.id)}
                          className="rounded accent-signal"
                        />
                      </td>

                      {/* Thumbnail & Title */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-16 rounded-lg overflow-hidden bg-zinc-900 border border-border shrink-0">
                            {blog.image ? (
                              <Image src={blog.image} alt={blog.title} fill className="object-cover" sizes="64px" />
                            ) : null}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/admin/blogs/${blog.id}/edit`}
                              className="font-display font-bold text-foreground hover:text-signal transition-colors line-clamp-1 block text-[13px]"
                            >
                              {blog.title}
                            </Link>
                            <p className="text-[11px] font-mono text-muted truncate mt-0.5">
                              /{blog.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-muted font-medium">
                        {blog.category}
                      </td>

                      {/* Author */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-muted">
                        {blog.author.name}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-mono-label font-bold uppercase ${
                            blog.status === "published"
                              ? "bg-green-100 text-green-800"
                              : blog.status === "scheduled"
                              ? "bg-amber-100 text-amber-800"
                              : blog.status === "archived"
                              ? "bg-zinc-200 text-zinc-700"
                              : "bg-zinc-100 text-zinc-700"
                          }`}
                        >
                          {blog.status}
                        </span>
                      </td>

                      {/* SEO Health */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {hasGoodSeo ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-green-700 font-semibold">
                            <CheckCircle2 size={13} />
                            <span>Optimized</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 font-medium">
                            <AlertCircle size={13} />
                            <span>Needs Info</span>
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-[11px] font-mono text-muted">
                        {blog.publishedAt || blog.createdAt.slice(0, 10)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100">
                          {/* Edit button */}
                          <Link
                            href={`/admin/blogs/${blog.id}/edit`}
                            className="p-1.5 rounded-lg bg-black/5 hover:bg-black/10 text-foreground transition-colors"
                            title="Edit Article"
                          >
                            <Edit size={14} />
                          </Link>

                          {/* Live preview / public view */}
                          {blog.status === "published" ? (
                            <Link
                              href={`/blog/${blog.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg text-muted hover:text-signal transition-colors"
                              title="Open Public Link"
                            >
                              <ExternalLink size={14} />
                            </Link>
                          ) : (
                            <Link
                              href={`/admin/blogs/${blog.id}/edit`}
                              className="p-1.5 rounded-lg text-muted hover:text-foreground transition-colors"
                              title="Preview in Editor"
                            >
                              <Eye size={14} />
                            </Link>
                          )}

                          {/* Quick Publish / Unpublish Toggle */}
                          {blog.status === "published" ? (
                            <button
                              type="button"
                              onClick={() => handleUnpublish(blog.id)}
                              disabled={isBusy}
                              className="p-1.5 rounded-lg text-muted hover:text-amber-600 transition-colors cursor-pointer"
                              title="Unpublish to Draft"
                            >
                              <Clock size={14} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handlePublish(blog.id)}
                              disabled={isBusy}
                              className="p-1.5 rounded-lg text-muted hover:text-green-600 transition-colors cursor-pointer"
                              title="Publish Now"
                            >
                              <Send size={14} />
                            </button>
                          )}

                          {/* Duplicate */}
                          <button
                            type="button"
                            onClick={() => handleDuplicate(blog.id)}
                            disabled={isBusy}
                            className="p-1.5 rounded-lg text-muted hover:text-foreground transition-colors cursor-pointer"
                            title="Duplicate Article"
                          >
                            <Copy size={14} />
                          </button>

                          {/* Archive */}
                          {blog.status !== "archived" && (
                            <button
                              type="button"
                              onClick={() => handleArchive(blog.id)}
                              disabled={isBusy}
                              className="p-1.5 rounded-lg text-muted hover:text-amber-600 transition-colors cursor-pointer"
                              title="Archive Article"
                            >
                              <Archive size={14} />
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDelete(blog.id)}
                            disabled={isBusy}
                            className="p-1.5 rounded-lg text-muted hover:text-red-600 transition-colors cursor-pointer"
                            title="Delete Article"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
          <span>
            Showing {filteredBlogs.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filteredBlogs.length)} of {filteredBlogs.length} articles
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-1.5 rounded-lg border border-border disabled:opacity-40 hover:bg-black/5 cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-mono-label font-bold text-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-1.5 rounded-lg border border-border disabled:opacity-40 hover:bg-black/5 cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
