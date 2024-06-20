import Logo from "@/components/Logo/Logo";
import React from "react";

export default function LayoutAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-center h-full items-center">
      <Logo />
      <h1 className="text-2xl mb-3">Welcome to the Word Code Dashboard</h1>
      <h1 className="text-2xl mb-3">WordCode Dashboard</h1>
      {children}
    </div>
  );
}
