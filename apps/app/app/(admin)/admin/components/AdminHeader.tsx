"use client";

import { Shield } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  user: { name: string; email: string };
}

export default function AdminHeader({ title, user }: AdminHeaderProps) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-50 text-amber-600 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5" />
          ADMIN
        </div>
        <h1 className="text-lg font-bold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-xs font-bold text-white">
          {initials}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-xs font-semibold text-gray-800 leading-none">{user.name.split(" ")[0]}</p>
          <p className="text-xs text-gray-400 mt-0.5 leading-none">{user.email}</p>
        </div>
      </div>
    </header>
  );
}
