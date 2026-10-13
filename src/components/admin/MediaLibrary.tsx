"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  Upload,
  Copy,
  Check,
  Trash2,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { uploadMediaAction, deleteMediaAction } from "@/lib/cms/actions";
import { CMSMedia } from "@/lib/cms/types";

interface MediaLibraryProps {
  initialMedia: CMSMedia[];
}

export function MediaLibrary({ initialMedia }: MediaLibraryProps) {
  const [mediaList, setMediaList] = useState<CMSMedia[]>(initialMedia);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [altText, setAltText] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredMedia = mediaList.filter(
    (m) =>
      m.filename.toLowerCase().includes(search.toLowerCase()) ||
      m.altText.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopyUrl = (id: string, url: string) => {
    if (navigator.clipboard) {
      const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`;
      navigator.clipboard.writeText(fullUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("altText", altText || file.name);

    try {
      const res = await uploadMediaAction(formData);
      if (res.success && res.media) {
        setMediaList((prev) => [res.media!, ...prev]);
        setAltText("");
        setFeedback({ type: "success", text: "Image uploaded to media repository!" });
      } else {
        setFeedback({ type: "error", text: res.error || "Failed to upload image." });
      }
    } catch {
      setFeedback({ type: "error", text: "Image upload failed." });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string, filename: string) => {
    if (!confirm(`Are you sure you want to delete media file "${filename}"?`)) return;

    try {
      const res = await deleteMediaAction(id);
      if (res.success) {
        setMediaList((prev) => prev.filter((m) => m.id !== id));
        setFeedback({ type: "success", text: "Media file deleted." });
      }
    } catch {
      setFeedback({ type: "error", text: "Error deleting media file." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-signal/10 px-3 py-0.5 text-[10px] font-mono-label font-bold uppercase tracking-wider text-signal mb-1">
            <ImageIcon size={12} />
            <span>Asset Storage</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Media Library
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Store, preview, and copy URLs of images for article illustrations and OpenGraph previews.
          </p>
        </div>

        {/* Upload Trigger */}
        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-2 rounded-full bg-signal px-6 py-2.5 text-xs font-bold text-white shadow-[2px_2px_0_0_#0d0d0a] hover:scale-105 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Upload size={14} />
            <span>{isUploading ? "Uploading..." : "Upload New Image"}</span>
          </button>
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

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-border shadow-sm flex items-center justify-between gap-4">
        <span className="font-mono-label text-xs uppercase text-muted font-bold">
          {filteredMedia.length} Media File(s)
        </span>
        <div className="relative w-64">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search by filename or alt text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-1.5 rounded-full border border-border bg-black/[0.02] outline-none"
          />
        </div>
      </div>

      {/* Media Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.map((media) => (
          <div
            key={media.id}
            className="group rounded-2xl bg-white border border-border overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            {/* Visual Thumbnail */}
            <div className="relative h-40 w-full bg-zinc-900 overflow-hidden">
              <Image
                src={media.url}
                alt={media.altText || media.filename}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <a
                  href={media.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/90 text-foreground hover:scale-110 transition-transform"
                  title="View full image"
                >
                  <ExternalLink size={14} />
                </a>
                <button
                  type="button"
                  onClick={() => handleCopyUrl(media.id, media.url)}
                  className="p-2 rounded-full bg-white/90 text-foreground hover:scale-110 transition-transform cursor-pointer"
                  title="Copy URL"
                >
                  {copiedId === media.id ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(media.id, media.filename)}
                  className="p-2 rounded-full bg-red-600 text-white hover:scale-110 transition-transform cursor-pointer"
                  title="Delete media"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Info Body */}
            <div className="p-3 bg-white space-y-1 border-t border-border">
              <p className="font-bold text-xs text-foreground truncate" title={media.filename}>
                {media.filename}
              </p>
              <p className="text-[10px] text-muted truncate" title={media.altText}>
                Alt: {media.altText || "None"}
              </p>
              <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-muted border-t border-border/50">
                <span>{(media.size / 1024).toFixed(0)} KB</span>
                <button
                  type="button"
                  onClick={() => handleCopyUrl(media.id, media.url)}
                  className="text-signal hover:underline font-bold cursor-pointer"
                >
                  {copiedId === media.id ? "Copied!" : "Copy URL"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
