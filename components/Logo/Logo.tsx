"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Logo() {
  const router = useRouter();

  return (
    <div
      className="min-h-20 h-20 flex items-center px-6 border-b cursor-pointer gap-2 "
      onClick={() => router.push("/")}
    >
      <Image src="/logo.svg" alt="Logo" width={40} height={40} priority />
      <h1 className="text-xl font-bold">Word Code</h1>
    </div>
  );
}
