import Image from "next/image";
import React from "react";

export default function LayoutAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[1fr_1fr]">
      {/* Left — brand panel */}
      <div className="hidden lg:flex flex-col justify-between p-14 bg-zinc-950 text-white">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="Word Code"
            width={26}
            height={26}
            priority
          />
          <span className="text-sm font-semibold tracking-tight">
            Word Code
          </span>
        </div>

        <div className="space-y-5">
          <p className="text-[2.15rem] font-semibold leading-[1.2] tracking-tight text-white/90">
            Every client.
            <br />
            Every site.
            <br />
            Every invoice.
          </p>
          <p className="text-sm text-white/40 max-w-[28ch]">
            Hosting management built for agencies and independent freelancers.
          </p>
        </div>

        <div className="flex gap-10">
          <div>
            <p className="text-2xl font-bold tabular-nums">100%</p>
            <p className="text-xs text-white/35 mt-1">uptime visibility</p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums">∞</p>
            <p className="text-xs text-white/35 mt-1">clients & sites</p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums">0</p>
            <p className="text-xs text-white/35 mt-1">config required</p>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-col items-center justify-center min-h-screen lg:min-h-0 px-8 py-12 bg-background">
        <div className="flex lg:hidden items-center gap-2.5 mb-10">
          <Image
            src="/logo.svg"
            alt="Word Code"
            width={26}
            height={26}
            priority
          />
          <span className="text-sm font-semibold tracking-tight">
            Word Code
          </span>
        </div>
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
