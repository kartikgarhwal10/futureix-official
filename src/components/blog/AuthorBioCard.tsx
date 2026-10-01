import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface AuthorBioCardProps {
  author: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
}

export function AuthorBioCard({ author }: AuthorBioCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 shrink-0 rounded-full bg-gradient-primary flex items-center justify-center font-bold text-base text-white shadow-md">
            {author.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-bold text-foreground">{author.name}</h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 size={10} /> Verified Author
              </span>
            </div>
            <p className="text-xs text-muted font-mono-label">{author.role} · FUTUREIX</p>
            <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed max-w-xl">
              {author.bio}
            </p>
          </div>
        </div>

        <Link
          href="/#founders"
          className="shrink-0 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-xs font-semibold text-background shadow-[3px_3px_0_0_var(--lime)] transition-all hover:scale-105 active:scale-95"
        >
          About The Founder
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
