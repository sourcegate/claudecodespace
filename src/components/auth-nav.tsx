"use client";

import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { LogIn } from "lucide-react";

export function AuthNav() {
  const { isSignedIn, isLoaded, user } = useUser();

  const generationsUsed = (user?.publicMetadata?.generationCount as number) || 0;
  const generationsRemaining = Math.max(0, 3 - generationsUsed);

  if (!isLoaded) {
    return <div className="w-8 h-8 rounded-full bg-[var(--stone)] animate-pulse" />;
  }

  if (isSignedIn) {
    return (
      <>
        <span className="text-sm text-[var(--slate)] font-sans">
          <span className="font-semibold text-[var(--navy)]">{generationsRemaining}</span> free left
        </span>
        <UserButton afterSignOutUrl="/" />
      </>
    );
  }

  return (
    <SignInButton mode="modal">
      <button className="flex items-center gap-2 px-4 py-2 bg-[var(--navy)] text-white rounded-lg font-sans font-medium text-sm hover:bg-[var(--navy)]/90 transition-colors">
        <LogIn className="w-4 h-4" />
        Sign In
      </button>
    </SignInButton>
  );
}
