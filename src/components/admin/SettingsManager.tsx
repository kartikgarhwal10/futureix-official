"use client";

import { useState } from "react";
import {
  Settings,
  Database,
  RefreshCw,
  Save,
  CheckCircle2,
  AlertCircle,
  X,
  FileCode,
} from "lucide-react";
import { updateSettingsAction, triggerRevalidationAction } from "@/lib/cms/actions";
import { CMSSettings } from "@/lib/cms/types";

interface SettingsManagerProps {
  initialSettings: CMSSettings;
}

export function SettingsManager({ initialSettings }: SettingsManagerProps) {
  const [settings, setSettings] = useState<CMSSettings>(initialSettings);
  const [siteName, setSiteName] = useState(initialSettings.siteName);
  const [defaultAuthorName, setDefaultAuthorName] = useState(initialSettings.defaultAuthorName);
  const [defaultAuthorRole, setDefaultAuthorRole] = useState(initialSettings.defaultAuthorRole);
  const [defaultAuthorBio, setDefaultAuthorBio] = useState(initialSettings.defaultAuthorBio);
  const [postsPerPage, setPostsPerPage] = useState(initialSettings.postsPerPage);

  const [isSaving, setIsSaving] = useState(false);
  const [isRevalidating, setIsRevalidating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateSettingsAction({
        siteName,
        defaultAuthorName,
        defaultAuthorRole,
        defaultAuthorBio,
        postsPerPage: Number(postsPerPage),
      });

      if (res.success && res.settings) {
        setSettings(res.settings);
        setFeedback({ type: "success", text: "CMS configuration saved successfully!" });
      } else {
        setFeedback({ type: "error", text: "Failed to update settings." });
      }
    } catch {
      setFeedback({ type: "error", text: "Error saving CMS configuration." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTriggerRevalidation = async () => {
    setIsRevalidating(true);
    try {
      const res = await triggerRevalidationAction();
      if (res.success) {
        setFeedback({
          type: "success",
          text: `All public pages (/blog, /blog/[slug], sitemap.xml) revalidated at ${res.timestamp}!`,
        });
      }
    } catch {
      setFeedback({ type: "error", text: "Revalidation failed." });
    } finally {
      setIsRevalidating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-signal/10 px-3 py-0.5 text-[10px] font-mono-label font-bold uppercase tracking-wider text-signal mb-1">
            <Settings size={12} />
            <span>Platform Configuration</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            CMS Settings &amp; Infrastructure
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Manage author defaults, storage connectivity, and Next.js ISR cache invalidation.
          </p>
        </div>

        <button
          type="button"
          onClick={handleTriggerRevalidation}
          disabled={isRevalidating}
          className="inline-flex items-center gap-2 rounded-full glass px-5 py-2.5 text-xs font-bold text-foreground hover:bg-black/5 disabled:opacity-50 transition-colors cursor-pointer shrink-0"
        >
          <RefreshCw size={14} className={isRevalidating ? "animate-spin" : ""} />
          <span>{isRevalidating ? "Revalidating..." : "Purge & Revalidate Cache"}</span>
        </button>
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
        {/* Left Column: General Configuration Form (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-border shadow-sm space-y-5">
          <h3 className="font-display text-base font-bold text-foreground pb-2 border-b border-border">
            General CMS Preferences
          </h3>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-mono-label uppercase text-muted mb-1">
                Website / Brand Name
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-border bg-black/[0.02] focus:bg-white focus:border-signal outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono-label uppercase text-muted mb-1">
                  Default Author Name
                </label>
                <input
                  type="text"
                  value={defaultAuthorName}
                  onChange={(e) => setDefaultAuthorName(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-border bg-black/[0.02] focus:bg-white focus:border-signal outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-label uppercase text-muted mb-1">
                  Default Author Role
                </label>
                <input
                  type="text"
                  value={defaultAuthorRole}
                  onChange={(e) => setDefaultAuthorRole(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-border bg-black/[0.02] focus:bg-white focus:border-signal outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono-label uppercase text-muted mb-1">
                Default Author Biography
              </label>
              <textarea
                rows={3}
                value={defaultAuthorBio}
                onChange={(e) => setDefaultAuthorBio(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-border bg-black/[0.02] focus:bg-white focus:border-signal outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-label uppercase text-muted mb-1">
                Articles Per Page (Public Blog Listing)
              </label>
              <input
                type="number"
                min={3}
                max={50}
                value={postsPerPage}
                onChange={(e) => setPostsPerPage(Number(e.target.value))}
                className="w-32 text-xs p-3 rounded-xl border border-border bg-black/[0.02] focus:bg-white focus:border-signal outline-none font-mono"
              />
            </div>

            <div className="pt-3 border-t border-border">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-full bg-signal text-white text-xs font-bold shadow-[2px_2px_0_0_#0d0d0a] hover:scale-102 active:scale-98 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save size={14} />
                <span>{isSaving ? "Saving..." : "Save Preferences"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Database & Migration Guide (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Connection Status Box */}
          <div className="p-6 rounded-3xl bg-white border border-border shadow-sm space-y-4">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
              Supabase PostgreSQL Connection
            </h3>

            <div className="p-4 rounded-2xl bg-black/[0.02] border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Database size={15} className="text-signal" />
                  <span>Connection Mode</span>
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono-label uppercase ${
                    settings.supabaseConnected
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {settings.supabaseConnected ? "Supabase Live" : "Local Resilient Store"}
                </span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                {settings.supabaseConnected
                  ? "Connected directly to your Supabase PostgreSQL cluster with Row Level Security."
                  : "Currently running with zero-dependency local JSON storage. To connect to your production Supabase database, set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file."}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-foreground font-mono-label text-[11px] uppercase">
                Required Environment Keys:
              </h4>
              <pre className="p-3 rounded-xl bg-zinc-900 text-lime font-mono text-[11px] overflow-x-auto leading-relaxed">
{`NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_EMAIL=admin@futureix.in
ADMIN_PASSWORD=...`}
              </pre>
            </div>

            <div className="pt-2 border-t border-border space-y-2 text-xs text-muted">
              <p className="flex items-center gap-1.5 font-bold text-foreground">
                <FileCode size={14} className="text-signal" />
                <span>SQL Migration Script Ready</span>
              </p>
              <p className="text-[11px]">
                The complete SQL migration with tables, indexes, and RLS policies is saved at:
              </p>
              <code className="block p-2 rounded-lg bg-black/5 font-mono text-[10px] text-foreground truncate">
                supabase/migrations/20261013000000_create_cms_tables.sql
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
