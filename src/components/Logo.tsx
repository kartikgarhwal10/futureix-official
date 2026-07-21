import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src="/logo-mark.png"
        alt="FUTUREIX"
        width={1810}
        height={398}
        priority
        className="h-full w-auto object-contain"
      />
    </span>
  );
}
