export function SectionTag({ number, label }: { number: string; label: string }) {
  return (
    <div className="tag-badge">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lime text-[11px] font-bold text-foreground">
        {number}
      </span>
      <span className="pr-2 text-xs font-semibold uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}
