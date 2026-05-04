'use client';

import { signOut } from "next-auth/react";
import { LogOut, Loader2 } from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";

export default function LogoutButton() {
  const locale = useLocale();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      // We use redirect: true to let NextAuth handle it, but we also specify a clean callback
      await signOut({ 
        callbackUrl: `/${locale}/login`,
        redirect: true 
      });
    } catch (error) {
      console.error("Logout failed:", error);
      // Fallback if NextAuth hangs
      window.location.href = `/${locale}/login`;
    }
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex items-center gap-3 px-4 py-3 text-red-500/50 hover:text-red-500 transition-colors text-xs uppercase tracking-widest font-bold w-full disabled:opacity-50"
    >
      {isLoggingOut ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <LogOut size={16} />
      )}
      {isLoggingOut ? 'Bezig...' : 'Uitloggen'}
    </button>
  );
}
