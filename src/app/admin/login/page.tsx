"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";
import { loginAdminAction } from "@/lib/cms/actions";
import { sanitizeRedirectPath } from "@/lib/cms/sanitize";

export const dynamic = "force-dynamic";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirect");
  const redirectTarget = sanitizeRedirectPath(rawRedirect, "/admin/dashboard");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const res = await loginAdminAction(formData);

      if (res.success) {
        router.push(redirectTarget);
        router.refresh();
      } else {
        setErrorMsg(res.error || "Authentication failed. Please check your credentials.");
      }
    } catch {
      setErrorMsg("An unexpected error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 glass rounded-3xl p-6 sm:p-10 bg-white shadow-xl relative overflow-hidden border border-border">
      {errorMsg && (
        <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-900">
          <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="admin-email" className="block text-xs font-mono-label uppercase text-muted mb-1.5">
            Admin Email Address
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@futureix.in"
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 rounded-xl border border-border bg-black/[0.02] focus:bg-white focus:border-signal outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label htmlFor="admin-password" className="block text-xs font-mono-label uppercase text-muted mb-1.5">
            Administrator Password
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 rounded-xl border border-border bg-black/[0.02] focus:bg-white focus:border-signal outline-none transition-all"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-full bg-signal text-white text-xs sm:text-sm font-bold shadow-[3px_3px_0_0_#0d0d0a] hover:scale-102 active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 pt-5 border-t border-border/80 flex items-center justify-between text-[11px] text-muted">
        <Link href="/" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
          <ArrowLeft size={12} />
          <span>Back to Website</span>
        </Link>
        <span className="font-mono-label">Authorized Personnel Only</span>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#efe8d8] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background radial accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[35rem] w-[35rem] rounded-full bg-signal/10 blur-[130px]"
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center">
          <Link href="/" className="inline-block hover:scale-105 transition-transform">
            <Logo className="h-9 w-auto mx-auto" />
          </Link>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1 text-[10px] font-mono-label font-bold uppercase tracking-widest text-background">
            <ShieldCheck size={12} className="text-lime" />
            <span>Admin Control Panel</span>
          </div>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Sign In to FUTUREIX CMS
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-muted">
            Manage articles, categories, media, and technical SEO.
          </p>
        </div>

        <Suspense fallback={
          <div className="mt-8 rounded-3xl p-8 bg-white/70 border border-border text-center text-xs text-muted">
            Loading secure authentication form...
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
