import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg viewBox="0 0 64 64" className="h-full w-auto" aria-hidden>
        <defs>
          <linearGradient id="fx-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff4423" />
            <stop offset="55%" stopColor="#cbff3d" />
            <stop offset="100%" stopColor="#0d0d0a" />
          </linearGradient>
        </defs>
        <path
          d="M8 8H32L20 22H8V8Z"
          fill="url(#fx-gradient)"
        />
        <path
          d="M8 24H24L12 38H8V24Z"
          fill="url(#fx-gradient)"
        />
        <path
          d="M32 8L56 56H42L8 56L32 8Z"
          fill="url(#fx-gradient)"
          opacity="0.9"
        />
      </svg>
      <span className="font-display tracking-wide text-lg text-foreground">
        FUTURE<span className="text-signal">IX</span>
      </span>
    </span>
  );
}
