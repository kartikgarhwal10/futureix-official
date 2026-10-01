import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted font-mono-label overflow-x-auto py-1">
      <Link href="/" className="inline-flex items-center gap-1 hover:text-foreground transition-colors shrink-0">
        <Home size={12} />
        <span>Home</span>
      </Link>
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-1.5 shrink-0">
          <ChevronRight size={12} className="text-muted/60" />
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-semibold line-clamp-1 max-w-[200px] sm:max-w-[350px]">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
