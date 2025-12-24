"use client";

import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { LogIn } from "lucide-react";
import { useState, useEffect } from "react";

export function AuthNav() {
  const { isSignedIn, isLoaded } = useUser();
  const [remaining, setRemaining] = useState<number | null>(null);

  // Fetch fresh usage count from API
  useEffect(() => {
    if (isSignedIn) {
      const fetchUsage = async () => {
        try {
          const res = await fetch("/api/usage");
          if (res.ok) {
            const data = await res.json();
            setRemaining(data.remaining);
          }
        } catch {
          // Ignore errors
        }
      };

      fetchUsage();

      // Refresh every 5 seconds while on page
      const interval = setInterval(fetchUsage, 5000);
      return () => clearInterval(interval);
    }
  }, [isSignedIn]);

  if (!isLoaded) {
    return <div className="w-8 h-8 rounded-full bg-[var(--stone)] animate-pulse" />;
  }

  if (isSignedIn) {
    return (
      <>
        {remaining !== null && (
          <span className="text-sm text-[var(--slate)] font-sans">
            <span className="font-semibold text-[var(--navy)]">{remaining}</span> free left
          </span>
        )}
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
