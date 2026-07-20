import type { Course } from "@/data/courses";

const INK = "#0d0d0a";
const LIME = "#cbff3d";
const SIGNAL = "#ff4423";
const CREAM = "#efe8d8";

function Base({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 400 220"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <rect width="400" height="220" fill={INK} />
      <circle cx="370" cy="20" r="90" fill={LIME} opacity="0.18" />
      <circle cx="20" cy="210" r="70" fill={SIGNAL} opacity="0.2" />
      {children}
    </svg>
  );
}

const thumbnails: Record<Course["thumbnail"], React.ReactNode> = {
  "meta-ads": (
    <Base>
      <rect x="40" y="140" width="26" height="50" fill={CREAM} opacity="0.25" />
      <rect x="80" y="110" width="26" height="80" fill={CREAM} opacity="0.4" />
      <rect x="120" y="80" width="26" height="110" fill={LIME} />
      <rect x="160" y="120" width="26" height="70" fill={CREAM} opacity="0.4" />
      <polyline
        points="40,150 90,100 130,70 170,110 210,50"
        fill="none"
        stroke={SIGNAL}
        strokeWidth="4"
      />
      <circle cx="210" cy="50" r="7" fill={SIGNAL} />
      <rect x="250" y="60" width="110" height="34" rx="17" fill={CREAM} opacity="0.12" />
      <text x="264" y="82" fontSize="15" fill={CREAM} fontFamily="monospace">
        Ad Reach ↑
      </text>
    </Base>
  ),
  "google-ads": (
    <Base>
      <rect x="70" y="90" width="240" height="46" rx="23" fill={CREAM} opacity="0.12" />
      <circle cx="98" cy="113" r="9" fill={LIME} />
      <rect x="118" y="105" width="150" height="6" rx="3" fill={CREAM} opacity="0.5" />
      <rect x="118" y="117" width="90" height="6" rx="3" fill={CREAM} opacity="0.3" />
      <circle cx="230" cy="150" r="34" fill="none" stroke={SIGNAL} strokeWidth="4" />
      <line x1="254" y1="174" x2="278" y2="198" stroke={SIGNAL} strokeWidth="5" strokeLinecap="round" />
    </Base>
  ),
  "website-dev": (
    <Base>
      <rect x="60" y="55" width="280" height="120" rx="10" fill={CREAM} opacity="0.1" />
      <rect x="60" y="55" width="280" height="24" rx="10" fill={CREAM} opacity="0.16" />
      <circle cx="76" cy="67" r="4" fill={SIGNAL} />
      <circle cx="90" cy="67" r="4" fill={LIME} />
      <circle cx="104" cy="67" r="4" fill={CREAM} opacity="0.6" />
      <text x="80" y="130" fontSize="26" fill={LIME} fontFamily="monospace">
        &lt;/&gt;
      </text>
      <text x="180" y="130" fontSize="26" fill={CREAM} opacity="0.7" fontFamily="monospace">
        {"{ }"}
      </text>
    </Base>
  ),
  "landing-page": (
    <Base>
      <rect x="130" y="45" width="140" height="130" rx="8" fill={CREAM} opacity="0.12" />
      <rect x="150" y="65" width="100" height="10" rx="5" fill={CREAM} opacity="0.5" />
      <rect x="150" y="82" width="70" height="6" rx="3" fill={CREAM} opacity="0.3" />
      <rect x="150" y="110" width="80" height="26" rx="13" fill={LIME} />
      <path
        d="M270 150 L300 178 L282 178 L282 200 L258 200 L258 178 L240 178 Z"
        fill={SIGNAL}
      />
    </Base>
  ),
  "video-editing": (
    <Base>
      <rect x="70" y="60" width="260" height="100" rx="10" fill={CREAM} opacity="0.12" />
      <polygon points="185,90 185,130 220,110" fill={LIME} />
      <rect x="70" y="172" width="260" height="8" rx="4" fill={CREAM} opacity="0.25" />
      <rect x="70" y="172" width="90" height="8" rx="4" fill={SIGNAL} />
      <circle cx="160" cy="176" r="6" fill={CREAM} />
    </Base>
  ),
  "ai-saas": (
    <Base>
      <rect x="160" y="70" width="80" height="80" rx="14" fill={CREAM} opacity="0.14" />
      <rect x="178" y="88" width="44" height="44" rx="8" fill={LIME} />
      <line x1="200" y1="70" x2="200" y2="50" stroke={CREAM} strokeWidth="3" opacity="0.5" />
      <circle cx="200" cy="46" r="5" fill={SIGNAL} />
      <line x1="160" y1="110" x2="130" y2="110" stroke={CREAM} strokeWidth="3" opacity="0.5" />
      <circle cx="124" cy="110" r="5" fill={SIGNAL} />
      <line x1="240" y1="110" x2="270" y2="110" stroke={CREAM} strokeWidth="3" opacity="0.5" />
      <circle cx="276" cy="110" r="5" fill={SIGNAL} />
    </Base>
  ),
};

export function CourseThumbnail({ type }: { type: Course["thumbnail"] }) {
  return thumbnails[type];
}
