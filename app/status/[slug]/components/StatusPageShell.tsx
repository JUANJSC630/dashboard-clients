import type { ReactNode } from "react";
import Image from "next/image";

export function StatusPageShell({
  title,
  logoUrl,
  brandColor,
  customCss,
  children,
}: {
  title: string;
  logoUrl: string | null;
  brandColor: string;
  customCss: string | null;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7f8fa] dark:bg-[#0b0c10] text-[#1a1a2e]">
      {/* Custom CSS applied via a scoped style tag — content is sanitized at API layer */}
      {customCss && <style>{customCss}</style>}

      {/* Header */}
      <header className="border-b border-[#e5e7eb] dark:border-[#1f2937] bg-white dark:bg-[#111318]">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-3">
          {logoUrl && (
            <Image
              src={logoUrl}
              alt={title}
              width={32}
              height={32}
              className="h-8 w-auto object-contain"
              unoptimized
            />
          )}
          <h1 className="text-lg font-semibold text-[#0f172a] dark:text-white tracking-tight">
            {title}
          </h1>
        </div>
      </header>

      {/* Top accent bar */}
      <div className="h-1" style={{ backgroundColor: brandColor }} />

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e5e7eb] dark:border-[#1f2937] bg-white dark:bg-[#111318]">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-[#6b7280] dark:text-[#9ca3af]">
            Powered by{" "}
            <span className="font-medium text-[#374151] dark:text-[#d1d5db]">
              Hosting Dashboard
            </span>
          </p>
          <p className="text-xs text-[#6b7280] dark:text-[#9ca3af]" suppressHydrationWarning>
            Last updated {new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
          </p>
        </div>
      </footer>
    </div>
  );
}
